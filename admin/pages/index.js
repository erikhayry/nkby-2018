import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'
import theme from '../static/themes/dark.json';
import Overlay from '../components/overlay';
import Map from '../components/map';
import { Button } from 'semantic-ui-react'

class App extends React.PureComponent {
    state = {
        locales: [],
        currentLocale: undefined,
        editedLocales: {},
        globallyDisapprovedPageUrls: [],
        localeFilter: 'all',
        starredPages: [],
        reportedLocales: []
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
        fetch('http://localhost:3001/get/reported-locales')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ reportedLocales: responseAsJson })
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

    addReportedLocale = (name) => {
        let that = this;
        this.api('/add/reported-locale', 'post', name)
            .then(function(responseAsJson) {
                that.setState({reportedLocales: responseAsJson})
            });
    };

    updateLocale = (data) => {
        console.log(data)
        let that = this;
        this.api('/add/locale-data', 'post', data)
            .then(function(responseAsJson) {
                that.setState({editedLocales: responseAsJson})
            });
    };

    addName = (data) => {
        console.log(data)
        let that = this;
        this.api('/add/locale-data', 'post', data)
            .then(function(responseAsJson) {
                that.setState({editedLocales: responseAsJson})
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
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"></link>
                </Head>
                <style jsx global>{`
                  body {
                    color: #222;
                    margin: 0;
                  }
                `}</style>
                {!this.state.currentLocale && <div style={{
                    position: 'fixed',
                    zIndex: 1,
                    padding: 10
                }}>
                    <Button.Group>
                        {[
                            {
                                value: 'approved',
                                text: 'Visa godkända'
                            },
                            {
                                value: 'unedited',
                                text: 'Visa oediterade'
                            },
                            {
                                value: 'all',
                                text: 'Visa alla'
                            },
                        ].map(btn => (
                            <Button
                                key={btn.value}
                                compact
                                positive={this.state.localeFilter === btn.value}
                                onClick={() => {
                                    this.setLocaleFilter(btn.value)
                                }}>
                                {btn.text}
                            </Button>
                        ))}
                    </Button.Group>
                </div>}
                <Map
                    onMarkerClick={this.setCurrentLocale}
                    locales={this.state.locales}
                    localeFilter={this.state.localeFilter}
                    editedLocales={this.state.editedLocales}
                    globallyDisapprovedPageUrls={this.state.globallyDisapprovedPageUrls}
                />
                {this.state.currentLocale && <Overlay
                    addPreferredPageImage={this.addPreferredPageImage}
                    approve={this.approve}
                    undoApprove={this.undoApprove}
                    disapprove={this.disapprove}
                    undoDisapprove={this.undoDisapprove}
                    disapproveGlobally={this.disapproveGlobally}
                    addStarForPage={this.addStarForPage}
                    addReportedLocale={this.addReportedLocale}
                    addName={this.addName}
                    updateLocale={this.updateLocale}

                    setCurrentLocale={this.setCurrentLocale}
                    globallyDisapprovedPageUrls={this.state.globallyDisapprovedPageUrls}
                    starredPages={this.state.starredPages}
                    reportedLocales={this.state.reportedLocales}
                    currentLocale={this.state.currentLocale}
                    editedLocales={this.state.editedLocales}
                />}
            </div>
        )
    }
}

export default () => <App />;