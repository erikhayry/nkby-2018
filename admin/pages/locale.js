import React from "react"
import 'isomorphic-unfetch'
import Page from '../components/page'
import {withRouter} from 'next/router'

import { get, post } from '../utils/api'
import { getLocales, getLocale, toImagesSrc } from '../utils'

import { Button, Icon, Header, Label, Segment, Form, Divider, Card, Image, Dimmer, Grid } from 'semantic-ui-react';

class Locale extends React.Component {
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
    }

    async componentDidMount () {
        const editedLocales = await get('/get/edited-locales');
        const globallyDisapprovedPageUrls = await get('/get/disapproved-page-url-globally');
        const starredPages = await get('/get/starred-pages');
        const reportedLocales = await get('/get/reported-locales');

        this.setState({ editedLocales, globallyDisapprovedPageUrls, starredPages, reportedLocales });
    }

    state = {
        showAllImages: undefined,
        inputValueLng: 0,
        inputValueLat: 0,
        inputValueName: '',
        showUnedited: true,
        showApproved: false,
        showDisapproved: false,
        editedLocales: [],
        globallyDisapprovedPageUrls: [],
        starredPages: [],
        reportedLocales: []
    };

    toggleView(val){
        this.setState(val);
    }

    updateInputValueLng(evt) {
        this.setState({
            inputValueLng: evt.target.value
        });
    }

    updateInputValueLat(evt) {
        this.setState({
            inputValueLat: evt.target.value
        });
    }

    updateInputValueName(evt) {
        this.setState({
            inputValueName: evt.target.value
        });
    }


    showAllImages = (currentPage) => {
        this.setState({
            showAllImages: currentPage
        })
    };

    setAsPreferredImages = (localeId, pageUrl, preferredImage) => {
        this.addPreferredPageImage({
            id: localeId,
            pageUrl,
            preferredImage
        })
    };

    renderImage = (localeName, page, type, preferredImage) => {
        const {images = []} = page;
        if(images.length > 0){
            let src = preferredImage || images[0].src;
            return (
                <Image
                    onClick={() => {
                        if(type === 'approved'){
                            this.showAllImages({localeName, preferredImage, ...page})
                        }
                    }}
                    src={toImagesSrc(src)}
                    style={{
                        opacity: type !== 'approved' || preferredImage ? 1 : 0.5
                    }}
                    label={{ as: 'a', ribbon: 'right', content: images.length, color: 'black'}}

                />
            )
        }

        return null;
    };

    renderImages = (localeName, pageUrl, images = [], type, preferredImage) => {
        if(this.state.showAllImages === pageUrl){
            return (
                <div style={{
                    textAlign: 'center'
                }}>
                    {images.map(url => {
                        return <Image
                            key={url}
                            onClick={() => {
                                this.setState({
                                    showAllImages: undefined
                                }, () => {
                                    this.setAsPreferredImages(localeName, pageUrl, url);
                                });
                            }}
                            src={toImagesSrc(url)}
                            size='medium'
                            label={preferredImage === url && { as: 'a', corner: 'left', icon: 'heart', color: 'green'}}
                        />
                    })}
                    <br/>
                    <button onClick={() => {
                        this.showAllImages();
                    }}>Stäng</button>
                </div>

            )

        }

        return null;
    };

    renderPage = (page, i, localeId, type, approvedPage = {}, isStarred) => {
        return (
            <Card key={i}>
                {this.renderImage(localeId, page, type, approvedPage.preferredImage)}
                <Card.Content>
                    <Card.Meta>
                        {isStarred && <Label size='mini' color='yellow'>
                            <Icon name='star' /> Stjärnmärkt
                        </Label>}
                    </Card.Meta>
                    <Card.Description>
                        <a href={page.url} target="_blank">{page.title || page.url}</a>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button.Group size='mini' fluid vertical>
                        {type === 'unedited' && <React.Fragment>
                            <Button color='green' onClick={()=> {this.approve({
                                id: localeId,
                                pageUrl: page.url
                            })}}><Icon name='check' /> Godkänn</Button>
                            <Button color='red' onClick={()=> {this.disapprove({
                                id: localeId,
                                pageUrl: page.url
                            })}}><Icon name='trash' /> Släng</Button>
                            <Button color='black' onClick={()=> {this.disapproveGlobally(page.url)}}><Icon name='globe' /> Släng globalt</Button>
                        </React.Fragment>}

                        {type === 'approved' && <React.Fragment>
                            <Button color='purple' onClick={()=> {this.undoApprove({
                                id: localeId,
                                pageUrl: page.url
                            })}}><Icon name='undo' /> Ångra</Button>
                        </React.Fragment>}

                        {type === 'disapproved' && <React.Fragment>
                            <Button onClick={()=> {this.undoDisapprove({
                                id: localeId,
                                pageUrl: page.url
                            })}}><Icon name='undo' /> Ångra</Button>
                        </React.Fragment>}
                        {!isStarred && <Button color='yellow' onClick={()=> {this.addStarForPage(page.url)}}>
                            <Icon name='star' /> Stjärnmärk
                        </Button>}
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    };

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

    render(){
        const {currentLocale: {id, locale}} = this.props;
        const {globallyDisapprovedPageUrls = [], starredPages = [], reportedLocales= [], editedLocales = []} = this.state;
        const editedLocale = editedLocales[id] || {};
        const { approvedPages = [], disapprovedPages = [], alternativeNames = [], position: editedPosition = {}} = editedLocale;

        const pages = locale.pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));
        const approvedPagesForLocale = pages.filter(page => approvedPages.find((approvedPage) => approvedPage.url === page.url)) || [];
        const disapprovedPagesForLocale = pages.filter(page => disapprovedPages.find((disapprovedPage) => disapprovedPage.url === page.url)) || [];
        const uneditedPageUrlsForLocale = pages.filter(page => !disapprovedPages.find((disapprovedPage) => disapprovedPage.url === page.url) && !approvedPages.find((approvedPage) => approvedPage.url === page.url)) || [];

        const localeIsReported = reportedLocales.includes(id);

        const localePosition = locale.position || {};

        return (
            <Page>
                <Header as='h2' textAlign='center' style={{
                    textTransform: 'capitalize'
                }}>
                    <Icon name='marker' />
                    <Header.Content>
                        {locale.name}
                        {localeIsReported && <Label size='mini' color='red'>
                            Anmäld
                        </Label>}
                        {(editedPosition.lng || editedPosition.lat)  && <Label size='mini' color='green'>
                            Position ändrad
                        </Label>}
                        <Header.Subheader> {alternativeNames.map((name, i) => (<span key={name}>{i > 0 ? ` , ${name}` : name}</span>))}</Header.Subheader>
                    </Header.Content>
                </Header>

                <Segment color='red'>
                    <Header as='h3'>
                        Ändra
                    </Header>
                    <Form>
                        <Form.Group>
                            <Form.Input width={3} fluid placeholder='lng' defaultValue={editedPosition.lng ? editedPosition.lng: localePosition.lng} onChange={evt => this.updateInputValueLng(evt)} />
                            <Form.Input width={3} fluid placeholder='lat' defaultValue={editedPosition.lat ? editedPosition.lat: localePosition.lat} onChange={evt => this.updateInputValueLat(evt)} />
                            <Form.Button onClick={() => {
                                this.updateLocale({
                                    id,
                                    position: {
                                        lng: Number(this.state.inputValueLng),
                                        lat: Number(this.state.inputValueLat)
                                    }
                                });

                            }} content='Ändra kordinater' />
                        </Form.Group>
                    </Form>
                    <Divider />
                    <Form>
                        <Form.Group>
                            <Form.Input width={3} type="text" fluid placeholder='Alternativt namn' value={this.state.inputValueName} onChange={evt => this.updateInputValueName(evt)} />
                            <Form.Button onClick={() => {
                                this.addName({
                                    id,
                                    alternativeNames: [...alternativeNames, this.state.inputValueName]
                                });

                            }}>Lägg till namn</Form.Button>
                        </Form.Group>
                    </Form>
                    <Divider />
                    <Form>
                        <Form.Group>
                            <Form.Button onClick={()=> {this.addReportedLocale(id)}} disabled={localeIsReported}>Rapportera</Form.Button>
                        </Form.Group>
                    </Form>
                </Segment>

                <Segment>
                    <Header as='h3' textAlign='center' onClick={() => {
                        this.toggleView({
                            showApproved: !this.state.showApproved
                        })
                    }}>
                        <Icon name='check' />
                        <Header.Content>
                            Godkända
                            <Label circular>
                                {approvedPagesForLocale.length}
                            </Label>
                        </Header.Content>
                    </Header>

                    <Card.Group itemsPerRow={6}>
                        {
                            (this.state.showApproved || uneditedPageUrlsForLocale.length === 0) &&
                            approvedPagesForLocale.map((page, index) =>
                                this.renderPage(page, index, id, 'approved', approvedPages.find((approvedPage) => approvedPage.url === page.url), starredPages.includes(page.url)))
                        }
                    </Card.Group>

                    <Divider />

                    <Header as='h3' textAlign='center' onClick={() => {
                        this.toggleView({
                            showUnedited: !this.state.showUnedited
                        })
                    }}>
                        <Icon name='question' />
                        <Header.Content>
                            Obehandlade
                            <Label circular>
                                {uneditedPageUrlsForLocale.length}
                            </Label>
                        </Header.Content>
                    </Header>

                    <Card.Group itemsPerRow={6}>
                        {this.state.showUnedited && uneditedPageUrlsForLocale.map((page, index) => this.renderPage(page, index, id, 'unedited', undefined, starredPages.includes(page.url)))}
                    </Card.Group>

                    <Divider />

                    <Header as='h3' textAlign='center' onClick={() => {
                        this.toggleView({
                            showDisapproved: !this.state.showDisapproved
                        })
                    }}>
                        <Icon name='trash' />
                        <Header.Content>
                            Slängda
                            <Label circular>
                                {disapprovedPagesForLocale.length}
                            </Label>
                        </Header.Content>
                    </Header>

                    <h2 onClick={() => {
                        this.toggleView({
                            showDisapproved: !this.state.showDisapproved
                        })
                    }}></h2>
                    <Card.Group itemsPerRow={6}>
                        {this.state.showDisapproved && disapprovedPagesForLocale.map((page, index) => this.renderPage(page, index, id, 'disapproved', undefined, starredPages.includes(page.url)))}
                    </Card.Group>
                </Segment>
                <Dimmer active={Boolean(this.state.showAllImages)} onClickOutside={() => {
                    this.setState({
                        showAllImages: undefined
                    });
                }}>
                    <div style={{
                        height: '100vh',
                        overflow: 'auto',
                        padding: 10,
                        boxSizing: 'border-box'
                    }}>
                        <Button circular
                                color='red'
                                onClick={() => {
                                    this.setState({
                                        showAllImages: undefined
                                    });
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px'
                                }}
                                icon='close'
                        />
                        <Grid columns={5} padded>
                            {this.state.showAllImages && this.state.showAllImages.images.map(({src, description}) => {
                                const {url, localeName} = this.state.showAllImages;
                                return <Grid.Column key={src}>
                                    <Image
                                        onClick={() => {
                                            this.setState({
                                                showAllImages: undefined
                                            }, () => {
                                                this.setAsPreferredImages(id, url, src);
                                            });
                                        }}
                                        src={toImagesSrc(src)}
                                        alt={description}
                                        label={this.state.showAllImages.preferredImage === src && { as: 'a', corner: 'left', icon: 'heart', color: 'green'}}
                                    />
                                    <p>{description || 'Bildtext saknas'}</p>
                                </Grid.Column>
                            })}
                        </Grid>
                    </div>
                </Dimmer>
            </Page>
        )
    }

}

Locale.getInitialProps = async function (context) {
    const { id } = context.query
    const locales = getLocales();

    const locale = getLocale(id);

    return { locales, currentLocale: { id, locale} }


}

export default withRouter(Locale)