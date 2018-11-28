import React from "react"
import MapWrapper from '../components/map-wrapper';
import LocalesList from '../components/locales-list';
import { getLocales } from '../utils'
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
                    <LocalesList locales={locales} />
                </noscript>
                <MapWrapper locales={locales} />
            </Page>
        )
    }
}

App.getInitialProps = async function () {
    const locales = await getLocales();
    return { locales }
};

export default App