import React from "react"
import MapWrapper from '../components/map-wrapper';
import {withRouter} from 'next/router'
import { getLocales, getLocale } from '../utils'

class App extends React.PureComponent {
    state = {
        isSmallDevice: false,
    };

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
        const isClient = typeof window !== 'undefined';
        const { currentLocale, locales } = this.props;
        return (
            <div>
                <MapWrapper
                    isClient={isClient}
                    currentLocale={currentLocale}
                    locales={locales}
                    isSmallDevice={this.state.isSmallDevice}
                />
            </div>
        )
    }
}

App.getInitialProps = async function (context) {
    const { locale: id } = context.query;
    const locales = getLocales();
    const locale = getLocale(id);

    if(id){
        return { currentLocale: locale, locales }
    }

    return {currentLocale: undefined, locales}
};

export default withRouter(App)