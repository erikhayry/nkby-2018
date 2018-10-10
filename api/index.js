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
    let data = await read('data/test.json');
    send(res, 200, data)
};


const add = async (req, res) => {
    const body = await json(req);
    await write('data/test.json', body);
    let data = await read('data/test.json');
    send(res, 200, data)
};

module.exports = router(
    cors(post('/add', add)),
    cors(get('/get', getData))
);