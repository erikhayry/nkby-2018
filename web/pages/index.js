import React from "react"
import { compose, withProps } from "recompose"
import Head from 'next/head'
import Overlay from '../components/overlay';
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        locales: [],
        currentLocale: undefined
    };

    componentDidMount() {
        let that = this;
        fetch('/static/locales.json')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ locales: responseAsJson })
            });
    }

    setCurrentLocale = (name, locale) => {
        this.setState({ currentLocale: name && locale ? {name, locale} : undefined})
    };

    render() {
        return (
            <div>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta charSet="utf-8" />
                </Head>
                <style jsx global>{`
                  body {
                    font: 11px menlo;
                    color: #222;
                    margin: 0;
                  }
                `}</style>
                <Map
                    onMarkerClick={this.setCurrentLocale}
                    locales={this.state.locales}
                />
                <Overlay
                    currentLocale={this.state.currentLocale}
                    setCurrentLocale={this.setCurrentLocale}
                />
            </div>
        )
    }
}

export default () => <App />;