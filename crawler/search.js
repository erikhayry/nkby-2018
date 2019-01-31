import LOCALES from '../data/locales.json';
import AREAS from '../data/areas.json';
import URLS from '../data/urls.json';
import crawlerResult from '../data/crawler-result-lg.json';
import { crawl , saveData} from "./utils.js";

const DATA_URL = process.env.DATA_URL || 'http://localhost:8080';
const RESULT_FILE_NAME = process.env.RESULT_FILE_NAME || 'crawler-result-lg.json';
const SEARCH_CONF = {
    replaceData: process.env.REPLACE_DATA || false,
    researchAll: process.env.RESEARCH_ALL || false
};

function getKey(addressWithStreetNumber, name){
    const address = addressWithStreetNumber && addressWithStreetNumber[0];
    if(!address){
        return name;
    }
    const postcode = address.substring(address.lastIndexOf(' ') + 1);
    if(Number.isInteger(Number(postcode)) && postcode.length < 3 && postcode.length > 0){
        return address;
    }

    return name;
}

function trimSpaces(copy){
    copy = copy.replace(/(^\s*)|(\s*$)/gi,"");
    copy = copy.replace(/(\r\n|\n|\r)/gm,"");
    copy = copy.replace(/[ ]{2,}/gi," ");
    copy = copy.replace(/ \./gi,".")

    return copy;
}

function getImageDescription(el){
    if(el && el.name === 'br'){
        let next = el.next;
        let desc = '';

        while(next){
            if(next.type === 'text'){
                desc += next.data;
                next = next.next;
            } else if(next.name === 'a') {
                if(next.children && next.children.length > 0){
                    desc += ` ${next.children[0].data || ''} `;
                }
                next = next.next;
            } else if(next.name === 'span') {
                if(next.children && next.children.length > 0){
                    desc += ` ${next.children[0].data || ''} `;
                }
                next = next.next;
            }
            else {
                next = undefined;
            }
        }

        return trimSpaces(desc);

    }

    return undefined;
}

function buildLocaleId(name, zipCode, type){
    return zipCode ? `${name}-${zipCode}` : `${name}-${type}`;
}

function isLocaleAlreadyAdded(localeName, zipCode, type){
    const id = buildLocaleId(localeName, zipCode, type);

    return Boolean(crawlerResult[id]);
}

function searchUrls(zipCodeAndLocales) {
    const urls = URLS
        .filter(url => url.indexOf('sidor/texter/') === 0 || url.indexOf('sidor/kortindi/') === 0)
        .map(url => `${DATA_URL}/${url}`)
        //.slice(0, 1);

    const {replaceData, researchAll} = SEARCH_CONF;

    console.log(`Searching ${urls.length} urls for locales`);
    console.log(`replaceData: ${replaceData}`);
    console.log(`researchAll: ${researchAll}`);
    console.log(`zipCodeAndLocales nro: ${zipCodeAndLocales.length}`);

    function onPage($, result = {}, error, res, done){
        Object.keys(zipCodeAndLocales).forEach(key => {
            const {zipCode, localeNames} = zipCodeAndLocales[key];
            let { type } = zipCodeAndLocales[key];
            localeNames.forEach(localeName => {
                const skipLocale = !researchAll && isLocaleAlreadyAdded(localeName, zipCode, type);

                if(!skipLocale) {
                    if ($) {
                        const body = $("body");
                        const bodyText = (body.text() || '').toLowerCase();
                        const title = $("title").text() || '';
                        const images = Array.from($('body img')).map((el) => {
                            return {
                                src: el.attribs.src.replace('../../../', ''),
                                description: el.attribs.alt || getImageDescription(el.nextSibling)
                            }
                        });

                        if (bodyText.indexOf(localeName.toLowerCase()) > 0) {
                            const re = new RegExp(`\\b${localeName.toLowerCase()}\\s[0-9]{1,3}`);
                            let name = localeName;
                            if (type === 'locale') {
                                const addressWithStreetNumber = bodyText.match(re);
                                name = getKey(addressWithStreetNumber, localeName);
                                type = addressWithStreetNumber ? 'address' : 'street'
                            }
                            const key = buildLocaleId(name, zipCode, type);

                            if (result[key]) {
                                result[key].pages.push({
                                    url: res.options.uri.replace(DATA_URL, ''),
                                    title,
                                    images
                                })
                            }
                            else {
                                result[key] = {
                                    name,
                                    zipCode,
                                    type,
                                    pages: [{
                                        url: res.options.uri.replace(DATA_URL, ''),
                                        title,
                                        images,
                                    }]
                                }
                            }
                        }

                    }
                }
            });

        })

        return result;
    }

    function onDone(result){
        return new Promise((resolve, reject) => {
            if(replaceData){
                resolve(result)
            }
            else {
                for (const key in crawlerResult) {
                    result[key] = crawlerResult[key]
                }

                resolve(result)
            }
        });


    }

    return crawl(onPage, urls, onDone)
}

searchUrls(LOCALES.concat(AREAS))
    .then((result) => saveData(result, `${RESULT_FILE_NAME}`));


