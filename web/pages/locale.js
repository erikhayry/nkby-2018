import Link from 'next/link'
import { getLocales, getLocale, getLocalesNearby } from '../utils'
import StaticMap from '../components/map/static-map';
import Map from '../components/map';
import Page from '../components/page.js';
import PageList from '../components/page-list.js';

const Locale = ({currentLocale = {}}) => {
    const localesNearby = getLocalesNearby(currentLocale.id, currentLocale.position, 9);

    return (
        <Page>
            <h1>{currentLocale.name}</h1>
            <noscript>
                <StaticMap currentLocale={currentLocale} localesNearby={localesNearby}/>
                <a href="#nearby-locales">Närliggande adresser</a>
            </noscript>
            <Map
                position={currentLocale.position}
                locales={[currentLocale]}
                style={{height: '200px', width: '200px'}}
                options={{
                    fullscreenControl: false,
                    locationControl: false,
                    zoomControl: false,
                    draggable: false,
                }}
                showFindMeButton={false}
                enableUserInteractions={false}
            />

            <PageList pages={currentLocale.pages} />

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
        </Page>
    )
};

Locale.getInitialProps = async function (context) {
    const { locale: id } = context.query;
    const locale = getLocale(id);

    if(id){
        return { currentLocale: locale }
    }

    return {currentLocale: undefined }
};

export default Locale;