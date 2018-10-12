import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import theme from '../static/theme.json';

function addMarkers({addresses, onMarkerClick, showApproved, approvedLocations}){
    let addedPositions = [];
    if(addresses){
        return Object.keys(addresses).map((key) => {
            if(showApproved && (!approvedLocations[key] || approvedLocations[key].approved.length === 0)){
                return null;
            }

            const address = addresses[key];
            if(address.locale){
                const position = address.locale;
                const positionAsString = JSON.stringify(position);
                const positionAdded = addedPositions.find((position) => {
                    return position === positionAsString;
                });

                if(positionAdded){
                    position.lat = position.lat - 0.0001;
                    position.lng = position.lng + 0.0001;
                    addedPositions.push(JSON.stringify(position));
                } else{
                    addedPositions.push(positionAsString);
                }

                let label = 0;
                if(showApproved){
                    address.pages.forEach((page) => {
                        if(approvedLocations[key].approved.includes(page.url)){
                            label++
                        }
                    })
                } else {
                    label = address.pages.length;
                }

                return <Marker
                    key={key} position={position}
                    onClick={() => {
                        onMarkerClick(key, address)
                    }}
                    label={label.toString()}
                />
            }

            return null;
        })
    }

    return null;
}

const Map = compose(
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