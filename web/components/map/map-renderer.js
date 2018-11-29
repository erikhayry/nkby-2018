import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Router from 'next/router'
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import ReactGA from 'react-ga';
import theme from '../../data/themes/dark.json';
import store from '../../utils/store'

function renderIcon(url){
    return {
        url,
        size: new google.maps.Size(22, 40),
        labelOrigin: new google.maps.Point(11, 12)
    }
}

function getIcon(id, currentLocaleId, visitedLocales){
    if(id === currentLocaleId){
        return renderIcon('/static/images/markers/white.png')
    }

    if(visitedLocales.includes(id)){
        return renderIcon('/static/images/markers/white.png')
    }

    return null
}

function renderMarkers(currentLocale = {}, locales = [], visitedLocales = [], activeMarker, setActiveMarker, enableUserInteractions = true){

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
            zIndex={id === activeMarker || currentLocale.id === id ? 1 : 0}
            onClick={() => {
                if(enableUserInteractions){
                    if(!visitedLocales.includes(id)){
                        store.set('visited-locales', [...visitedLocales, id]);
                    }

                    ReactGA.event({
                        category: 'user',
                        action: `marker:${id}`
                    });
                    Router.push(`/locale/${id}`)
                }
            }}
            onMouseOver={() => {
                if(enableUserInteractions) {
                    setActiveMarker(id)
                }
            }}
            icon={getIcon(id, currentLocale.id, visitedLocales)}
        >
            <div>{name}</div>
        </MarkerWithLabel> : null
    });
}

const MapRenderer = (props) => {
    const {
        currentLocale,
        locales,
        visitedLocales,
        activeMarker,
        setActiveMarker,
        options = {},
        showFindMeButton = true,
        enableUserInteractions
    } = props;

    return (
        <>
            {showFindMeButton && <button onClick={props.setLocation}>Hitta mig</button>}
            <GoogleMap
                defaultZoom={currentLocale ? 15 : 12}
                defaultCenter={currentLocale ? currentLocale.position : { lat: 63.5217687, lng: 22.5216011 }}
                ref={props.onMapMounted}
                options={{
                    fullscreenControl: true,
                    locationControl: true,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    scrollwheel: false,
                    styles: theme,
                    ...options
                }}
            >
                {renderMarkers(currentLocale, locales, visitedLocales, activeMarker, setActiveMarker, enableUserInteractions)}

                {props.userPosition && <Marker
                    key={'user'}
                    position={props.userPosition}
                    icon={renderIcon('/static/images/markers/white.png')}
                />}
            </GoogleMap>
        </>
    )
};

export default withScriptjs(withGoogleMap(MapRenderer));