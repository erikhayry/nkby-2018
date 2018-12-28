var fs = require('fs');
var array = fs.readFileSync(process.env.src).toString().split("\n");
fs.writeFile(process.env.dest, JSON.stringify(array), function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("The file " + process.env.dest + " was saved!");
});