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
        fs.writeFile(path, JSON.stringify(data, null,'\t'), function(err, data) {
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

const getGlobalDisapproved = async (req, res) => {
    let data = await read('data/disapproved.json');
    send(res, 200, data)
};

const getStarredPages = async (req, res) => {
    let data = await read('data/starred-pages.json');
    send(res, 200, data)
};

const getReportedLocales = async (req, res) => {
    let data = await read('data/reported-locales.json');
    send(res, 200, data)
};

const removeFromList = async (req, res, list) => {
    const editedLocale = await json(req);
    let editedLocales = JSON.parse(await read('data/edited-locales.json'));

    if(editedLocales[editedLocale.id]){
        const locationIndex = editedLocales[editedLocale.id][list].findIndex(page => page.url === editedLocale.pageUrl);
        if(locationIndex > -1){
            editedLocales[editedLocale.id][list].splice(locationIndex, 1);
        }
    }

    await write('data/edited-locales.json', editedLocales);
    editedLocales = await read('data/edited-locales.json');
    send(res, 200, editedLocales)
};

const addToList = async (req, res, list) => {
    const editedLocale = await json(req);
    let editedLocales = JSON.parse(await read('data/edited-locales.json'));

    if(editedLocales[editedLocale.id]){
        if(!editedLocales[editedLocale.id][list]){
            editedLocales[editedLocale.id][list] = [{url: editedLocale.pageUrl}];
        }
        else if(!editedLocales[editedLocale.id][list].find(page => page.url === editedLocale.pageUrl)){
            editedLocales[editedLocale.id][list].push({url: editedLocale.pageUrl})
        }
    } else {
        editedLocales[editedLocale.id] = {};
        editedLocales[editedLocale.id][list] = [{url: editedLocale.pageUrl}];
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

const addToStarredPages = async (req, res) => {
    const starredPage = await json(req);
    let starredPages = JSON.parse(await read('data/starred-pages.json'));

    starredPages.push(starredPage);

    await write('data/starred-pages.json', starredPages);
    starredPages = await read('data/starred-pages.json');
    send(res, 200, starredPages)
};

const addToReportedLocale = async (req, res) => {
    const reportedLocale = await json(req);
    let reportedLocales = JSON.parse(await read('data/reported-locales.json'));

    reportedLocales.push(reportedLocale);

    await write('data/reported-locales.json', reportedLocales);
    reportedLocales = await read('data/reported-locales.json');
    send(res, 200, reportedLocales)
};

const addImageToPage = async (req, res) => {
    const editedLocale = await json(req);
    let editedLocales = JSON.parse(await read('data/edited-locales.json'));

    if(editedLocales[editedLocale.id]){
        let pageIndex = editedLocales[editedLocale.id]['approvedPages'].findIndex(page => page.url === editedLocale.pageUrl);
        if(pageIndex > -1){
            editedLocales[editedLocale.id]['approvedPages'][pageIndex].preferredImage = editedLocale.preferredImage
        }
    }

    await write('data/edited-locales.json', editedLocales);
    editedLocales = await read('data/edited-locales.json');
    send(res, 200, editedLocales)
};

const addLocationData = async (req, res) => {
    const editedLocale = await json(req);
    let editedLocales = JSON.parse(await read('data/edited-locales.json'));
    const id = editedLocale.id;
    delete editedLocale["id"];

    if(editedLocales[id]){
        editedLocales[id] = {
            ...editedLocales[id],
            ...editedLocale
        }
    } else {
        editedLocales[id] = {
            ...editedLocale.position
        };
    }

    await write('data/edited-locales.json', editedLocales);
    editedLocales = await read('data/edited-locales.json');
    send(res, 200, editedLocales)
};


module.exports = router(
    cors(post('/add/preferred-page-image', addImageToPage)),
    cors(post('/add/approved-page-url', (req, res) => {
        return addToList(req, res, 'approvedPages');
    })),
    cors(post('/remove/approved-page-url', (req, res) => {
        return removeFromList(req, res, 'approvedPages');
    })),
    cors(post('/add/disapproved-page-url', (req, res) => {
        return addToList(req, res, 'disapprovedPages');
    })),
    cors(post('/remove/disapproved-page-url', (req, res) => {
        return removeFromList(req, res, 'disapprovedPages');
    })),
    cors(post('/remove/disapproved-page-url-globally', addToGlobalDisapproveList)),
    cors(post('/add/starred-page', addToStarredPages)),
    cors(post('/add/reported-locale', addToReportedLocale)),
    cors(post('/add/locale-data', addLocationData)),
    cors(get('/get/disapproved-page-url-globally', getGlobalDisapproved)),
    cors(get('/get/edited-locales', getEditedLocales)),
    cors(get('/get/starred-pages', getStarredPages)),
    cors(get('/get/reported-locales', getReportedLocales))
);