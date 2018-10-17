import React from "react"
import { compose, withProps, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import theme from '../static/theme.json';
import Overlay from './overlay.js';


function renderPage(page, i){
    return (
        <li key={i} style={{
            listStyle: 'none',
            width: '100%',
            marginBottom: '10px',
            position: 'relative'
        }}>
            <a href={page.url} target="_blank" style={{
                textDecoration: 'none',
            }}>
                <img
                    src={`http://www.nykarlebyvyer.nu/${page.image.replace('../../../', '')}`}
                    alt=""
                    width="100%"
                    style={{
                        maxWidth: '100%'
                    }}
                />
                <br/>
                <div style={{
                    display: 'inline-block',
                    marginBottom: 10,
                    color: '#fff',
                    backgroundColor: '#222',
                    padding: 5,
                    textDecoration: 'none',
                    position: 'absolute',
                    bottom: 10,
                    right: 5,
                    maxWidth: '50%',
                    fontSize: 16
                }}>{page.title || page.url}</div>
            </a>

        </li>
    )
}

function addMarkers(props){
    console.log(props);
    const {onToggleOpen, locales, currentLocale = {}} = props;
    if(locales) {
        return Object.keys(locales).map((name) => {
            const locale = locales[name];
            return <Marker
                key={name} position={locale.position}
                onClick={() => {
                    onToggleOpen({name, ...locale})
                }}
            >
                {!props.isSmallDevice && currentLocale.name === name && <InfoWindow onCloseClick={onToggleOpen}>
                    <div style={{
                        width: 300,
                        height: 400,
                        borderRadius: 0,
                        padding: 5
                    }}>
                        <h1 style={{
                            textAlign: 'center',
                            textTransform: 'capitalize'
                        }}>{currentLocale.name}</h1>
                        <ul style={{
                            padding: 0,
                            margin: 0,
                            overflow: 'hidden'
                        }}>
                            {currentLocale.pages.map((page, index) => renderPage(page, index))}
                        </ul>
                    </div>
                </InfoWindow>}
                {props.isSmallDevice && currentLocale.name === name && <Overlay 
                    currentLocale={currentLocale}
                    setCurrentLocale={onToggleOpen}
                />}
            </Marker>
        })
    }

    return null;
}

const Map = compose(
    withStateHandlers(() => ({
        currentLocale: undefined,
    }), {
        onToggleOpen: () => (currentLocale) => {
            return ({
                currentLocale: currentLocale
            })
        }
    }),
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh`, width: '100%' }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={12}
        defaultCenter={{ lat: 63.5217687, lng: 22.5216011 }}

        options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true,
            scaleControl: false,
            styles: theme
        }}
    >
        {addMarkers(props)}
    </GoogleMap>
);

export default Map;