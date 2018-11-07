import React from "react"
import { compose, withProps } from "recompose"
import Head from 'next/head'
import Map from '../components/map';
import {withRouter} from 'next/router'
import locales from '../static/locales.json';

class App extends React.PureComponent {
    state = {
        isSmallDevice: false
    }

    updateDimensions() {
        this.setState({isSmallDevice: window.innerWidth < 800});
    }

    componentDidMount() {
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
                    currentLocale={this.props.currentLocale}
                    locales={locales}
                    isSmallDevice={this.state.isSmallDevice}
                />
            </div>
        )
    }
}

App.getInitialProps = async function (context) {
    const { locale: name } = context.query;

    if(name){
        return { currentLocale: locales[name] }
    }

    return {currentLocale: undefined}
}

export default withRouter(App)