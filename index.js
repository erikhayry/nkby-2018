import Crawler from "crawler";
import fs from 'fs';
import geocodedLocales from '../data/geocoded-locale.json';
import locales from '../data/locale.json';
import urls from '../data/urls.json';
import result from '../admin/static/result.json';
import areas from '../data/areas.json';

const postalAreas = [
    'ekola',
    'pensala',
    'jeppo',
    'nykarleby',
    'socklot',
    'kovjoki',
    'munsala',
    'hirvlax',
    'monå',
];

function toLargeResult(){
    let largeResult = {};
    for (let key in result){
        const uris = result[key].uris;

        uris.forEach(uri => {
            if(uri.addressWithStreetNumber) {
                uri.addressWithStreetNumber.forEach(address => {
                    if(largeResult[address]){
                        largeResult[address].uris.push(uri)
                    }
                    else {
                        largeResult[address] = {
                            uris: [uri]
                        }
                    }

                })
            }
            else {
                if(largeResult[key]){
                    largeResult[key].uris.push(uri)
                }
                else {
                    largeResult[key] = {
                        uris: [uri],
                        title: result[key].title,
                        location: result[key].location
                    }
                }
            }
        })
    }
    fs.writeFile("data/large-result.json", JSON.stringify(largeResult), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });}

function getKey(addressWithStreetNumber, name){
    const address = addressWithStreetNumber && addressWithStreetNumber[0];
    if(!address){
        return name;
    }
    const postcode = address.substring(address.lastIndexOf(' ') + 1);

    if(!Number.isInteger(Number(postcode)) || postcode > 2 || postcode === 0){
        return name;
    }

    return address;
}

function searchUrls(locales, urls) {
    let count = 0;
    const total = urls.length;
    const result = {};

    const c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            } else{
                console.log(`${count++} / ${total}`);
                const $ = res.$;

                locales.forEach(name => {
                    const body = $("body");
                    const bodyText = (body.text() || '').toLowerCase();
                    const title = $("title").text() || '';
                    const images = Array.from($('body img')).map((el) => {
                        return el.attribs.src.replace('../../../', '')
                    });


                    if(bodyText.indexOf(name.toLowerCase()) > 0){
                        const re = new RegExp(`\\b${name.toLowerCase()}\\s[0-9]{1,3}`);
                        const addressWithStreetNumber = bodyText.match(re);
                        const key = getKey(addressWithStreetNumber, name);

                        if(result[key]){
                            result[key].pages.push({
                                url: res.options.uri,
                                title,
                                images
                            })
                        }
                        else {
                            result[key] = {
                                pages: [{
                                    url: res.options.uri,
                                    title,
                                    images,
                                }]
                            }
                        }
                    }
                })

            }
            done();
        }
    });

    c.queue(urls.map(url => 'http://nykarlebyvyer.nu/' + url));
    c.on('drain', function() {
        console.log('done!');

        fs.writeFile("data/crawler-result.json",  JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
}

let filteredUrls = urls.filter(url => url.indexOf('sidor/texter/hus/') === 0);
searchUrls(locales, filteredUrls);
//toLargeResult()

