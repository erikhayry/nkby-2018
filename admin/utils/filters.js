export function localeHasPages(pages, globallyDisapprovedPageUrls){
    return pages.some(page => !globallyDisapprovedPageUrls.includes(page.url));
}

export function localeHasApprovedPageUrl(pages, approvedPages){
    return pages.findIndex(page => approvedPages.find(approvedPage => approvedPage.url === page.url)) > -1;
}

export function localeHashMissingAltForPreferredImage(pages, approvedPages){
    if(approvedPages){
        return approvedPages.some(approvedPage => {
            const page = pages.find(page => page.url === approvedPage.url);
            if(page){
                const image = page.images.find(image => image.src === approvedPage.preferredImage)
                return image && !image.description;
            }

            return false;
        })
    }

    return false;

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


export function getLocalesWithData(locales, editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales) {

    return locales.map(locale => {
        const { pages = [] } = locale;
        const hasPages = localeHasPages(pages, globallyDisapprovedPageUrls);



        if(hasPages) {
            const editedLocale = editedLocales[locale.id] || {};
            const {approvedPages = [], disapprovedPages = []} = editedLocale;
            const filteredPages = getFilteredPages(pages, globallyDisapprovedPageUrls);
            const hasApprovedPageUrl = localeHasApprovedPageUrl(filteredPages, approvedPages);
            const hasUneditedPageUrl = localeHasUneditedPageUrl(filteredPages, approvedPages, disapprovedPages);
            const hasMissingAltForPreferredImage = localeHashMissingAltForPreferredImage(filteredPages, approvedPages);

            return {
                ...locale,
                hasApprovedPageUrl,
                hasUneditedPageUrl,
                hasUnapprovedPageUrl: !hasUneditedPageUrl && !hasApprovedPageUrl,
                hasMissingAltForPreferredImage,
                editedPosition: editedLocale.position
            }
        }

        return locale;




    });
}