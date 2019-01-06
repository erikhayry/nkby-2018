import React from "react"
import 'isomorphic-unfetch'
import Head from 'next/head'
import Overlay from '../components/overlay';
import Map from '../components/map/map';
import Page from '../components/page'
import LocalesList from '../components/locales-list'
import LocalesTable from '../components/locales-table'
import {withRouter} from 'next/router'
import { localeHasPages, localeHasApprovedPageUrl, localeHasUneditedPageUrl, getFilteredPages, localeHashMissingAltForPreferredImage, getLocalesWithData } from '../utils/filters'

import { get, post } from '../utils/api'
import { getLocales, getLocale } from '../utils'

import { Button } from 'semantic-ui-react'
import env from '../env.json';

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

const UNEDITED_FILTERS = [
    {
        value: 'no-alt-for-preffered-image',
        text: 'Visa utan alt text'
    },
    {
        value: 'has-unedited-pages',
        text: 'Visa med ooediterade sidor'
    },
    {
        value: 'all',
        text: 'Visa alla'
    },
]

class App extends React.Component {
    constructor(props){
        super(props);
    }

    async componentDidMount () {
        const editedLocales = await get('/get/edited-locales');
        const globallyDisapprovedPageUrls = await get('/get/disapproved-page-url-globally');
        const starredPages = await get('/get/starred-pages');
        const reportedLocales = await get('/get/reported-locales');

        const localesWithData = getLocalesWithData(getLocales(), editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales)

        this.setState({ localesWithData, editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales});
    }

    state = {
        currentLocale: undefined,
        localeFilter: 'all',
        uneditedFilter: 'all',
        editedLocales: [],
        globallyDisapprovedPageUrls: [],
        starredPages: [],
        reportedLocales: [],
        localesWithData: [],
        showMap: false
    };


    setLocaleFilter = (type) => {
        this.setState({
            localeFilter: type
        })
    }

    setUneditedFilter = (type) => {
        this.setState({
            uneditedFilter: type
        })
    }

    render() {
        const { localeFilter, uneditedFilter, editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales, localesWithData, showMap} = this.state;
        const { locales, filteredColumnsQuery } = this.props;

        return (
            <Page styles={{padding:0}}>
                <div style={{
                    padding: 10
                }}>
                <Button onClick={() => {
                    this.setState({
                        showMap: !this.state.showMap
                    })
                }}>Visa/göm karta</Button>
                {showMap &&
                <>
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
                        <br/>
                        {localeFilter === 'unedited' && <Button.Group>
                            {UNEDITED_FILTERS.map(btn => (
                                <Button
                                    key={btn.value}
                                    compact
                                    positive={uneditedFilter === btn.value}
                                    onClick={() => {
                                        this.setUneditedFilter(btn.value)
                                    }}>
                                    {btn.text}
                                </Button>
                            ))}
                        </Button.Group>}
                    <Map
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${env.GOOGLE_MAPS_API || process.env.GOOGLE_MAPS_API}&v=3.exp&libraries=geometry,drawing,places`}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px`, width: '100%' }} />}
                        mapElement={<div style={{ height: `100%` }} />}

                        locales={locales}
                        localeFilter={localeFilter}
                        uneditedFilter={uneditedFilter}
                        editedLocales={editedLocales}
                        globallyDisapprovedPageUrls={globallyDisapprovedPageUrls}
                    />
                </>}
                </div>
                <div style={{
                    padding: 10
                }}>
                    <LocalesTable locales={localesWithData} filteredColumnsQuery={filteredColumnsQuery}/>
                </div>
            </Page>
        )
    }
}

App.getInitialProps = async function ({query}) {
    const locales = getLocales();


    return { locales, filteredColumnsQuery: query.filteredColumns }
}

export default withRouter(App)
