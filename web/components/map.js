import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import theme from '../data/themes/dark.json';
import Overlay from './overlay.js';
import Router from 'next/router'
import Locales from './locales';
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import ReactGA from 'react-ga';
import Link from 'next/link'

function render(locales = [], activeMarker, setActiveMarker){
    return locales.map(({id, ...locale}) => {
        const { name, position } = locale;
        return position ? <MarkerWithLabel
            key={id}
            position={position}
            labelAnchor={{x: 0, y: 0}}
            labelStyle={{
                backgroundColor: "yellow",
                fontSize: "14px",
                padding: "16px",
                visibility: id === activeMarker ? 'visible' : 'hidden'
            }}
            zIndex={id === activeMarker ? 1 : 0}
            onClick={() => {
                ReactGA.event({
                    category: 'User',
                    action: 'Clicked on marker',
                    value: id,
                });
                Router.push(`/?locale=${id}`, `/locale/${id}`)
            }}
            onMouseOver={() => {
                setActiveMarker(id)
            }}
        >
            <div>{name}</div>
        </MarkerWithLabel> : null
    });
}

const Map = (props) => {
    const userMarkerImage = {
        url: '/static/images/markers/white.png',
        size: new google.maps.Size(22, 40),
        labelOrigin: new google.maps.Point(11, 12)
    };

    const { currentLocale, isSmallDevice, locales, activeMarker, setActiveMarker} = props;

    return (
        <>
        <GoogleMap
            defaultZoom={currentLocale ? 15 : 12}
            defaultCenter={currentLocale ? currentLocale.position : { lat: 63.5217687, lng: 22.5216011 }}
            ref={props.onMapMounted}
            options={{
                fullscreenControl: !isSmallDevice,
                mapTypeControl: false,
                streetViewControl: false,
                zoomControl: true,
                scaleControl: false,
                scrollwheel: false,
                locationControl: true,
                styles: theme,
            }}
        >
            {render(locales, activeMarker, setActiveMarker)}

            {props.userPosition && <Marker
                key={'user'}
                position={props.userPosition}
                icon={userMarkerImage}
            />}

            {!isSmallDevice && currentLocale && <InfoWindow position={currentLocale.position} onCloseClick={() => {
                Router.push(`/`)
            }}>
                <div style={{
                    width: 500,
                    height: 500,
                    borderRadius: 0,
                    padding: 5
                }}>
                    <Locales currentLocale={currentLocale} />
                </div>
            </InfoWindow>}

            {isSmallDevice && currentLocale && <Overlay
                currentLocale={currentLocale}
                setCurrentLocale={() => {
                    Router.push(`/`)
                }}
            />}

        </GoogleMap>
        <div style={{
            position: 'absolute',
            top: 5,
            left: 5,
            padding: 4,
            color: '#fff',
            zIndex: 1
        }}>
            <button onClick={props.setLocation} style={{
                display: 'block',
                backgroundColor: 'transparent',
                padding: 4,
                color: '#fff',
                border: '2px solid #fff',
                marginBottom: 5,
                fontSize: 14,
                textTransform: 'uppercase',
            }}>Hitta mig</button>
            <Link href="/about" as="/om">
                <a style={{
                    textAlign: 'center',
                    display: 'block',
                    backgroundColor: 'transparent',
                    padding: 4,
                    color: '#fff',
                    border: '2px solid #fff',
                    fontSize: 14,
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                }}>Om</a>
            </Link>

        </div>
        </>
    )
};

export default withScriptjs(withGoogleMap(Map));