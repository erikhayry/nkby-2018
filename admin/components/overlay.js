class Overlay extends React.PureComponent {
    renderPage = (page, i) => {
        return (
            <li key={i} style={{
                listStyle: 'none',
                width: '50%',
                float: 'left',
                marginBottom: '10px'
            }}>
                {page.images.length > 0 && <img src={`http://www.nykarlebyvyer.nu/${page.images[0].replace('../../../', '')}`} alt="" width="100px"/>}
                <br/>
                <a href={page.url} target="_blank">{page.title || page.url}</a>
                <button onClick={()=> {this.approve({
                    id: this.state.currentAddress.key,
                    url: page.url
                })}}>Godkänn</button>
            </li>
        )
    }

    render() {
        if(this.props.currentAddress){
            const {key, address} = this.props.currentAddress;
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
                    }}>{key}</h1>
                    <h2>Godkända</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {address.pages.map(this.renderPage)}
                    </ul>
                    <h2>Obehandlade</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {address.pages.map(this.renderPage)}
                    </ul>
                    <h2>Slängda</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {address.pages.map(this.renderPage)}
                    </ul>

                    <button onClick={this.props.closeOverlay} style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px'
                    }}>Stäng</button>
                </div>
            )
        }

        return null;
    }
}

export default Overlay;