import locales from '../admin/static/crawler-result-with-locales.json';
import editedLocales from '../api/data/edited-locales.json';
import fs from 'fs';

let res = {};
Object.keys(editedLocales).forEach(key => {
    let pages = editedLocales[key].approvedPages.map(approvedPage => {
        let pageData = locales[key].pages.find(page => page.url === approvedPage.url);

        return {
            title: pageData.title,
            url: pageData.url,
            image: approvedPage.preferredImage ? approvedPage.preferredImage : pageData.images[0]
        }
    });
    if(pages.length > 0){
        res[key] = {
            position: locales[key].position,
            pages
        }
    }
});

fs.writeFile('web/static/locales.json', JSON.stringify(res))
