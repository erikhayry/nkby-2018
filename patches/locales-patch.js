var fs = require('fs');


fs.readFile('data/locales.json' , "utf8", function(err, d) {
    if(err){
        reject(err)
    }
    var res = []
    var data = JSON.parse(d)

    for(var key in data){
        let sn = [];

        for(var i in data[key].streetNames){
            sn.push(data[key].streetNames[i].toLowerCase())
        }

        data[key].streetNames = sn;

        res.push(data[key])

    }

    console.log(JSON.stringify(res))

    fs.writeFile('data/locales.json', JSON.stringify(res))
});