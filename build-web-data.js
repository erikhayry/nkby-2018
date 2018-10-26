import locales from '../admin/static/crawler-result-with-locales.json';
import editedLocales from '../api/data/edited-locales.json';
import fs from 'fs';

let res = {};
Object.keys(editedLocales).forEach(key => {
    let pages = [];
    if (editedLocales[key].approvedPages){
        pages = editedLocales[key].approvedPages.filter(approvedPage =>
            locales[key] && locales[key].pages.find(page => page.url === approvedPage.url)
        ).map(approvedPage => {
            let pageData = locales[key].pages.find(page => page.url === approvedPage.url);

            return {
                title: pageData.title,
                url: pageData.url,
                image: approvedPage.preferredImage ? approvedPage.preferredImage : pageData.images[0]
            }
        });
    }
    if(pages.length > 0){
        res[key] = {
            name: locales[key].name,
            position: editedLocales[key].position || locales[key].position,
            pages
        }
    }
});

fs.writeFile('web/static/locales.json', JSON.stringify(res))
