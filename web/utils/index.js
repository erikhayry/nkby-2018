import locales from '../static/locales.json';

function sortByName(a, b){
    if(a < b){
        return -1
    }

    if(a > b){
        return 1
    }

    return 0;
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
        .filter(locale => locale.position)

    const max = Math.max(...filteredLocales.map(({position}) => position[type]));

    const min = Math.min(...filteredLocales.map(({position}) => position[type]))

    return {max, min}
}