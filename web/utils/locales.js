import locales from '../data/locales.json';

function sortByName(a, b){
    if(a < b){
        return -1
    }

    if(a > b){
        return 1
    }

    return 0;
}

// Convert Degress to Radians
function Deg2Rad(deg) {
    return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    let R = 6371; // km
    let x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    let y = (lat2 - lat1);

    return Math.sqrt(x * x + y * y) * R;
}

export function getLocalesNearby(currentLocaleId, {lng: currentLocaleLng, lat: currentLocaleLat}, numbersOfResults = 10){
    return getLocales()
        .filter(locale => locale.position && locale.id !== currentLocaleId)
        .map(locale => {
            const {lng, lat} = locale.position;
            const dif = PythagorasEquirectangular(currentLocaleLng, currentLocaleLat, lng, lat);

            return {
                ...locale,
                dif
            }
        })
        .sort((localeA, localeB) => {
            return localeA.dif - localeB.dif
        })
        .splice(0, numbersOfResults)
}

export function getLocales(){
    return Object.keys(locales)
        .map(key => ({id: key, ...locales[key]}))
}

export function getLocale(id){
    return {id, ...locales[id]}
}

export function sortLocalesByName(locales){
    return locales.sort(({name: name1}, {name: name2}) => {
        return sortByName(name1, name2)
    })
}

export function sortPagesByTitle(pages){
    return pages
        .sort(({title: title1}, {title: title2}) => {
            return sortByName(title1, title2)
        })
}

export function getMinMax(type) {
    const filteredLocales = getLocales()
        .filter(locale => locale.position);

    const max = Math.max(...filteredLocales.map(({position}) => position[type]));

    const min = Math.min(...filteredLocales.map(({position}) => position[type]))

    return {max, min}
}