import locales from '../admin/static/crawler-result-with-locales.json';
import editedLocales from '../api/data/edited-locales.json';
import fs from 'fs';

function getImage(images = [], preferredImage){
    let image = {};

    if(preferredImage){
        image = images.find(({src}) => src === preferredImage);
    } else {
        image = images[0]
    }

    if(image){
        if(image.description){
                return image
        }
        return {
            src: image.src
        }
    }

    return undefined


}

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
                image: getImage(pageData.images, approvedPage.preferredImage)
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

fs.writeFile('web/data/locales.json', JSON.stringify(res))
