import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import theme from '../static/theme.json';

function addMarkers({addresses, onMarkerClick, locationFilter, editedLocations}){
    let addedPositions = [];

    if(addresses){
        return Object.keys(addresses).map((key) => {
            const address = addresses[key];
            if(address.locale){
                const position = address.locale;
                const positionAsString = JSON.stringify(position);
                const positionAdded = addedPositions.find((position) => {
                    return position === positionAsString;
                });
                const hasApproved = editedLocations[key] ? address.pages.find(page => editedLocations[key].approved.includes(page.url)) : false;
                const hasUnedited = editedLocations[key] ? address.pages.find(page => !editedLocations[key].approved.includes(page.url) && !editedLocations[key].disapproved.includes(page.url)) : true;
                let label = 0;

                if(locationFilter === 'approved'){
                    if(!hasApproved ){
                        return null;
                    }
                    address.pages.forEach((page) => {
                        if(editedLocations[key] && editedLocations[key].approved.includes(page.url)){
                            label++
                        }
                    })
                } else if(locationFilter === 'unedited'){
                    if(!hasUnedited ){
                        return null;
                    }
                    address.pages.forEach((page) => {
                        if(!editedLocations[key] || (!editedLocations[key].approved.includes(page.url) && !editedLocations[key].disapproved.includes(page.url))){
                            label++
                        }
                    })
                } else {
                    label = address.pages.length;
                }

                if(positionAdded){
                    position.lat = position.lat - 0.0001;
                    position.lng = position.lng + 0.0001;
                    addedPositions.push(JSON.stringify(position));
                } else{
                    addedPositions.push(positionAsString);
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