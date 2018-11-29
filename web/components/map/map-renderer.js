import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import theme from '../../data/themes/dark.json';

function renderIcon(url){
    return {
        url,
        size: new google.maps.Size(22, 40),
        labelOrigin: new google.maps.Point(11, 12)
    }
}

function getIcon(id, visitedLocales = []){
    if(visitedLocales.includes(id)){
        return renderIcon('/static/images/markers/white.png')
    }

    return null
}

function renderMarkers(locales = [], visitedLocales, activeMarker, setActiveMarker, handleMarkerEvent, enableUserInteractions = true){

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
                if(enableUserInteractions) {
                    handleMarkerEvent(id, visitedLocales);
                }
            }}
            onMouseOver={() => {
                if(enableUserInteractions) {
                    setActiveMarker(id)
                }
            }}
            icon={getIcon(id, visitedLocales)}
        >
            <div>{name}</div>
        </MarkerWithLabel> : null
    });
}

const MapRenderer = (props) => {
    const {
        locales,
        visitedLocales,
        activeMarker,
        setActiveMarker,
        options = {},
        showFindMeButton = true,
        enableUserInteractions,
        handleMarkerEvent,
        onZoomChanged,
        onDragEnd,
        zoom,
        position
    } = props;

    return (
        <>
            {showFindMeButton && <button onClick={props.setLocation}>Hitta mig</button>}
            <GoogleMap
                defaultZoom={zoom || 12}
                defaultCenter={position || { lat: 63.5217687, lng: 22.5216011 }}
                ref={props.onMapMounted}
                onZoomChanged={onZoomChanged}
                onDragEnd={onDragEnd}
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
                {renderMarkers(locales, visitedLocales, activeMarker, setActiveMarker, handleMarkerEvent, enableUserInteractions)}

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