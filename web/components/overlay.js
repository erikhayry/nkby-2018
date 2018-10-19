class Overlay extends React.PureComponent {
    renderPage = (page, i) => {
        return (
            <li key={i} style={{
                listStyle: 'none',
                width: '100%',
                float: 'left',
                marginBottom: '10px',
                textAlign: 'center'
            }}>

                <a href={page.url} target="_blank" style={{
                    display: 'block',
                    textDecoration: 'none',
                    minHeight: 300,
                    width: '100%'
                }}>
                    {page.image && <img
                        src={`http://www.nykarlebyvyer.nu/${page.image.replace('../../../', '')}`}
                        alt=""
                        width="400px"
                        style={{
                            maxWidth: '100%'
                        }}
                    />}
                    <br />
                    <div style={{
                        display: 'inline-block',
                        marginBottom: 20,
                        color: '#fff',
                        backgroundColor: '#222',
                        padding: 5,
                        textDecoration: 'none',
                        maxWidth: '75%',
                        fontSize: 16
                    }}>{page.title || page.url}</div>
                </a>
            </li>
        )
    };

    render() {
        if(this.props.currentLocale){
            let {currentLocale} = this.props;
            return (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    backgroundColor: 'rgba(256, 256, 256, 0.9)',
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    padding: '10px',
                    boxSizing: 'border-box',
                    zIndex: 2

                }}>
                    <h1 style={{
                        textAlign: 'center',
                        textTransform: 'capitalize',
                        margin: '5px 0 20px',
                        letterSpacing: 2,
                        color: '#ceb216',
                    }}>{currentLocale.name}</h1>

                    <ul style={{
                        padding: 0,
                        margin: '0 auto',
                        overflow: 'hidden',
                        maxWidth: 600
                    }}>
                        {currentLocale.pages.map((page, index) => this.renderPage(page, index, name))}
                    </ul>


                    <button onClick={() => {
                        this.props.setCurrentLocale()
                    }} style={{
                        position: 'absolute',
                        right: 5,
                        top: 5,
                        padding: 4,
                        border: '2px solid #222',
                        backgroundColor: 'transparent',
                        color: '#222'
                    }}>Stäng</button>
                </div>
            )
        }

        return null;
    }
}

export default Overlay;