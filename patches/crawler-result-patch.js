var fs = require('fs');


fs.readFile('data/crawler-result-lg.json' , "utf8", function(err, d) {

    var res = {}
    var data = JSON.parse(d)

    for(var key in data){
        var obj = data[key];
        obj.type = 'locale'

        res[key] = obj
    }

    fs.writeFile('data/crawler-result-lg.json', JSON.stringify(res, null,'\t'))
});