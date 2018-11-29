export function searchToObject() {
    const queries = window.location.search.substring(1).split('&');
    const result = {};
    let queryPair;
    let query;

    for ( query in queries ) {
        if ( queries[query] === '' ) continue;

        queryPair = queries[query].split('=');
        result[ decodeURIComponent( queryPair[0] ) ] = decodeURIComponent( queryPair[1] );
    }

    return result;
}

export function parseImageSrc(src){
    if(src){
        return `http://www.nykarlebyvyer.nu/${src.replace('../../../', '')}`;
    }

    return undefined;
}

export function isClient(){
    return !!(
        (typeof window !== 'undefined' &&
            window.document && window.document.createElement)
    )
}

export function isCuttingTheMustard(){
    return 'querySelector' in document
        && 'localStorage' in window
        && 'addEventListener' in window
}