import React from "react"
import MapWrapper from '../components/map-wrapper';
import MapList from '../components/map-list';
import { getLocales, getLocale } from '../utils'
import Link from 'next/link';
import Page from '../components/page.js';

class App extends React.PureComponent {
    render() {
        const { locales } = this.props;

        return (
            <Page>
                <Link href="/about" as="/om">
                    <a>Om</a>
                </Link>

                <noscript>
                    <MapList locales={locales} />
                </noscript>
                <MapWrapper locales={locales} />
            </Page>
        )
    }
}

App.getInitialProps = async function (context) {
    const locales = await getLocales();
    return { locales }
};

export default App