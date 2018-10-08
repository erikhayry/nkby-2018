import fs from 'fs';
import ProgressBar from 'progress';
import locales from '../data/locale.json';
import geoCodedLocale from '../data/geocoded-locale.json';
import crawlerResult from '../data/crawler-result.json';

let bar, ignored = [], geoCodeSuccess = [], geoCodeErrors = [];


const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ',
    Promise: Promise
});

function geoCode(name, postcode = '66900', country = 'FI'){
    bar.tick();
    return new Promise((resolve, reject) => {
        const geoCodeData = geoCodedLocale.find(function (locale) {
            return locale.name === name;
        });
        if(geoCodeData){
            ignored.push(geoCodeData.name);
            resolve(geoCodeData)
        }
        else {
            googleMapsClient.geocode({address: `${name}, ${postcode}, ${country}`})
                .asPromise()
                .then(responses => {
                    const geoCodedData = responses.json.results[0];
                    if(geoCodedData && geoCodedData.geometry){
                        geoCodeSuccess.push(geoCodeData.name);
                        resolve({
                            location: geoCodedData.geometry.location,
                            name
                        })
                    }
                    else {
                        geoCodeErrors.push(geoCodeData.name);
                        resolve({
                            name
                        })
                    }
                })
        }

    });
}

function toFile(data, path) {
    fs.writeFile(path, JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`The file ${path} was saved!`);
    });
}

function geoCodeLocale(){
    const reqs = locales.map(locale => geoCode(locale));

    Promise.all(reqs)
        .then((responses) => {
            toFile(responses, "data/geocoded-locale.json")
        })
        .catch((err) => {
            console.log(err);
        });
}

function addLocaleToCrawlerResult(geoCodedLocales, crawlerResult){
    geoCodedLocales.forEach(locale => {
        if(crawlerResult[locale.name]){
            crawlerResult[locale.name].locale = locale.location;
        }
    });

    toFile(crawlerResult, "admin/static/crawler-result-with-locale.json")
}

function geoCodeCrawlerResult() {
    const locales = Object.keys(crawlerResult);
    console.log(`GeoCode ${locales.length} locales from search result`)
    bar = new ProgressBar(':bar', { total: locales.length });

    const reqs = locales.map(locale => geoCode(locale));
    Promise.all(reqs)
        .then((newGeoCodedLocales) => {
            console.log(`Geocoding done, ignored: ${ignored.length}, success: ${geoCodeSuccess.length}, failed: ${geoCodeErrors.length}`);
            toFile(newGeoCodedLocales, "data/geocoded-locale.json")
            addLocaleToCrawlerResult(newGeoCodedLocales, crawlerResult);
        })
        .catch((err) => {
            console.log(err);
        });
}

geoCodeCrawlerResult()