class Overlay extends React.PureComponent {
    state = {
        showAllImages: undefined
    };

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

    renderPage = (page, i, localeName) => {
        return (
            <li key={i} style={{
                listStyle: 'none',
                width: '100%',
                float: 'left',
                marginBottom: '10px',
                textAlign: 'center'
            }}>
                <img
                    src={`http://www.nykarlebyvyer.nu/${page.image.replace('../../../', '')}`}
                    alt=""
                    width="200px"
                />
                <br/>
                <a href={page.url} target="_blank" style={{
                    display: 'block',
                    marginBottom: 10
                }}>{page.title || page.url}</a>
            </li>
        )
    };

    render() {
        if(this.props.currentLocale){
            let {name, locale} = this.props.currentLocale;
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
                        textTransform: 'capitalize'
                    }}>{name}</h1>

                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {locale.pages.map((page, index) => this.renderPage(page, index, name))}
                    </ul>


                    <button onClick={() => {
                        this.props.setCurrentLocale()
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