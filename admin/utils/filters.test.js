import { localeHasUneditedPageUrl } from './filters';

const pages = [
    {url: '1'},
    {url: '2'},
    {url: '3'},
];

const approvedPages = [
    {url: '1'}
];

const disapprovedPages = [
    {url: '1'}
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