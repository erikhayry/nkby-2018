import Crawler from "crawler";

const searchTerms = ['forsby', 'Grev Tott gatan'];
const urls = [
    'http://www.nykarlebyvyer.nu/sidor/texter/prosa/olsonr/hemkyfo/renvakta.htm',
    'http://www.nykarlebyvyer.nu/sidor/texter/prosa/backmanw/back/01back.htm',
    'http://www.nykarlebyvyer.nu/sidor/klassfot/fo19677.html',
    'http://nykarlebyvyer.nu/sidor/texter/hus/backlunl.htm'
];

function searchUrls(searchTerms, urls) {
    const result = {};
    const c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            } else{
                console.log(res.options.uri)
                const $ = res.$;

                searchTerms.forEach(searchTerm => {
                    const bodyText = $("body").text() || '';

                    if(bodyText.toLowerCase().indexOf(searchTerm.toLowerCase()) > 0){
                        if(result[searchTerm]){
                            result[searchTerm].push(res.options.uri)
                        }
                        else {
                            result[searchTerm] = [res.options.uri]
                        }
                    }
                })

            }
            done();
        }
    });

    c.queue(urls);

    c.on('drain', function(){
        console.log(result)
    });
}


searchUrls(searchTerms, urls);