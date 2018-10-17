import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'
import theme from '../static/theme.json';
import Overlay from '../components/overlay';
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        locales: [],
        currentLocale: undefined,
        editedLocales: {},
        globallyDisapprovedPageUrls: [],
        localeFilter: 'all',
        starredPages: []
    };

    componentDidMount() {
        let that = this;
        fetch('http://localhost:3001/get/edited-locales')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                console.log(responseAsJson)
                that.setState({editedLocales: responseAsJson})
            });
        fetch('/static/crawler-result-with-locales.json')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ locales: responseAsJson })
            });
        fetch('http://localhost:3001/get/disapproved-page-url-globally')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ globallyDisapprovedPageUrls: responseAsJson })
            });
        fetch('http://localhost:3001/get/starred-pages')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ starredPages: responseAsJson })
            });
    }

    setCurrentLocale = (name, locale) => {
        this.setState({ currentLocale: name && locale ? {name, locale} : undefined})
    };

    setLocaleFilter = (type) => {
        this.setState({
            localeFilter: type
        })
    }

    api = (url, method, body = {}) => {
        console.log(url, method, body)
        let that = this;
        return fetch('http://localhost:3001' + url, {
                method,
                body: JSON.stringify(body)
            })
            .then(function(response) {
                return response.json()
            })
    }

    disapproveGlobally = (disapprovedUrl) => {
        let that = this;
        this.api('/remove/disapproved-page-url-globally', 'post', disapprovedUrl)
            .then(function(responseAsJson) {
                that.setState({globallyDisapprovedPageUrls: responseAsJson})
            });
    };

    addStarForPage = (pageUrl) => {
        let that = this;
        this.api('/add/starred-page', 'post', pageUrl)
            .then(function(responseAsJson) {
                that.setState({starredPages: responseAsJson})
            });
    };

    addPreferredPageImage = (preferredImageData) => {
        let that = this;
        this.api('/add/preferred-page-image', 'post', preferredImageData)
            .then(function(responseAsJson) {
                that.setState({editedLocales: responseAsJson})
            });
    }

    approve = (approvedUrlData) => {
        let that = this;
        this.api('/add/approved-page-url', 'post', approvedUrlData)
        .then(function(responseAsJson) {
            that.setState({editedLocales: responseAsJson})
        });
    };

    undoApprove = (approvedUrlData) => {
        let that = this;
        this.api('/remove/approved-page-url', 'post', approvedUrlData)
        .then(function(responseAsJson) {
            that.setState({editedLocales: responseAsJson})
        });
    };

    disapprove = (approvedUrlData) => {
        let that = this;
        this.api('/add/disapproved-page-url', 'post', approvedUrlData)
        .then(function(responseAsJson) {
            that.setState({editedLocales: responseAsJson})
        });
    };

    undoDisapprove = (approvedUrlData) => {
        let that = this;
        this.api('/remove/disapproved-page-url', 'post', approvedUrlData)
        .then(function(responseAsJson) {
            that.setState({editedLocales: responseAsJson})
        });
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
                {!this.state.currentLocale && <div style={{
                    position: 'fixed',
                    zIndex: 1
                }}>
                    <button disabled={this.state.localeFilter === 'approved'} onClick={() => {
                        this.setLocaleFilter('approved')
                    }}>{'Visa godkända'}</button>
                    <button disabled={this.state.localeFilter === 'unedited'} onClick={() => {
                        this.setLocaleFilter('unedited')
                    }}>{'Visa oediterade'}</button>
                    <button disabled={this.state.localeFilter === 'all'} onClick={() => {
                        this.setLocaleFilter('all')
                    }}>{'Visa alla'}</button>
                </div>}
                <Map
                    onMarkerClick={this.setCurrentLocale}
                    locales={this.state.locales}
                    localeFilter={this.state.localeFilter}
                    editedLocales={this.state.editedLocales}
                    globallyDisapprovedPageUrls={this.state.globallyDisapprovedPageUrls}
                />
                <Overlay
                    addPreferredPageImage={this.addPreferredPageImage}
                    approve={this.approve}
                    undoApprove={this.undoApprove}
                    disapprove={this.disapprove}
                    undoDisapprove={this.undoDisapprove}
                    disapproveGlobally={this.disapproveGlobally}
                    addStarForPage={this.addStarForPage}

                    globallyDisapprovedPageUrls={this.state.globallyDisapprovedPageUrls}
                    starredPages={this.state.starredPages}
                    currentLocale={this.state.currentLocale}
                    editedLocales={this.state.editedLocales}
                    setCurrentLocale={this.setCurrentLocale}
                />
            </div>
        )
    }
}

export default () => <App />;