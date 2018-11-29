function get(key) {
    try {
        let data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        return undefined;
    }
}

function set(key, data){
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {
        return undefined;
    }
}

export default {
    set, get
}