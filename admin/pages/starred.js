import React from 'react'
import Link from 'next/link'

import 'isomorphic-unfetch'
import { get } from '../utils/api'
import locales from '../static/crawler-result-with-locales.json';
import { getStarredPageWithLocales, getPageFromLocale } from '../utils/filters'
import { toImagesSrc } from '../utils'
import Page from '../components/page'
import { List, Header, Icon, Image, Grid, Button } from 'semantic-ui-react'

export default class Index extends React.Component {
    state = {
        hideApproved: true
    };

    static async getInitialProps () {
        const editedLocales = await get('/get/edited-locales');
        const starredPages = await get('/get/starred-pages');

        return { editedLocales, starredPages }
    }

    renderLocales(title, localesList){
        return (
            <>
                <h3>{title}</h3>
                <ul>
                    {localesList.map(({id}, i) => {
                        const locale = locales[id] || {};
                        return (
                            <li key={i}>
                                <Link href={`/?locale=${id}`}>
                                    <a>{locale.name + ' ' + locale.zipCode}</a>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </>
        )
    }

    render () {
        const { hideApproved } = this.state;
        const {starredPages, editedLocales} = this.props;
        const starredPageWithLocales = getStarredPageWithLocales(starredPages, editedLocales);
        const starredPageWithLocalesFiltered = starredPageWithLocales.filter(({localesApproved}) => !hideApproved || (hideApproved && localesApproved.length === 0))
        return (
            <Page title={'Starred'}>
                <Button onClick={() => {
                    this.setState({hideApproved: !hideApproved})
                }}>{`${hideApproved ? 'Visa' : 'Göm'} godkända`}</Button>

                <List divided relaxed>
                    {starredPageWithLocalesFiltered.map(({url, localesApproved, localesDisapproved}) => {
                        return (
                            <List.Item key={url}>
                                <List.Content>
                                    <List.Header as='a' href={url} target="_blank">{url}</List.Header>
                                    <Grid columns={hideApproved ? 'one' : 'two'} divided>
                                        <Grid.Row>
                                        {!hideApproved && <Grid.Column>
                                            {this.renderLocales('Godkända', localesApproved)}
                                            </Grid.Column>
                                        }
                                            <Grid.Column>
                                                {this.renderLocales('Slängda', localesDisapproved)}
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </List.Content>
                            </List.Item>
                        )
                    })}
                </List>

                <Link prefetch href='/'><a>Back</a></Link>
            </Page>
        )
    }
}