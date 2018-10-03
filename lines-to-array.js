var fs = require('fs');
var array = fs.readFileSync('data/all-urls.txt').toString().split("\n");
fs.writeFile("data/urls.json", JSON.stringify(array), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});