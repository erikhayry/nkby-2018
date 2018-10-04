import fs from 'fs';

const addresses = [
    'andrasjö strandväg',
    'andrasjövägen',
    'arbetaregatan',
    'badhusstigen',
    'bangatan',
    'bankgatan',
    'berggränd',
    'bergstigen',
    'bjonsgränd',
    'blåhakegränd',
    'bockmöllergatan',
    'bollgränd',
    'bonskogsvägen',
    'bonäsvägen',
    'borgaregatan',
    'brahegränd',
    'broasvägen',
    'buskåkersgränd',
    'bådasvängen',
    'conradigatan',
    'dalabackavägen',
    'diskusgränd',
    'domherrevägen',
    'drakasvägen',
    'fabriksgatan',
    'fiskaregränd',
    'fjärrgränd',
    'fläskesnabbgränd',
    'fogdegränd',
    'forsbackastigen',
    'forsbackavägen',
    'forsbackgränd',
    'forsby byväg',
    'forsbygränd',
    'frihemsvägen',
    'frillmossavägen',
    'frostasvägen',
    'furugränd',
    'fältskärsgatan',
    'färgaregatan',
    'färgaregränd',
    'grangränd',
    'granvägen',
    'grev tott gatan',
    'gustav adolfsgatan',
    'gustav adolfsgränd',
    'hagagatan',
    'hantverkaregatan',
    'hantverkaregränd',
    'haraldsrundan',
    'hjortrongränd',
    'högbackavägen',
    'hökvägen',
    'idrottsgatan',
    'idrottsgränd',
    'jakobstadsvägen',
    'jeansborgsvägen',
    'joupersgatan',
    'juthasvägen',
    'jöns drakes väg',
    'karl grönforsväg',
    'karleborgsgatan',
    'karlmansgatan',
    'klockaregränd',
    'kolonivägen',
    'kovjokivägen',
    'kvarnvägen',
    'kyrkogatan',
    'kytobacksgränd',
    'källbackgatan',
    'larshällvägen',
    'levälävägen',
    'lingongränd',
    'lojlaxvägen',
    'lundagatan',
    'lybecksgatan',
    'långstrandsvägen',
    'lövasvägen',
    'lövsgränd',
    'markbyvägen',
    'markenvägen',
    'mathesiusgatan',
    'mellangatan',
    'mortamavägen',
    'munsala riksväg',
    'munsalavägen',
    'nevastvägen',
    'norra munsalavägen',
    'norrskenet',
    'nybackagatan',
    'nygårdsgränd',
    'nygårdsvägen',
    'nylandsvägen',
    'nåpevägen',
    'nätörsvägen',
    'patmosgatan',
    'pelkosgränd',
    'prästgårdsgränd',
    'pälsvägen',
    'rajåkersgränden',
    'rajåkersstigen',
    'rajåkersvägen',
    'regnbågen',
    'remalskroken',
    'renbackavägen',
    'residensgatan',
    'riksväg åtta',
    'rudbackavägen',
    'ryssbackavägen',
    'rödhakegränd',
    'sandvägen',
    'sandåsgränd',
    'seminariegatan',
    'sexmansgränd',
    'skeppsgatan',
    'skeppörsgränd',
    'skogsgatan',
    'skogsvaktargatan',
    'skutasvägen',
    'smedsbackavägen',
    'smedsgränd',
    'soldatåkersgränd',
    'sollefteågatan',
    'solliden',
    'sorvistvägen',
    'spången',
    'staketgatan',
    'stenbackagatan',
    'stjärnfallet',
    'stormossgränd',
    'sundsbackgränd',
    'sundsbackkroken',
    'sundsbackstigen',
    'sundsbackvägen',
    'södra ringvägen',
    'tallvägen',
    'topeliusesplanaden',
    'trädgårdsmästaregränd',
    'tvärgatan',
    'värnamogatan',
    'värnamogränd',
    'västanlid',
    'västra jeppovägen',
    'ytterjeppovägen',
    'åminnegränd',
    'åminnevägen',
    'älvgränd',
    'östanlid',
    'östra jeppovägen',
    'östra åvägen'
];

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ',
    Promise: Promise

});

function geoCode(address, postcode = '66900', country = 'FI'){
    return new Promise((resolve, reject) => {
        googleMapsClient.geocode({address: `${address}, ${postcode}, ${country}`})
            .asPromise()
            .then(responses => {
                resolve({
                        geoCodeData: responses.json.results[0],
                        address
                    })
            })
    })
}

function toFile(data) {
    fs.writeFile("data/geocoded-addresses.json", JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

const reqs = addresses.map(address => geoCode(address));

Promise.all(reqs)
    .then((responses) => {
        toFile(responses)
    })
    .catch((err) => {
        console.log(err);
    });


