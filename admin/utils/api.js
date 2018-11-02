const API_HOST = 'http://localhost:3001';

async function get(path){
    const dataJson = await fetch(API_HOST + path);
    return dataJson.json();
}

async function post(path, body = {}){
    const dataJson = await fetch(API_HOST + path, {
        method: 'POST',
        body: JSON.stringify(body)
    });

    return dataJson.json();
}

export {
    get, post
};