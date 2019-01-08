var fs = require('fs');


fs.readFile('api/data/edited-locales.json' , "utf8", function(err, d) {
    if(err){
        reject(err)
    }
    var edited = {}
    var data = JSON.parse(d)

    for(var key in data){
        edited[key+'-66900'] = data[key]
    }

    console.log(JSON.stringify(edited))

    fs.writeFile('api/data/edited-locales.json', JSON.stringify(edited, null,'\t'))
});