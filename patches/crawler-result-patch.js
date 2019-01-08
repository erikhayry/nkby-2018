var fs = require('fs');


fs.readFile('data/crawler-result-lg.json' , "utf8", function(err, d) {

    var res = {}
    var data = JSON.parse(d)

    delete data['kyrkan-area'];
    delete data['idrottsgården-area'];
    delete data['kampen-area'];


    fs.writeFile('data/crawler-result-lg.json', JSON.stringify(data, null,'\t'))
});