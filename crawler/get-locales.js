const POST_URL = process.env.POST_URL || 'https://www.verkkoposti.com/e3/svenska/postnummercatalog';
const LOCALES_FILE_NAME = process.env.LOCALES_FILE_NAME || 'locales.json';
const ZIP_CODE_URL = process.env.ZIP_CODE_URL || 'https://www.verkkoposti.com';
const COMMUNE = process.env.COMMUNE || 'Nykarleby';

import { crawl , saveData} from "./utils.js";

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
    console.log('getStreetNames', zipCodeUrls);

    function onPage($, result = [], error, res, done){
        let zipCode = getParameterByName('zipcode', res.request.uri.query)
        const localeNameData = $('.data table table td div:not(.ipono_tooltip)')
        result.push({
            type: 'locale',
            zipCode,
            localeNames: Object.keys(localeNameData).filter(key => localeNameData[key]).map(key => {
                if(localeNameData[key].children && localeNameData[key].children.length > 0 &&  localeNameData[key].children[0]){
                    return localeNameData[key].children[0].data.replace(/(\r\n|\n|\r|\t)/gm,'').replace('  ', '').toLowerCase()
                }
            }).filter(localeName => localeName)});

        return result;
    }

    function onDone(result){
        console.log('Searching done', result);
        return new Promise((resolve, reject) => {
            resolve(result)
        });
    }

    return crawl(onPage, zipCodeUrls.filter(url => url).map(zipCodeUrl => `${ZIP_CODE_URL}${zipCodeUrl}`), onDone)
}

function getLocales(commune){
    function onPage($){
        const links = $(".data td a");
        return Object.keys(links)
            .filter(key => links[key].attribs && links[key].attribs.href)
            .map(key => {
                return links[key].attribs.href
            });
    }

    function onDone(result){
        console.log('Searching done', result);
        return new Promise((resolve, reject) => {
            resolve(result)
        });
    }

    return crawl(onPage, `${POST_URL}?streetname=&postcodeorcommune=${commune}`, onDone)
}

getLocales(COMMUNE)
    .then(getStreetNames)
    .then((result) => saveData(result, `${LOCALES_FILE_NAME}`));


