import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import theme from '../../static/themes/dark.json';
import { localeHasPages, localeHasApprovedPageUrl, localeHasUneditedPageUrl, getFilteredPages } from '../../utils/filters'
import Router from 'next/router'

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

function getLocale({id, ...locale}, localeFilter, editedLocales, globallyDisapprovedPageUrls){
    const { pages = [] } = locale;
    const hasPages = localeHasPages(pages, globallyDisapprovedPageUrls);

    if(locale.position && hasPages) {
        const editedLocale = editedLocales[id] || {};
        const {approvedPages = [], disapprovedPages = []} = editedLocale;
        const filteredPages = getFilteredPages(pages, globallyDisapprovedPageUrls);
        const hasApprovedPageUrl = localeHasApprovedPageUrl(filteredPages, approvedPages);
        const hasUneditedPageUrl = localeHasUneditedPageUrl(filteredPages, approvedPages, disapprovedPages);
        const label = getLabel(localeFilter, filteredPages, approvedPages, disapprovedPages);

        return {
            locale, editedLocale, label, hasApprovedPageUrl, hasUneditedPageUrl
        }
    }

    return {}

}

function getPosition(editedLocale, locale, addedPositions){
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

    return position;
}

function addMarkers(locales = [], localeFilter, editedLocales, globallyDisapprovedPageUrls){
    let addedPositions = [];
    return locales.map(({id, ...locale}) => {
        const {editedLocale, label, hasUneditedPageUrl, hasApprovedPageUrl} = getLocale({id, ...locale}, localeFilter, editedLocales, globallyDisapprovedPageUrls);

        if(locale && label > 0 ){
            return <Marker
                key={id}
                position={getPosition(editedLocale, locale, addedPositions)}
                onClick={() => {
                    Router.push({
                        pathname: '/locale',
                        query: {id},
                    });
                }}
                icon={getMarkerImage(hasUneditedPageUrl, hasApprovedPageUrl)}
                label={label.toString()}
            />
        }

        return null;
    })

}

const Map = ({locales, localeFilter, editedLocales, globallyDisapprovedPageUrls}) =>
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
        {addMarkers(locales, localeFilter, editedLocales, globallyDisapprovedPageUrls)}
    </GoogleMap>;




export default withScriptjs(withGoogleMap(Map));