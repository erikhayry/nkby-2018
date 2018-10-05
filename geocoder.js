import fs from 'fs';
import locales from '../data/locale.json';
import geoCodedLocale from '../data/geocoded-locale.json';
import crawlerResult from '../data/crawler-result.json';

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ',
    Promise: Promise
});

function geoCode(name, postcode = '66900', country = 'FI'){
    return new Promise((resolve, reject) => {
        const geoCodeData = geoCodedLocale.find(function (locale) {
            return locale.name === name;
        });
        if(geoCodeData){
            console.log('Ignored ' + geoCodeData.name)
            resolve(geoCodeData)
        }
        else {
            console.log('Get ' + name)
            googleMapsClient.geocode({address: `${name}, ${postcode}, ${country}`})
                .asPromise()
                .then(responses => {
                    const geoCodedData = responses.json.results[0];
                    if(geoCodedData && geoCodedData.geometry){
                        //TODO add to locale and geocode locale?
                        resolve({
                            location: geoCodedData.geometry.location,
                            name
                        })
                    }
                    else {
                        //TODO add streetname location
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

        console.log("The file was saved!");
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

function geoCodeCrawlerResult() {
    const locales = Object.keys(crawlerResult);

    const reqs = locales.map(locale => geoCode(locale));
    Promise.all(reqs)
        .then((responses) => {
            console.log(JSON.stringify(responses))
            //toFile(responses, "data/geocoded-crawler-result.json")
        })
        .catch((err) => {
            console.log(err);
        });
}

geoCodeCrawlerResult()