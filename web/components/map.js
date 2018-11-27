import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import theme from '../data/themes/dark.json';
import Router from 'next/router'
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import ReactGA from 'react-ga';

function renderMarkers(currentLocale, locales = [], activeMarker, setActiveMarker){
    const currentMarkerImage = {
        url: '/static/images/markers/white.png',
        size: new google.maps.Size(22, 40),
        labelOrigin: new google.maps.Point(11, 12)
    };

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
                    category: 'user',
                    action: `marker:${id}`
                });
                Router.push(`/locale/${id}`)
            }}
            onMouseOver={() => {
                setActiveMarker(id)
            }}
            icon={currentLocale.id === id ? currentMarkerImage : null}
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
                {renderMarkers(currentLocale, locales, activeMarker, setActiveMarker)}

                {props.userPosition && <Marker
                    key={'user'}
                    position={props.userPosition}
                    icon={userMarkerImage}
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
            </div>
        </>
    )
};

export default withScriptjs(withGoogleMap(Map));