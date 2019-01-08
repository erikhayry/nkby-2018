import Crawler from "crawler";
import fs from 'fs';
import ProgressBar from 'progress';
import locales from '../data/locales.json';
import areas from '../data/areas.json';
import urls from '../data/urls.json';
import crawlerResult from '../data/crawler-result-lg.json';

const POST_URL= process.env.POST_URL || 'https://www.verkkoposti.com/e3/svenska/postnummercatalog';
const LOCALES_FILE_NAME= process.env.LOCALES_FILE_NAME || 'locales.json';
const DATA_URL= process.env.DATA_URL || 'http://localhost:8080';
const ZIP_CODE_URL= process.env.ZIP_CODE_URL || 'https://www.verkkoposti.com';
const RESULT_FILE_NAME= process.env.RESULT_FILE_NAME || 'crawler-result-lg.json';

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
                desc += next.data
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

function save(data){
    fs.writeFile(`data/${RESULT_FILE_NAME}`,  JSON.stringify(data, null,'\t'), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`The file data/${RESULT_FILE_NAME} was saved!`);
    });
}

function buildLocaleId(name, zipCode, type){
    return zipCode ? `${name}-${zipCode}` : `${name}-${type}`;
}

function isLocaleAlreadyAdded(localeName, zipCode, type){
    const id = buildLocaleId(localeName, zipCode, type);

    return Boolean(crawlerResult[id]);
}

function searchUrls(zipCodeAndLocales, urls = [], {replaceData = false, onlySearchNewLocales = true} = {}) {
    console.log(`Searching ${urls.length} urls for locales`)
    console.log(`replaceData: ${replaceData}`);
    console.log(`onlySearchNewLocales: ${onlySearchNewLocales}`);

    const result = {};
    let pagesCount = 0;
    const bar = new ProgressBar(':bar', { total: urls.length });

    const c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            } else{
                const $ = res.$;
                bar.tick();

                Object.keys(zipCodeAndLocales).forEach(key => {
                    const {zipCode, localeNames} = zipCodeAndLocales[key];
                    let { type } = zipCodeAndLocales[key];
                    localeNames.forEach(localeName => {
                        const skipLocale = onlySearchNewLocales && isLocaleAlreadyAdded(localeName, zipCode, type);

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
                                    pagesCount++;
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
                    })
                })



            }
            done();
        }
    });

    c.queue(urls.map(url => `${DATA_URL}/${url}`));
    c.on('drain', function() {
        console.log('Searching done');
        console.log(`Matched ${pagesCount} urls to ${Object.keys(result).length} locales`);

        if(replaceData){
            save(result)
        }
        else {
            for (const key in crawlerResult) {
                result[key] = crawlerResult[key]
            }

            save(result)
        }
    });
}

let filteredUrls = urls.filter(url => url.indexOf('sidor/texter/') === 0 || url.indexOf('sidor/kortindi/') === 0);

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getStreetNames(zipCodeUrls){
    return new Promise((resolve, reject) => {
        console.log(`Searching streetnames ${zipCodeUrls}`)
        let result = [];

        const c = new Crawler({
            maxConnections : 10,
            // This will be called for each crawled page
            callback : function (error, res, done) {
                let zipCode = getParameterByName('zipcode', res.request.uri.query)
                if(error){
                    console.log(error);
                } else{
                    const $ = res.$;
                    if($){
                        const localeNameData = $('.data table table td div:not(.ipono_tooltip)')
                        result.push({
                            type: 'locale',
                            zipCode,
                            localeNames: Object.keys(localeNameData).filter(key => localeNameData[key]).map(key => {
                                if(localeNameData[key].children && localeNameData[key].children.length > 0 &&  localeNameData[key].children[0]){
                                    return localeNameData[key].children[0].data.replace(/(\r\n|\n|\r|\t)/gm,'').replace('  ', '').toLowerCase()
                                }
                            })
                        .filter(localeName => localeName)});
                    }

                }
                done();
            }
        });

        c.queue(zipCodeUrls.filter(url => url).map(zipCodeUrl => `${ZIP_CODE_URL}${zipCodeUrl}`));
        c.on('drain', function() {
            console.log('Searching for streetnames done');
            resolve(result)
        });
    });
}

function getLocales(commune){
    return new Promise((resolve, reject) => {
        console.log(`Searching for ${commune}`)
        let zipeCodeUrls = [];

        const c = new Crawler({
            maxConnections : 10,
            // This will be called for each crawled page
            callback : function (error, res, done) {
                if(error){
                    console.log(error);
                } else{
                    const $ = res.$;
                    if($){
                        const links = $(".data td a");
                        zipeCodeUrls = Object.keys(links).filter(key => links[key].attribs).map(key => {
                            return links[key].attribs.href
                        });


                    }

                }
                done();
            }
        });

        c.queue(`${POST_URL}?streetname=&postcodeorcommune=${commune}`);
        c.on('drain', function() {
            console.log('Searching done');
            getStreetNames(zipeCodeUrls).then((localeNames) => {
                fs.writeFile(`data/${LOCALES_FILE_NAME}`,  JSON.stringify(locleNames, null,'\t'), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`The file data/${process.env.LOCALES_FILE_NAME} was saved!`);
                    resolve(localeNames)
                });
            });
        });
    });



}

//getLocales('Nykarleby').then((localeNames) => {
//    searchUrls(localeNames, filteredUrls.slice(0, 100));
//});

//searchUrls(locales, filteredUrls.slice(0, 100));
searchUrls(locales.concat(areas), filteredUrls.slice(0, 100), {
    replaceData: process.env.REPLACE_DATA,
    onlySearchNewLocales: process.env.ONLY_SEARCH_NEW_LOCALES,
});


