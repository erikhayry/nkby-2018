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

function searchUrls(zipCodeAndLocales, urls) {
    console.log(`Searching ${urls.length} urls for locales`)
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
                    const {zipCode, streetNames} = zipCodeAndLocales[key];
                    streetNames.forEach(streetName => {
                        if($){
                            const body = $("body");
                            const bodyText = (body.text() || '').toLowerCase();
                            const title = $("title").text() || '';
                            const images = Array.from($('body img')).map((el) => {
                                return el.attribs.src.replace('../../../', '')
                            });

                            if(bodyText.indexOf(streetName.toLowerCase()) > 0){
                                const re = new RegExp(`\\b${streetName.toLowerCase()}\\s[0-9]{1,3}`);
                                const addressWithStreetNumber = bodyText.match(re);
                                const name = getKey(addressWithStreetNumber, streetName);
                                pagesCount++;
                                const key = `${name}-${zipCode}`;

                                if(result[key]){
                                    result[key].pages.push({
                                        url: res.options.uri,
                                        title,
                                        images
                                    })
                                }
                                else {
                                    result[key] = {
                                        name,
                                        zipCode,
                                        isAddressWithStreetNumber: !!addressWithStreetNumber,
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
                })



            }
            done();
        }
    });

    c.queue(urls.map(url => 'http://nykarlebyvyer.nu/' + url));
    c.on('drain', function() {
        console.log('Searching done');
        console.log(`Matched ${pagesCount} urls to ${Object.keys(result).length} locales`);

        fs.writeFile("data/crawler-result-lg.json",  JSON.stringify(result, null,'\t'), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`The file data/crawler-result.json was saved!`);
        });
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
                        const streetNameData = $('.data table table td div:not(.ipono_tooltip)')
                        result.push({zipCode, streetNames: Object.keys(streetNameData).filter(key => streetNameData[key]).map(key => {
                            if(streetNameData[key].children && streetNameData[key].children.length > 0 &&  streetNameData[key].children[0]){
                                return streetNameData[key].children[0].data.replace(/(\r\n|\n|\r|\t)/gm,'').replace('  ', '').toLowerCase()
                            }
                        }).filter(streetName => streetName)});
                    }

                }
                done();
            }
        });

        c.queue(zipCodeUrls.filter(url => url).map(zipCodeUrl => `https://www.verkkoposti.com${zipCodeUrl}`));
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

        c.queue(`https://www.verkkoposti.com/e3/svenska/postnummercatalog?streetname=&postcodeorcommune=${commune}`);
        c.on('drain', function() {
            console.log('Searching done');
            getStreetNames(zipeCodeUrls).then((streetNames) => {
                fs.writeFile("data/locales.json",  JSON.stringify(streetNames, null,'\t'), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`The file data/locales.json was saved!`);
                    resolve(streetNames)
                });
            });
        });
    });



}

//getLocales('Nykarleby').then((streetNames) => {
//    searchUrls(streetNames, filteredUrls.slice(0, 100));
//});

//searchUrls(locales, filteredUrls.slice(0, 100));
searchUrls(locales, filteredUrls);


