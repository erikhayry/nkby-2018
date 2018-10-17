import React from "react"
import { compose, withProps } from "recompose"
import Head from 'next/head'
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        locales: [],
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

    render() {
        return (
            <div>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta charSet="utf-8" />
                </Head>
                <style jsx global>{`
                  body {
                    color: #222;
                    margin: 0;
                  }
                `}</style>
                <Map
                    locales={this.state.locales}
                />
            </div>
        )
    }
}

export default () => <App />;