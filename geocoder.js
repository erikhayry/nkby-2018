import fs from 'fs';
import ProgressBar from 'progress';
import geoCodedLocale from '../data/geocoded-locales.json';
import crawlerResult from '../data/crawler-result-lg.json';

let bar, ignored = [], geoCodeSuccess = [], geoCodeErrors = [];
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ',
    Promise: Promise
});

function geoCode(name, postcode = '66900', city = 'Nykarleby', country = 'Finland'){
    bar.tick();
    console.log('Geocode', name, postcode, city, country);

    return new Promise((resolve, reject) => {
        const geoCodeData = geoCodedLocale.find(function (locale) {
            return locale.name === name;
        });

        if(geoCodeData){
            ignored.push(geoCodeData.name);
            resolve(geoCodeData)
        }
        else {
            googleMapsClient.geocode({address: `${name}, ${postcode}, ${city} ${country}`})
                .asPromise()
                .then(responses => {
                    const geoCodedData = responses.json.results[0];
                    if(geoCodedData && geoCodedData.geometry){
                        geoCodeSuccess.push(name);
                        resolve({
                            location: geoCodedData.geometry.location,
                            name,
                            postcode
                        })
                    }
                    else {
                        geoCodeErrors.push(name);
                        resolve({
                            name
                        })
                    }
                })
        }

    });
}

function toFile(data, path) {
    fs.writeFile(path, JSON.stringify(data, null,'\t'), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(`The file ${path} was saved!`);
    });
}

function addLocaleToCrawlerResult(geoCodedLocales, crawlerResult){
    geoCodedLocales.forEach(locale => {
        let key =`${locale.name}-${locale.postcode}`;
        console.log(key)
        if(crawlerResult[key]){
            crawlerResult[key].position = locale.location;
        }
    });

    toFile(crawlerResult, "admin/static/crawler-result-with-locales.json")
}

function merge(a, b, prop){
    let reduced =  a.filter( aitem => ! b.find ( bitem => aitem[prop] === bitem[prop]) )
    return reduced.concat(b);
}

function geoCodeCrawlerResult() {
    const locales = Object.keys(crawlerResult);
    console.log(`GeoCode ${locales.length} locales from search result`);
    bar = new ProgressBar(':bar', { total: locales.length });

    const reqs = locales.map(key => geoCode(crawlerResult[key].name, crawlerResult[key].zipCode));
    Promise.all(reqs)
        .then((newGeoCodedLocales) => {
            console.log(`Geocoding done, ignored: ${ignored.length}, success: ${geoCodeSuccess.length}, failed: ${geoCodeErrors.length}`);
            toFile(merge(geoCodedLocale, newGeoCodedLocales, 'name'), "data/geocoded-locales.json");
            addLocaleToCrawlerResult(newGeoCodedLocales, crawlerResult);
        })
        .catch((err) => {
            console.log(err);
        });
}

//geoCodeCrawlerResult();
addLocaleToCrawlerResult(geoCodedLocale, crawlerResult);
