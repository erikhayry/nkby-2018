import Crawler from "crawler";
import fs from 'fs';
import addresses from '../data/geocoded-addresses.json';
import urls from '../data/urls.json';
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
                    const bodyText = $("body").text() || '';
                    const title = $("title").text() || '';

                    if(bodyText.toLowerCase().indexOf(address.toLowerCase()) > 0){
                        if(result[address]){
                            result[address].uris.push({
                                uri: res.options.uri,
                                title
                            })
                        }
                        else {
                            result[address] = {
                                location,
                                uris: [{
                                    uri: res.options.uri,
                                    title
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
    }).slice(20);

//console.log(convertedAddresses);
//console.log(filtersUrls);

searchUrls(convertedAddresses, filtersUrls);
