import React from "react"
import 'isomorphic-unfetch'
import Head from 'next/head'
import Overlay from '../components/overlay';
import Map from '../components/map/map';
import Page from '../components/page'
import {withRouter} from 'next/router'

import { get, post } from '../utils/api'
import { getLocales, getLocale } from '../utils'

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


    setLocaleFilter = (type) => {
        this.setState({
            localeFilter: type
        })
    }

    render() {
        const { localeFilter, editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales, test} = this.state;
        const { locales } = this.props;

        return (
            <Page styles={{padding:0}}>
                <div style={{
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
                </div>
                <Map
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API}&v=3.exp&libraries=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100vh`, width: '100%' }} />}
                    mapElement={<div style={{ height: `100%` }} />}

                    locales={locales}
                    localeFilter={localeFilter}
                    editedLocales={editedLocales}
                    globallyDisapprovedPageUrls={globallyDisapprovedPageUrls}
                />
            </Page>
        )
    }
}

App.getInitialProps = async function (context) {
    const locales = getLocales();


    return { locales }
}

export default withRouter(App)
