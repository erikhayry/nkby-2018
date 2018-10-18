import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import theme from '../static/themes/dark.json';

function addMarkers({onMarkerClick, locales, localeFilter, editedLocales, globallyDisapprovedPageUrls}){
    let addedPositions = [];

    if(locales){
        return Object.keys(locales).map((name) => {
            const locale = locales[name];
            if(locale.position && locale.pages.some(page => !globallyDisapprovedPageUrls.includes(page.url))){
                const position = locale.position;
                const positionAsString = JSON.stringify(position);
                const positionAdded = addedPositions.find((position) => {
                    return position === positionAsString;
                });
                const hasApprovedPageUrl = editedLocales[name] ? locale.pages.find(page => editedLocales[name].approvedPages.find(approvedPage => approvedPage.url === page.url)) : false;
                const hasUneditedPageUrl = editedLocales[name] ? locale.pages.find(page => !editedLocales[name].approvedPages.includes(page.url) && !editedLocales[name].disapprovedPages.includes(page.url)) : true;
                const pages = locale.pages.filter(page => !globallyDisapprovedPageUrls.includes(page.url));
                let label = 0;



                let marker = '/static/images/markers/_red.png';
                if(editedLocales[name] && editedLocales[name].approvedPages.every(page => page.preferredImage) && hasUneditedPageUrl){
                    marker = '/static/images/markers/_purple.png';
                } else if(hasApprovedPageUrl){
                    marker = '/static/images/markers/_green.png';
                }

                if(localeFilter === 'approved'){
                    if(!hasApprovedPageUrl ){
                        return null;
                    }
                    pages.forEach((page) => {
                        if(editedLocales[name] && editedLocales[name].approvedPages.find(approvedPage => approvedPage.url === page.url)){
                            label++
                        }
                    })
                } else if(localeFilter === 'unedited'){
                    if(!hasUneditedPageUrl ){
                        return null;
                    }
                    pages.forEach((page) => {
                        if(!editedLocales[name] ||
                            (
                                !editedLocales[name].approvedPages.find(approvedPage => approvedPage.url === page.url) &&
                                !editedLocales[name].disapprovedPages.find(disapprovedPage => disapprovedPage.url === page.url)
                            )
                        ){
                            label++
                        }
                    })
                } else {
                    label = pages.length;
                }

                if(positionAdded){
                    position.lat = position.lat - 0.0001;
                    position.lng = position.lng + 0.0001;
                    addedPositions.push(JSON.stringify(position));
                } else{
                    addedPositions.push(positionAsString);
                }

                const image = {
                    url: marker,
                    size: new google.maps.Size(22, 40),
                    labelOrigin: new google.maps.Point(11, 12)
                };

                return label > 0 ? <Marker
                    key={name} position={position}
                    onClick={() => {
                        onMarkerClick(name, locale)
                    }}
                    icon={image}
                    label={label.toString()}
                /> : null
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