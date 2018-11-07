import { localeHasUneditedPageUrl, getStarredPageWithLocales, getPageFromLocale } from './filters';

const pages = [
    {url: 'url1'},
    {url: 'url2'},
    {url: 'url3'},
];

const approvedPages = [
    {url: 'url1'}
];

const disapprovedPages = [
    {url: 'url1'}
];



test('hasUnedited', () => {
    expect(localeHasUneditedPageUrl(pages, [], [])).toBe(true);
    expect(localeHasUneditedPageUrl(pages, [{url: '1'}], [{url: '2'}])).toBe(true);
    expect(localeHasUneditedPageUrl(pages, [{url: '4'}], [])).toBe(true);

    expect(localeHasUneditedPageUrl(pages, approvedPages, disapprovedPages)).toBe(true);
    expect(localeHasUneditedPageUrl(pages, approvedPages, [])).toBe(true);
    expect(localeHasUneditedPageUrl(pages, [], disapprovedPages)).toBe(true);

    expect(localeHasUneditedPageUrl(pages, pages, disapprovedPages)).toBe(false);
});

test('getPageFromLocale', () => {
    const url = 'url-1';
    const locale = {
        "name": "sollefteågatan",
        "zipCode": "66900",
        "isAddressWithStreetNumber": false,
        "pages": [
            {
                "url": "http://nykarlebyvyer.nu/sidor/kortindi/PK/PK_A/PKA----2.HTM",
                "title": "Torget och Sollefteågatan",
                "images": [
                    "../vykort/PK/PK_A/PKA----2.JPG"
                ]
            },
            {
                "url": "url-1",
                "title": "Köpmansgatan",
                "images": [
                    "../vykort/PK/PK_A/PKAV030F.JPG"
                ]
            }
        ]
    }

    const page = getPageFromLocale(url, locale);


    expect(page.url).toBe('url-1');
    expect(page.title).toBe('Köpmansgatan');
    expect(page.images[0]).toBe('../vykort/PK/PK_A/PKAV030F.JPG');
})

test('getStarredPageWithLocales', () => {
    const starredPagesPages = [
        'url1',
        'url2',
        'url3',
        'url4'
    ];

    const editedLocales = {
        key1 : {
            disapprovedPages: [{url: 'url1'}],
            approvedPages: [{url: 'url2',  preferredImage: 'preferred-image-1'}]
        },
        key2 : {
            disapprovedPages: [],
            approvedPages: []
        },
        key3 : {
            disapprovedPages: [{url: 'url1'}, {url: 'url3'}],
            approvedPages: []
        },
        key4 : {
            approvedPages: [{url: 'url2'}]
        }
    };

    const starredPageWithLocales = getStarredPageWithLocales(starredPagesPages, editedLocales);

    const page1 = starredPageWithLocales[0];
    const page2 = starredPageWithLocales[1];
    const page3 = starredPageWithLocales[2];
    const page4 = starredPageWithLocales[3];

    expect(starredPageWithLocales.length).toBe(4);

    expect(page1.url).toBe('url1');
    expect(page1.localesDisapproved.length).toBe(2);
    expect(page1.localesDisapproved[0].id).toBe('key1');
    expect(page1.localesDisapproved[1].id).toBe('key3');
    expect(page1.localesApproved.length).toBe(0);

    expect(page2.url).toBe('url2');
    expect(page2.localesApproved.length).toBe(2);
    expect(page2.localesApproved[0].id).toBe('key1');
    expect(page2.localesApproved[0].image).toBe('preferred-image-1');
    expect(page2.localesApproved[1].id).toBe('key4');
    expect(page2.localesDisapproved.length).toBe(0);

    expect(page3.url).toBe('url3');
    expect(page3.localesDisapproved.length).toBe(1);
    expect(page3.localesDisapproved[0].id).toBe('key3');

    expect(page4.url).toBe('url4');
    expect(page4.localesApproved.length).toBe(0);
    expect(page4.localesDisapproved.length).toBe(0);
})