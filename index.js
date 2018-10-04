import Crawler from "crawler";
import fs from 'fs';
import addresses from '../data/geocoded-addresses.json';
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

const searchTerms = [];
//const searchTerms = ['forsby', 'Grev Tott gatan'];

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

function searchUrls(searchTerms, urls) {
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


                searchTerms.forEach(({address, location}) => {
                    const body = $("body");
                    const bodyText = (body.text() || '').toLowerCase();
                    const title = $("title").text() || '';
                    const images = Array.from($('body img')).map((el) => {
                        return el.attribs.src.replace('../../../', '')
                    });


                    if(bodyText.indexOf(address.toLowerCase()) > 0){
                        const re = new RegExp(`\\b${address.toLowerCase()}\\s[0-9]{2,}`);
                        const addressWithStreetNumber = bodyText.match(re);

                        if(result[address]){
                            result[address].uris.push({
                                uri: res.options.uri,
                                title,
                                images,
                                addressWithStreetNumber
                            })
                        }
                        else {
                            result[address] = {
                                location,
                                uris: [{
                                    uri: res.options.uri,
                                    title,
                                    images,
                                    addressWithStreetNumber
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

        fs.writeFile("admin/static/result.json",  JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
}

let filtersUrls = urls.filter(url => url.indexOf('sidor/texter/hus/') === 0);
let convertedAddresses = addresses
    .filter(address => address.geoCodeData)
    .map(address => {
        const geoCodeData = address.geoCodeData;
        return {
            address: address.address,
            location: geoCodeData.geometry && geoCodeData.geometry.location
        }
    }).splice(20);

//console.log(convertedAddresses);
//console.log(filtersUrls);

//searchUrls(convertedAddresses, filtersUrls);
toLargeResult()

