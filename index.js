import Crawler from "crawler";
import fs from 'fs';
import ProgressBar from 'progress';
import locales from '../data/locales.json';
import urls from '../data/urls.json';

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

function searchUrls(locales, urls) {
    console.log(`Searching ${urls.length} urls for ${locales.length} locales`)
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

                locales.forEach(name => {
                    if($){
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
                            pagesCount++;

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
                    }

                })

            }
            done();
        }
    });

    c.queue(urls.map(url => 'http://nykarlebyvyer.nu/' + url));
    c.on('drain', function() {
        console.log('Searching done');
        console.log(`Matched ${pagesCount} urls to ${Object.keys(result).length} locales`);

        fs.writeFile("data/crawler-result-lg.json",  JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`The file data/crawler-result.json was saved!`);
        });
    });
}

let filteredUrls = urls.filter(url => url.indexOf('sidor/texter/') === 0 || url.indexOf('/sidor/kortindi/') === 0);
searchUrls(locales, filteredUrls);