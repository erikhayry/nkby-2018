import React from "react"
import { compose, withProps, withStateHandlers, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import theme from '../static/themes/dark.json';
import Overlay from './overlay.js';



function renderPage(page, i){
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
}

function addMarkers(props){
    const {onToggleOpen, locales, currentLocale = {}} = props;
    if(locales) {
        return Object.keys(locales).map((key) => {
            const locale = locales[key];
            const { name, position } = locale;
            return <Marker
                key={key} position={position}
                onClick={() => {
                    onToggleOpen(locale)
                }}
            >
                {!props.isSmallDevice && currentLocale.name === name && <InfoWindow onCloseClick={onToggleOpen}>
                    <div style={{
                        width: 500,
                        height: 500,
                        borderRadius: 0,
                        padding: 5
                    }}>
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
    withHandlers(() => {
        const refs = {
            map: undefined
        };

        return {
            onMapMounted: () => ref => {
                refs.map = ref
            },
            setLocation: () => () => {
                console.log('setLocation')
                navigator.geolocation.getCurrentPosition((position) => {
                    refs.map.panTo({lat: position.coords.latitude, lng: position.coords.longitude})
                });
            }
        }
    }),

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
    <div>
        <GoogleMap
            defaultZoom={12}
            defaultCenter={{ lat: 63.5217687, lng: 22.5216011 }}
            ref={props.onMapMounted}
            options={{
                fullscreenControl: !props.isSmallDevice,
                mapTypeControl: false,
                streetViewControl: false,
                zoomControl: true,
                scaleControl: false,
                scrollwheel: false,
                locationControl: true,
                styles: theme,
            }}
        >
            {addMarkers(props)}
        </GoogleMap>
        <button onClick={() => {
            props.setLocation()
        }} style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 5,
            left: 5,
            padding: 4,
            color: '#fff',
            border: '2px solid #fff',
            textTransform: 'uppercase',
            fontSize: '14',
            zIndex: 1
        }}>Hitta mig</button>
    </div>
);

export default Map;