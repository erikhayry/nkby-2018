import React from "react"
import Map from '../components/map';
import LocalesList from '../components/locales-list';
import { getLocales } from '../utils/locales'
import Link from 'next/link';
import Page from '../components/page.js';
import store from '../utils/store'
import style from './index.scss';

class App extends React.PureComponent {
    onZoomChanged(zoom){
        store.set('zoom', zoom)
    }

    onDragEnd(position){
        store.set('position', position)
    }

    render() {
        const { locales } = this.props;
        const visitedLocales = store.get('visited-locales') || [];
        const zoom = store.get('zoom');
        const position = store.get('position');

        return (
            <Page>
                <Link href="/about" as="/om">
                    <a className={style.link}>Om</a>
                </Link>

                <noscript>
                    <LocalesList locales={locales}  />
                </noscript>
                <Map
                    locales={locales}
                    visitedLocales={visitedLocales}
                    zoom={zoom}
                    position={position}
                    style={{height: '500px'}}
                    onDragEnd={this.onDragEnd}
                    onZoomChanged={this.onZoomChanged}
                />
            </Page>
        )
    }
}

App.getInitialProps = async function () {
    const locales = await getLocales();

    return { locales }
};

export default App