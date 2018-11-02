import React from "react"
import { compose, withProps } from "recompose"
import Head from 'next/head'
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        locales: []
    };

    updateDimensions() {
        this.setState({isSmallDevice: window.innerWidth < 800});
    }

    componentDidMount() {
        let that = this;
        fetch('/static/locales.json')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ locales: responseAsJson })
            });

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
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
                    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
                    font-weight: 300;
                  }
                `}</style>
                <Map
                    locales={this.state.locales}
                    isSmallDevice={this.state.isSmallDevice}
                />
            </div>
        )
    }
}

export default () => <App />;