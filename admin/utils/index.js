import locales from '../static/crawler-result-with-locales.json';

export function toImagesSrc(src){
    if(src){
        return `http://www.nykarlebyvyer.nu/${src.replace('../../../', '')}`;
    }

    return '';
}

export function getLocales(){
    return Object.keys(locales)
        .map(key => ({id: key, ...locales[key]}))
}

export function getLocale(id){
    return locales[id]
}