import React from "react"
import 'isomorphic-unfetch'
import Head from 'next/head'
import Overlay from '../components/overlay';
import Map from '../components/map';
import locales from '../static/crawler-result-with-locales.json';
import Page from '../components/page'
import {withRouter} from 'next/router'

import { get, post } from '../utils/api'

import { Button } from 'semantic-ui-react'

const LOCALE_FILTERS = [
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
]

class App extends React.Component {
    constructor(props){
        super(props);
        this.disapproveGlobally = this.disapproveGlobally.bind(this)
        this.addStarForPage = this.addStarForPage.bind(this)
        this.addReportedLocale = this.addReportedLocale.bind(this)
        this.updateLocale = this.updateLocale.bind(this)
        this.addName = this.addName.bind(this)
        this.addPreferredPageImage = this.addPreferredPageImage.bind(this)
        this.approve = this.approve.bind(this)
        this.undoApprove = this.undoApprove.bind(this)
        this.disapprove = this.disapprove.bind(this)
        this.undoDisapprove = this.undoDisapprove.bind(this)

        console.log(props)
    }

    async componentDidMount () {
        const editedLocales = await get('/get/edited-locales');
        const globallyDisapprovedPageUrls = await get('/get/disapproved-page-url-globally');
        const starredPages = await get('/get/starred-pages');
        const reportedLocales = await get('/get/reported-locales');

        this.setState({ editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales});
    }

    state = {
        currentLocale: undefined,
        localeFilter: 'all',
        editedLocales: [],
        globallyDisapprovedPageUrls: [],
        starredPages: [],
        reportedLocales: []
    };


    setCurrentLocale = (name, locale) => {
        this.setState({ currentLocale: name && locale ? {name, locale} : undefined})
    };

    setLocaleFilter = (type) => {
        this.setState({
            localeFilter: type
        })
    }

    async disapproveGlobally(disapprovedUrl) {
        const globallyDisapprovedPageUrls = await post('/remove/disapproved-page-url-globally', disapprovedUrl)
        this.setState({globallyDisapprovedPageUrls})
    }

    async addStarForPage(pageUrl) {
        const starredPages = await post('/add/starred-page', pageUrl)
        this.setState({starredPages})
    };

    async addReportedLocale(name) {
        const reportedLocales = await post('/add/reported-locale', name)
        this.setState({reportedLocales})
    };

    async updateLocale(data) {
        const editedLocales = await post('/add/locale-data', data)
        this.setState({editedLocales})
    };

    async addName(data) {
        const editedLocales = await post('/add/locale-data', data)
        this.setState({editedLocales})
    }

    async addPreferredPageImage(preferredImageData){
        const editedLocales = await post('/add/preferred-page-image', preferredImageData)
        this.setState({editedLocales})
    }

    async approve(urlData){
        const editedLocales = await post('/add/approved-page-url', urlData)
        this.setState({editedLocales})
    };

    async undoApprove(urlData){
        const editedLocales = await post('/remove/approved-page-url', urlData)
        this.setState({editedLocales})
    };

    async disapprove(urlData){
        const editedLocales = await post('/add/disapproved-page-url', urlData)
        this.setState({editedLocales})
    };

    async undoDisapprove(urlData){
        const editedLocales = await post('/remove/disapproved-page-url', urlData)
        this.setState({editedLocales})
    };

    render() {
        const { localeFilter, editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales, test} = this.state;
        const { currentLocale } = this.props;

        console.log(currentLocale)

        return (
            <Page styles={{padding:0}}>
                {!currentLocale && <div style={{
                    position: 'fixed',
                    zIndex: 1,
                    padding: 10
                }}>
                    <Button.Group>
                        {LOCALE_FILTERS.map(btn => (
                            <Button
                                key={btn.value}
                                compact
                                positive={localeFilter === btn.value}
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
                    locales={locales}
                    localeFilter={localeFilter}
                    editedLocales={editedLocales}
                    globallyDisapprovedPageUrls={globallyDisapprovedPageUrls}
                />
                {currentLocale && <Overlay
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
                    globallyDisapprovedPageUrls={globallyDisapprovedPageUrls}
                    starredPages={starredPages}
                    reportedLocales={reportedLocales}
                    currentLocale={currentLocale}
                    editedLocales={editedLocales}
                />}
            </Page>
        )
    }
}

App.getInitialProps = async function (context) {
    const { locale: name } = context.query

    if(name){
        return { currentLocale: {name, locale: {...locales[name]}} }
    }

    return {currentLocale: undefined}
}

export default withRouter(App)
