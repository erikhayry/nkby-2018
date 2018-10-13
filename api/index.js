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

const getEditedLocales = async (req, res) => {
    let data = await read('data/edited-locales.json');
    send(res, 200, data)
};

const getGlobalDisapproved= async (req, res) => {
    let data = await read('data/disapproved.json');
    send(res, 200, data)
};

const removeFromList = async (req, res, list) => {
    const editedLocale = await json(req);
    let editedLocales = JSON.parse(await read('data/edited-locales.json'));

    if(editedLocales[editedLocale.name]){
        const locationIndex = editedLocales[editedLocale.name][list].indexOf(editedLocale.pageUrl)
        if(locationIndex > -1){
            editedLocales[editedLocale.name][list].splice(locationIndex, 1);
        }
    }

    await write('data/edited-locales.json', editedLocales);
    editedLocales = await read('data/edited-locales.json');
    send(res, 200, editedLocales)
};

const addToList = async (req, res, list) => {
    const editedLocale = await json(req);
    let editedLocales = JSON.parse(await read('data/edited-locales.json'));

    if(editedLocales[editedLocale.name]){
        if(!editedLocales[editedLocale.name][list].includes(editedLocale.pageUrl)){
            editedLocales[editedLocale.name][list].push(editedLocale.pageUrl)
        }
    } else {
        editedLocales[editedLocale.name] = {
            approvedPageUrls: [],
            disapprovedPageUrls: []
        };
        editedLocales[editedLocale.name][list].push(editedLocale.pageUrl);
    }

    await write('data/edited-locales.json', editedLocales);
    editedLocales = await read('data/edited-locales.json');
    send(res, 200, editedLocales)
};

const addToGlobalDisapproveList = async (req, res) => {
    const disapprovedUrl = await json(req);
    let disapprovedUrls = JSON.parse(await read('data/disapproved.json'));

    disapprovedUrls.push(disapprovedUrl);

    await write('data/disapproved.json', disapprovedUrls);
    disapprovedUrls = await read('data/disapproved.json');
    send(res, 200, disapprovedUrls)
};


module.exports = router(

    cors(post('/add/approved-page-url', (req, res) => {
        return addToList(req, res, 'approvedPageUrls');
    })),
    cors(post('/remove/approved-page-url', (req, res) => {
        return removeFromList(req, res, 'approvedPageUrls');
    })),
    cors(post('/add/disapproved-page-url', (req, res) => {
        return addToList(req, res, 'disapprovedPageUrls');
    })),
    cors(post('/remove/disapproved-page-url', (req, res) => {
        return removeFromList(req, res, 'disapprovedPageUrls');
    })),
    cors(post('/remove/disapproved-page-url-globally', (req, res) => {
        return addToGlobalDisapproveList(req, res);
    })),
    cors(get('/get/disapproved-page-url-globally', getGlobalDisapproved)),
    cors(get('/get/edited-locales', getEditedLocales))
);