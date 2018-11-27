import React from "react"
import MapWrapper from '../components/map-wrapper';
import {withRouter} from 'next/router'
import { getLocales, getLocale } from '../utils'
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import Link from 'next/link'

class App extends React.PureComponent {
    state = {
        isSmallDevice: false,
    };

    updateDimensions() {
        this.setState({isSmallDevice: window.innerWidth < 800});
    }

    componentDidMount() {
        const isDev = process.env.NODE_ENV !== 'production';
        if(!isDev){
            ReactGA.initialize('UA-129661075-1', {
                debug: true,
                titleCase: false
            });
            Sentry.init({
                dsn: 'https://89980de6a8aa466695ae8186dba70f9b@sentry.io/1305873'
            });
        }
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    render() {
        const isClient = typeof window !== 'undefined';
        const { locales } = this.props;


        return (
            <>
                <Link href="/about" as="/om">
                    <a style={{
                        textAlign: 'center',
                        display: 'block',
                        backgroundColor: 'transparent',
                        padding: 4,
                        color: '#fff',
                        border: '2px solid #fff',
                        fontSize: 14,
                        textTransform: 'uppercase',
                        textDecoration: 'none'
                    }}>Om</a>
                </Link>
                <noscript>
                    <MapList locales={locales} />
                </noscript>
                <MapWrapper
                    locales={locales}
                    isSmallDevice={this.state.isSmallDevice}
                />
            </>
        )
    }
}

App.getInitialProps = async function (context) {
    const { locale: id } = context.query;
    const locales = await getLocales();
    const locale = getLocale(id);

    if(id){
        return { currentLocale: locale, locales }
    }

    return {currentLocale: undefined, locales}
};

export default withRouter(App)