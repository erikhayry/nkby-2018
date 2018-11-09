const renderPage = (page, i) => {
    return (
        <li key={i} style={{
            listStyle: 'none',
            width: '100%',
            marginBottom: '20px'
        }}>
            <a href={page.url} target="_blank" style={{
                textDecoration: 'none',
                display: 'block',
                minHeight: 100,
                width: '100%'
            }}>
                {page.image && <img
                    src={`http://www.nykarlebyvyer.nu/${page.image.replace('../../../', '')}`}
                    alt=""
                    width="100%"
                    style={{
                        maxWidth: '100%',
                        display: 'block',
                        width: 'auto',
                        margin: '0 auto'
                    }}
                />}
                <div style={{
                    display: 'inline-block',
                    marginBottom: 10,
                    color: '#fff',
                    backgroundColor: '#222',
                    padding: 5,
                    textDecoration: 'none',
                    fontSize: 16,
                    maxHeight: 'calc(100% - 30px)',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    border: '5px solid #222',
                    width: '100%'
                }}>{page.title || page.url}</div>
            </a>

        </li>
    )
};

const Locales = ({currentLocale}) =>
    <>
        <h1 style={{
            textTransform: 'capitalize',
            margin: '5px 0 20px',
            letterSpacing: 2,
            color: '#ceb216',
            textAlign: 'left'
        }}>{currentLocale.name}</h1>
        <ul style={{
            padding: 0,
            margin: 0,
            overflow: 'hidden'
        }}>
            {currentLocale.pages.map((page, index) => renderPage(page, index))}
        </ul>
    </>;


export default Locales;