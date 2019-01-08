var fs = require('fs');


fs.readFile('data/geocoded-locales.json' , "utf8", function(err, d) {
    if(err){
        reject(err)
    }
    var res = []
    var data = JSON.parse(d)

    for(var key in data){

        if(!data[key].postcode){
            data[key].postcode = "66900"
        }


    }

    console.log(JSON.stringify(data))

    fs.writeFile('data/geocoded-locales.json', JSON.stringify(data, null,'\t'))
});