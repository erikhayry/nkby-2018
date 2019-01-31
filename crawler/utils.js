import ProgressBar from 'progress';
import Crawler from "crawler";
import fs from 'fs';

const CRAWLER_CONF = {
    maxConnections : 10
};

export function crawl(onPage, url, onDone){
    const bar = new ProgressBar(':bar', { total: url.length });
    let result;
    return new Promise((resolve, reject) => {
        const crawler = new Crawler({
            ...CRAWLER_CONF,
            callback : function (error, res, done) {
                if(error){
                    console.log(error);
                } else{
                    const $ = res.$;
                    if($){
                        bar.tick();
                        result = onPage($, result, error, res, done);
                    }
                }
                done();
            }
        });

        crawler.queue(url);
        crawler.on('drain', function() {
            resolve(onDone(result))
        });
    })
}


export function saveData(data, fileName){
    return new Promise((resolve, reject) => {
        fs.writeFile(`data/${fileName}`,  JSON.stringify(data, null,'\t'), function (err) {
            if (err) {
                reject(err)
            }
            console.log(`The file data/${fileName} was saved!`);
            resolve(data)
        });
    });
}
