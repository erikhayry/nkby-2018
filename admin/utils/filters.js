export function localeHasPages(pages, globallyDisapprovedPageUrls){
    return pages.some(page => !globallyDisapprovedPageUrls.includes(page.url));
}

export function localeHasApprovedPageUrl(pages, approvedPages){
    return pages.findIndex(page => approvedPages.find(approvedPage => approvedPage.url === page.url)) > -1;
}

function localeHasDisapprovedPageUrl(pages, disapprovedPages){
    return pages.findIndex(page => disapprovedPages.find(disapprovedPage => disapprovedPage.url === page.url)) > -1;
}

function pagesContainsUrl(url, pages){
    return pages.findIndex(page => page.url === url) > -1;
}

export function localeHasUneditedPageUrl(pages, approvedPages, disapprovedPages){
    return pages.some(({url}) => !pagesContainsUrl(url, approvedPages) && !pagesContainsUrl(url, disapprovedPages));
}

export function getFilteredPages(pages, globallyDisapprovedPageUrls){
    return pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));
}

export function getPageFromLocale(pageUrl, locale) {
    if(locale.pages){
        return locale.pages.find(page => page.url === pageUrl);
    }

    return undefined;
}

export function getStarredPageWithLocales(starredPages, editedLocales) {
    return starredPages.map(starredPageUrl => {
        const localesDisapproved = Object.keys(editedLocales)
            .map(key => ({id: key, ...editedLocales[key]}))
            .filter(({disapprovedPages = []}) => pagesContainsUrl(starredPageUrl, disapprovedPages))
            .map(({id}) => {
                return ({id})
        });

        const localesApproved = Object.keys(editedLocales)
            .map(key => ({id: key, ...editedLocales[key]}))
            .filter(({approvedPages = []}) => pagesContainsUrl(starredPageUrl, approvedPages))
            .map(({id, approvedPages}) => {
                const approvedPage = approvedPages.find(approvedPage => {
                    return approvedPage.url ===  starredPageUrl;
                });

                return ({id, image: approvedPage.preferredImage})
            });

        return {
            url: starredPageUrl,
            localesDisapproved,
            localesApproved
        };
    });

}