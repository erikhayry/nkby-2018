class Overlay extends React.PureComponent {
    renderPage = (page, i, key, type) => {
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


                {type === 'unedited' && <div>
                    <button onClick={()=> {this.props.approve({
                        id: key,
                        url: page.url
                    })}}>Godkänn</button>
                    <button onClick={()=> {this.props.disapprove({
                        id: key,
                        url: page.url
                    })}}>Släng</button>
                </div>}

                {type === 'approved' && <div>
                    <button onClick={()=> {this.props.undoApprove({
                        id: key,
                        url: page.url
                    })}}>Ångra</button>
                </div>}

                {type === 'disapproved' && <div>
                    <button onClick={()=> {this.props.undoDisapprove({
                        id: key,
                        url: page.url
                    })}}>Ångra</button>
                </div>}


            </li>
        )
    }

    render() {
        if(this.props.currentAddress){
            const {key, address} = this.props.currentAddress;
            const approved = this.props.editedLocations[key] ?  this.props.editedLocations[key].approved : [];
            const disapproved = this.props.editedLocations[key] ?  this.props.editedLocations[key].disapproved : [];

            const approvedAddresses = address.pages.filter(page => approved.includes(page.url)) || [];
            const disapprovedAddresses = address.pages.filter(page => disapproved.includes(page.url)) || [];
            const uneditedAddresses = address.pages.filter(page => !disapproved.includes(page.url) && !approved.includes(page.url)) || [];

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
                        {approvedAddresses.map((page, index) => this.renderPage(page, index, key, 'approved'))}
                    </ul>
                    <h2>Obehandlade</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {uneditedAddresses.map((page, index) => this.renderPage(page, index, key, 'unedited'))}
                    </ul>
                    <h2>Slängda</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {disapprovedAddresses.map((page, index) => this.renderPage(page, index, key, 'disapproved'))}
                    </ul>

                    <button onClick={this.props.setCurrentAddress} style={{
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