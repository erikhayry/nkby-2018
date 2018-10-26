import { Button, Icon, Header, Label, Segment, Form, Divider, Card, Image, Dimmer, Grid } from 'semantic-ui-react';

class Overlay extends React.PureComponent {
    state = {
        showAllImages: undefined,
        inputValueLng: 0,
        inputValueLat: 0,
        inputValueName: '',
        showUnedited: true,
        showApproved: false,
        showDisapproved: false,
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

    setAsPreferredImages = (localeName, pageUrl, preferredImage) => {
        console.log('setAsPreferredImages', localeName, pageUrl, preferredImage);
        this.props.addPreferredPageImage({
            name: localeName,
            pageUrl,
            preferredImage
        })
    };

    renderImage = (localeName, page, type, preferredImage) => {
        const {images = []} = page;
        if(images.length > 0){
            let src = preferredImage || images[0];
            return (
                <Image
                    onClick={() => {
                        if(type === 'approved'){
                            this.showAllImages({localeName, preferredImage, ...page})
                        }
                    }}
                    src={`http://www.nykarlebyvyer.nu/${src.replace('../../../', '')}`}
                    style={{
                        opacity: preferredImage ? 1 : 0.5
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
                            src={`http://www.nykarlebyvyer.nu/${url.replace('../../../', '')}`}
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

    renderPage = (page, i, localeName, type, approvedPage = {}, isStarred) => {
        return (
            <Card key={i}>
                {this.renderImage(localeName, page, type, approvedPage.preferredImage)}
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
                            <Button color='green' onClick={()=> {this.props.approve({
                                name: localeName,
                                pageUrl: page.url
                            })}}><Icon name='check' /> Godkänn</Button>
                            <Button color='red' onClick={()=> {this.props.disapprove({
                                name: localeName,
                                pageUrl: page.url
                            })}}><Icon name='trash' /> Släng</Button>
                            <Button color='black' onClick={()=> {this.props.disapproveGlobally(page.url)}}><Icon name='globe' /> Släng globalt</Button>
                        </React.Fragment>}

                        {type === 'approved' && <React.Fragment>
                            <Button color='purple' onClick={()=> {this.props.undoApprove({
                                name: localeName,
                                pageUrl: page.url
                            })}}><Icon name='undo' /> Ångra</Button>
                        </React.Fragment>}

                        {type === 'disapproved' && <React.Fragment>
                            <Button onClick={()=> {this.props.undoDisapprove({
                                name: localeName,
                                pageUrl: page.url
                            })}}><Icon name='undo' /> Ångra</Button>
                        </React.Fragment>}
                        {!isStarred && <Button color='yellow' onClick={()=> {this.props.addStarForPage(page.url)}}>
                            <Icon name='star' /> Stjärnmärk
                        </Button>}
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    };

    render() {
        if(this.props.currentLocale){
            const {editedLocales = {}, currentLocale: {name, locale}, globallyDisapprovedPageUrls, starredPages, reportedLocales} = this.props;
            const editedLocale = editedLocales[name] || {};
            const { approvedPages = [], disapprovedPages = [], alternativeNames = [], position: editedPosition = {}} = editedLocale;
            const pages = locale.pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));
            const approvedPagesForLocale = pages.filter(page => approvedPages.find((approvedPage) => approvedPage.url === page.url)) || [];
            const disapprovedPagesForLocale = pages.filter(page => disapprovedPages.find((disapprovedPage) => disapprovedPage.url === page.url)) || [];
            const uneditedPageUrlsForLocale = pages.filter(page => !disapprovedPages.find((disapprovedPage) => disapprovedPage.url === page.url) && !approvedPages.find((approvedPage) => approvedPage.url === page.url)) || [];

            const localeIsReported = reportedLocales.includes(name);

            return (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    backgroundColor: '#ffffffbd',
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    padding: '10px',
                    boxSizing: 'border-box'

                }}>
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
                                <Form.Input width={3} type="number" fluid placeholder='lng' defaultValue={editedPosition.lng ? editedPosition.lng: locale.position.lng} onChange={evt => this.updateInputValueLng(evt)} />
                                <Form.Input width={3} type="number" fluid placeholder='lat' defaultValue={editedPosition.lat ? editedPosition: locale.position.lat} onChange={evt => this.updateInputValueLat(evt)} />
                                <Form.Button onClick={() => {
                                    this.props.updateLocale({
                                        name,
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
                                    this.props.addName({
                                        name,
                                        alternativeNames: [...alternativeNames, this.state.inputValueName]
                                    });

                                }}>Lägg till namn</Form.Button>
                            </Form.Group>
                        </Form>
                        <Divider />
                        <Form>
                            <Form.Group>
                                <Form.Button onClick={()=> {this.props.addReportedLocale(name)}} disabled={localeIsReported}>Rapportera</Form.Button>
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
                                    this.renderPage(page, index, name, 'approved', approvedPages.find((approvedPage) => approvedPage.url === page.url), starredPages.includes(page.url)))
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
                            {this.state.showUnedited && uneditedPageUrlsForLocale.map((page, index) => this.renderPage(page, index, name, 'unedited', undefined, starredPages.includes(page.url)))}
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
                            {this.state.showDisapproved && disapprovedPagesForLocale.map((page, index) => this.renderPage(page, index, name, 'disapproved', undefined, starredPages.includes(page.url)))}
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
                            <Image.Group size='medium'>
                                {this.state.showAllImages && this.state.showAllImages.images.map(imageUrl => {
                                    const {url, localeName} = this.state.showAllImages;
                                    return <Image
                                        key={imageUrl}
                                        onClick={() => {
                                            this.setState({
                                                showAllImages: undefined
                                            }, () => {
                                                this.setAsPreferredImages(localeName, url, imageUrl);
                                            });
                                        }}
                                        src={`http://www.nykarlebyvyer.nu/${imageUrl.replace('../../../', '')}`}
                                        label={this.state.showAllImages.preferredImage === imageUrl && { as: 'a', corner: 'left', icon: 'heart', color: 'green'}}
                                    />
                                })}
                            </Image.Group>
                        </div>
                    </Dimmer>

                    <Button circular
                            onClick={() => {
                                this.setState({
                                    showAllImages: undefined
                                }, () => {
                                    this.props.setCurrentLocale()
                                });
                            }}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px'
                            }}
                            icon='close'
                    />
                </div>
            )
        }

        return null;
    }
}

export default Overlay;