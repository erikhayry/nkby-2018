var fs = require('fs');


fs.readFile('data/crawler-result-lg.json' , "utf8", function(err, d) {
    if(err){
        reject(err)
    }
    var res = {}
    var data = JSON.parse(d)

    for(var key in data){
        res[key.toLowerCase()] = data[key]
    }

    console.log(JSON.stringify(res))

    fs.writeFile('data/crawler-result-lg.json', JSON.stringify(res))
});