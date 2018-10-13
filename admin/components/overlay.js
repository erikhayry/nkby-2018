class Overlay extends React.PureComponent {
    renderPage = (page, i, localeName, type) => {
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


            </li>
        )
    };

    render() {
        if(this.props.currentLocale){
            const {editedLocales = {}, currentLocale: {name, locale}, globallyDisapprovedPageUrls} = this.props;
            const approvedPageUrls = editedLocales[name] ?  editedLocales[name].approvedPageUrls : [];
            const disapprovedPageUrls = editedLocales[name] ?  editedLocales[name].disapprovedPageUrls : [];
            const pages = locale.pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));

            const approvedPageUrlsForLocale = pages.filter(page => approvedPageUrls.includes(page.url)) || [];
            const disapprovedPageUrlsForLocale = pages.filter(page => disapprovedPageUrls.includes(page.url)) || [];
            const uneditedPageUrlsForLocale = pages.filter(page => !disapprovedPageUrls.includes(page.url) && !approvedPageUrls.includes(page.url)) || [];

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

                    <h2>Godkända</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {approvedPageUrlsForLocale.map((page, index) => this.renderPage(page, index, name, 'approved'))}
                    </ul>
                    <h2>Obehandlade</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {uneditedPageUrlsForLocale.map((page, index) => this.renderPage(page, index, name, 'unedited'))}
                    </ul>
                    <h2>Slängda</h2>
                    <ul style={{
                        padding: 0,
                        margin: 0,
                        overflow: 'hidden',
                        borderBottom: '1px solid #000'
                    }}>
                        {disapprovedPageUrlsForLocale.map((page, index) => this.renderPage(page, index, name, 'disapproved'))}
                    </ul>

                    <button onClick={this.props.setCurrentLocale} style={{
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