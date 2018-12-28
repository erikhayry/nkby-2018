import locales from '../admin/static/crawler-result-with-locales.json';
import editedLocales from '../api/data/edited-locales.json';
import fs from 'fs';
var flatten = require('flat')

const urls = JSON.parse(fs.readFileSync('./data/urls.json'))

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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function countPageData(pageDataKey){
    return Object.keys(editedLocales)
        .map(key => {
            const pages = editedLocales[key].approvedPages || [];
            return pages.map(page => {
                return page[pageDataKey]
            })
        })
        .reduce(function(accumulator, currentValue) {
            return accumulator.concat(currentValue);
        })
        .filter( onlyUnique )
        .length
}

let localesData = {};
let statistics = {
    numberOfLocales: Object.keys(editedLocales).length,
    numberOfPages: countPageData('url'),
    numberOfImages: countPageData('preferredImage'),
    totalNumberOfPages: urls.length,
    totalNumberOfImages: 1395 + 13414
};
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
        const localeId = key.replace(/å/g, 'a').replace(/ä/g, 'ae').replace(/ö/g, 'o').replace(/ /g, '-')

        localesData[localeId] = {
            name: locales[key].name,
            position: editedLocales[key].position || locales[key].position,
            pages
        }
    }
});

fs.writeFile('web/data/locales.json', JSON.stringify(localesData))
fs.writeFile('web/data/statistics.json', JSON.stringify(statistics))