class Overlay extends React.PureComponent {
    state = {
        showAllImages: undefined,
        inputValueLng: 0,
        inputValueLat: 0,
        inputValueName: ''
    };

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


    showAllImages = (url) => {
        this.setState({
            showAllImages: url
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

    renderImages = (localeName, pageUrl, images = [], type, preferredImage) => {
        if(this.state.showAllImages === pageUrl){
            return (
                <div style={{
                    textAlign: 'center'
                }}>
                    {images.map(url => {
                        return <img
                            key={url}
                            onClick={() => {
                                this.setState({
                                    showAllImages: undefined
                                }, () => {
                                    this.setAsPreferredImages(localeName, pageUrl, url);
                                });
                            }}
                            src={`http://www.nykarlebyvyer.nu/${url.replace('../../../', '')}`}
                            alt=""
                            width="300px"
                            style={{
                                margin: 10,
                                border: preferredImage === url ? '5px solid #ff5858' : 'none'
                            }}
                        />
                    })}
                    <br/>
                    <button onClick={() => {
                        this.showAllImages();
                    }}>Stäng</button>
                </div>

            )

        } else if(images.length > 0){
            let src = preferredImage || images[0];
            return (
                <div style={{
                    position: 'relative',
                    display: 'inline-block'
                }}>
                    <img
                        onClick={() => {
                            if(type === 'approved'){
                                this.showAllImages(pageUrl)
                            }
                        }}
                        src={`http://www.nykarlebyvyer.nu/${src.replace('../../../', '')}`}
                        alt=""
                        width="200px"
                        style={{
                            opacity: preferredImage ? 1 : 0.5
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        color: '#fff',
                        backgroundColor: '#ff5858',
                        padding: 2
                    }}>{images.length}</div>
                </div>
            )
        }

        return null;
    };

    renderPage = (page, i, localeName, type, approvedPage = {}, isStarred) => {
        return (
            <li key={i} style={{
                listStyle: 'none',
                width: this.state.showAllImages && this.state.showAllImages === page.url ? '100%' : '50%',
                float: 'left',
                marginBottom: '10px',
                display: this.state.showAllImages && this.state.showAllImages !== page.url ? 'none' : 'block',
                textAlign: 'center'
            }}>
                {this.renderImages(localeName, page.url, page.images, type, approvedPage.preferredImage)}
                <br/>
                <a href={page.url} target="_blank" style={{
                    display: 'block',
                    marginBottom: 10
                }}>{page.title || page.url}{isStarred && '★'}</a>

                {type === 'unedited' && <div>
                    <button onClick={()=> {this.props.approve({
                        name: localeName,
                        pageUrl: page.url
                    })}}>Godkänn</button>
                    <button onClick={()=> {this.props.disapprove({
                        name: localeName,
                        pageUrl: page.url
                    })}}>Släng</button>
                    <button onClick={()=> {this.props.disapproveGlobally(page.url)}}>Släng globalt</button>
                </div>}

                {type === 'approved' && <div>
                    <button onClick={()=> {this.props.undoApprove({
                        name: localeName,
                        pageUrl: page.url
                    })}}>Ångra</button>
                </div>}

                {type === 'disapproved' && <div>
                    <button onClick={()=> {this.props.undoDisapprove({
                        name: localeName,
                        pageUrl: page.url
                    })}}>Ångra</button>
                </div>}

                <button onClick={()=> {this.props.addStarForPage(page.url)}} disabled={isStarred}>Stjärnmärk</button>

            </li>
        )
    };

    render() {
        if(this.props.currentLocale){
            const {editedLocales = {}, currentLocale: {name, locale}, globallyDisapprovedPageUrls, starredPages, reportedLocales} = this.props;
            const editedLocale = editedLocales[name] || {};
            console.log(editedLocale)
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
                    <h1 style={{
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        color: localeIsReported ? 'red' : '#000'
                    }}>
                        {name}
                    </h1>

                    <div>
                        <button onClick={()=> {this.props.addReportedLocale(name)}} disabled={localeIsReported}>Rapportera</button>
                        <hr/>
                        <input type="number" placeholder={'lng'} defaultValue={editedPosition ? editedPosition.lng: locale.position.lng} onChange={evt => this.updateInputValueLng(evt)}/>
                        <input type="number" placeholder={'lat'} defaultValue={editedPosition ? editedPosition.lat: locale.position.lat} onChange={evt => this.updateInputValueLat(evt)}/>

                        <button onClick={() => {
                            this.props.updateLocale({
                                name,
                                position: {
                                    lng: Number(this.state.inputValueLng),
                                    lat: Number(this.state.inputValueLat)
                                }
                            });

                        }}>Ändra kordinater</button>

                        <hr/>
                        {alternativeNames.map(name => (<span key={name}>{name} </span>))} :
                        <input type="text" placeholder={'namn'} value={this.state.inputValueName} onChange={evt => this.updateInputValueName(evt)}/>

                        <button onClick={() => {
                            this.props.addName({
                                name,
                                alternativeNames: [...alternativeNames, this.state.inputValueName]
                            });

                        }}>Lägg till namn</button>
                    </div>

                    <h2>Godkända</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {approvedPagesForLocale.map((page, index) => this.renderPage(page, index, name, 'approved', approvedPages.find((approvedPage) => approvedPage.url === page.url), starredPages.includes(page.url)))}
                    </ul>
                    <h2>Obehandlade ({uneditedPageUrlsForLocale.length})</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {uneditedPageUrlsForLocale.map((page, index) => this.renderPage(page, index, name, 'unedited', undefined, starredPages.includes(page.url)))}
                    </ul>
                    <h2>Slängda</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {disapprovedPagesForLocale.map((page, index) => this.renderPage(page, index, name, 'disapproved', undefined, starredPages.includes(page.url)))}
                    </ul>

                    <button onClick={() => {
                        this.setState({
                            showAllImages: undefined
                        }, () => {
                            this.props.setCurrentLocale()
                        });
                    }} style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px'
                    }}>Tillbaka till kartan</button>
                </div>
            )
        }

        return null;
    }
}

export default Overlay;