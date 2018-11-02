export function localeHasPages(pages, globallyDisapprovedPageUrls){
    return pages.some(page => !globallyDisapprovedPageUrls.includes(page.url));
}

export function localeHasApprovedPageUrl(pages, approvedPages){
    return pages.findIndex(page => approvedPages.find(approvedPage => approvedPage.url === page.url)) > -1;
}

function localeHasDisapprovedPageUrl(pages, disapprovedPages){
    return pages.findIndex(page => disapprovedPages.find(disapprovedPage => disapprovedPage.url === page.url)) > -1;
}

function containsUrl(url, pages){
    return pages.findIndex(page => page.url === url) > -1;
}

export function localeHasUneditedPageUrl(pages, approvedPages, disapprovedPages){
    return pages.some(({url}) => !containsUrl(url, approvedPages) && !containsUrl(url, disapprovedPages));
}

export function getPages(pages, globallyDisapprovedPageUrls){
    return pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));
}

export function getFilteredPages(pages, globallyDisapprovedPageUrls){
    return pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));
}