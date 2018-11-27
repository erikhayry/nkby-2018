import Link from 'next/link'
import {withRouter} from 'next/router'
import ReactGA from 'react-ga';
import { getLocales, getLocale, sortPagesByTitle, parseImageSrc, getLocalesNearby } from '../utils'
import StaticMap from '../components/static-map';
import MapWrapper from '../components/map-wrapper';
import Page from '../components/page.js';
import LocaleStatic from '../components/pages/locale-static.js';
import LocaleDynamic from '../components/pages/locale-dynamic.js';



const Locale = ({currentLocale = {}, locales}) => {
    return (
        <Page>
            <h1>{currentLocale.name}</h1>

            <noscript>
                <LocaleStatic currentLocale={currentLocale} locales={locales} />
            </noscript>
                
            <LocaleDynamic currentLocale={currentLocale} locales={locales} />

            <ul>
                {sortPagesByTitle(currentLocale.pages).map((page, i) => {
                    return (
                        <li key={i}>
                            <img src={parseImageSrc(page.image)} />
                            <br/>
                            <ReactGA.OutboundLink
                                eventLabel="to-nykarlebyvyer"
                                to={page.url}
                                target="_blank"
                            >
                                {page.title}`
                            </ReactGA.OutboundLink>
                        </li>
                    )
                })}
            </ul>
            <Link href="/">
                <a>Tillbaka</a>
            </Link>
        </Page>
    )
};


Locale.getInitialProps = async function (context) {
    const { locale: id } = context.query;
    const locales = await getLocales();
    const locale = getLocale(id);

    if(id){
        return { currentLocale: locale, locales }
    }

    return {currentLocale: undefined, locales}
};

export default withRouter(Locale)