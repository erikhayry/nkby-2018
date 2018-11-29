import React from "react"
import Map from '../components/map';
import LocalesList from '../components/locales-list';
import { getLocales } from '../utils'
import Link from 'next/link';
import Page from '../components/page.js';
import store from '../utils/store'

class App extends React.PureComponent {
    render() {
        const { locales } = this.props;
        const visitedLocales = store.get('visited-locales') || [];

        return (
            <Page>
                <Link href="/about" as="/om">
                    <a>Om</a>
                </Link>

                <noscript>
                    <LocalesList locales={locales}  />
                </noscript>
                <Map locales={locales} visitedLocales={visitedLocales} style={{height: '500px'}}/>
            </Page>
        )
    }
}

App.getInitialProps = async function () {
    const locales = await getLocales();

    return { locales }
};

export default App