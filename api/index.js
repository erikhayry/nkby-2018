const { json, send } = require('micro')
const { router, get, post } = require('microrouter')
const fs = require('fs')
const cors = require('micro-cors')()

function read(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", function(err, data) {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

function write(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(data), function(err, data) {
            if(err){
                reject(err)
            }
            resolve(data)
        })
    });
}


const getData = async (req, res) => {
    let data = await read('data/edited-locations.json');
    send(res, 200, data)
};

const approve = async (req, res) => {
    const newEditedLocation = await json(req);
    let editedLocations = JSON.parse(await read('data/edited-locations.json'));

    if(editedLocations[newEditedLocation.id]){
        if(!editedLocations[newEditedLocation.id].approved.includes(newEditedLocation.url)){
            editedLocations[newEditedLocation.id].approved.push(newEditedLocation.url)
        }
    } else {
        editedLocations[newEditedLocation.id] = {
            approved: [
                newEditedLocation.url
            ]
        }
    }

    await write('data/edited-locations.json', editedLocations);
    editedLocations = await read('data/edited-locations.json');
    send(res, 200, editedLocations)
};

module.exports = router(
    cors(post('/approve', approve)),
    cors(get('/get', getData))
);