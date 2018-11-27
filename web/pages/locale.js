import Link from 'next/link'
import {withRouter} from 'next/router'
import ReactGA from 'react-ga';
import { getLocales, getLocale, sortPagesByTitle, parseImageSrc, getLocalesNearby } from '../utils'
import StaticMap from '../components/static-map';
import MapWrapper from '../components/map-wrapper';

const Locale = ({currentLocale = {}, locales}) => {
    const localesNearby = getLocalesNearby(currentLocale.id, currentLocale.position, 9);

    return (<div style={{
        padding: 20
    }}>
        <h1>{currentLocale.name}</h1>
        <noscript>
            <StaticMap currentLocale={currentLocale} localesNearby={localesNearby}/>
            <a href="#nearby-locales">Närliggande adresser</a>
        </noscript>
        <MapWrapper
            currentLocale={currentLocale}
            locales={locales}
        />
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

        <noscript>
            <h2 id="nearby-locales">Närliggande adress</h2>
            <ol>
                {localesNearby.map(({id, name, pages}, i) => {
                    return (
                        <li key={i}>
                            <Link prefetch href={`/?locale=${id}`} as={`/locale/${id}`} ><a>{name} [{pages.length}]</a></Link>
                        </li>
                    )
                })}
            </ol>
        </noscript>

        <Link href="/">
            <a>Tillbaka</a>
        </Link>
    </div>)
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