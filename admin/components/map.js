import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import theme from '../static/themes/dark.json';
import { localeHasPages, localeHasApprovedPageUrl, localeHasUneditedPageUrl, getPages } from '../utils/filters'

function getLabel(localeFilter, filteredPages = [], approvedPages = [], disapprovedPages = []){
    switch(localeFilter){
        case 'approved':
            return approvedPages.length;
        case 'unedited':
            return filteredPages.length - approvedPages.length - disapprovedPages.length;
        default:
            return filteredPages.length;
    }
}

function getMarkerImage(hasUneditedPageUrl, hasApprovedPageUrl){
    let marker = '/static/images/markers/_white.png';

    if(hasUneditedPageUrl){
        marker =  '/static/images/markers/_red.png';
    }
    if(hasApprovedPageUrl){
        marker =  '/static/images/markers/_green.png';
    }

    return {
        url: marker,
        size: new google.maps.Size(22, 40),
        labelOrigin: new google.maps.Point(11, 12)
    };
}

function addMarkers({onMarkerClick, locales, localeFilter, editedLocales, globallyDisapprovedPageUrls}){
    let addedPositions = [];

    if(locales){
        return Object.keys(locales).map((name) => {
            const locale = locales[name];
            const { pages = [] } = locale;
            const hasPages = localeHasPages(pages, globallyDisapprovedPageUrls);

            if(locale.position && hasPages){
                const editedLocale = editedLocales[name] || {};
                const {approvedPages = [], disapprovedPages = []} = editedLocale;
                const filteredPages = getPages(pages, globallyDisapprovedPageUrls);
                const hasApprovedPageUrl = localeHasApprovedPageUrl(filteredPages, approvedPages);
                const hasUneditedPageUrl = localeHasUneditedPageUrl(filteredPages, approvedPages, disapprovedPages);
                const label = getLabel(localeFilter, filteredPages, approvedPages, disapprovedPages);

                const position = editedLocale && editedLocale.position ? editedLocale.position : locale.position;
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

                return label > 0 ? <Marker
                    key={name}
                    position={position}
                    onClick={() => {
                        onMarkerClick(name, locale)
                    }}
                    icon={getMarkerImage(hasUneditedPageUrl, hasApprovedPageUrl)}
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