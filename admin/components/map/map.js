import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import theme from '../../static/themes/dark.json';
import { localeHasPages, localeHasApprovedPageUrl, localeHasUneditedPageUrl, getFilteredPages, localeHashMissingAltForPreferredImage } from '../../utils/filters'
import Router from 'next/router'

function getNumberOfPagesVisibleForUnedited(uneditedFilter, filteredPages, approvedPages, disapprovedPages){
    switch(uneditedFilter){
        case 'no-alt-for-preffered-image':
            return filteredPages.length - approvedPages.length - disapprovedPages.length;
        case 'has-unedited-pages':
        default:
            return filteredPages.length - approvedPages.length - disapprovedPages.length;
    }
}

function getNumberOfPagesVisible(localeFilter, uneditedFilter, filteredPages = [], approvedPages = [], disapprovedPages = []){
    switch(localeFilter){
        case 'approved':
            return approvedPages.length;
        case 'unedited':
            return getNumberOfPagesVisibleForUnedited(uneditedFilter, filteredPages, approvedPages, disapprovedPages);
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

function getLocale({id, ...locale}, localeFilter, uneditedFilter, editedLocales, globallyDisapprovedPageUrls){
    const { pages = [] } = locale;
    const hasPages = localeHasPages(pages, globallyDisapprovedPageUrls);

    if(hasPages) {
        const editedLocale = editedLocales[id] || {};
        const {approvedPages = [], disapprovedPages = []} = editedLocale;
        const filteredPages = getFilteredPages(pages, globallyDisapprovedPageUrls);
        const hasApprovedPageUrl = localeHasApprovedPageUrl(filteredPages, approvedPages);
        const hasUneditedPageUrl = localeHasUneditedPageUrl(filteredPages, approvedPages, disapprovedPages);
        const hasMissingAltForPreferredImage = localeHashMissingAltForPreferredImage(filteredPages, approvedPages);
        const numberOfPagesVisible = getNumberOfPagesVisible(localeFilter, uneditedFilter, filteredPages, approvedPages, disapprovedPages);

        return {
            locale, editedLocale, numberOfPagesVisible, hasApprovedPageUrl, hasUneditedPageUrl, hasMissingAltForPreferredImage
        }
    }

    return {}

}

function getPosition(editedLocale, locale, addedPositions){
    if(locale.name == 'munsala'){
        console.log('musnal pos', editedLocale)
    }

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

    if(locale.name == 'munsala'){
        console.log('musnal pos', position)
    }

    return position;
}

function addMarkers(locales = [], localeFilter, uneditedFilter, editedLocales, globallyDisapprovedPageUrls){
    let addedPositions = [];
    return locales.map(({id, ...locale}) => {

        const {
            editedLocale,
            numberOfPagesVisible = 0,
            hasUneditedPageUrl,
            hasApprovedPageUrl,
            hasMissingAltForPreferredImage
        } = getLocale({id, ...locale}, localeFilter, uneditedFilter, editedLocales, globallyDisapprovedPageUrls);

        if(locale.name == 'munsala'){
            console.log('musnal 3', editedLocale)
        }

        const position = getPosition(editedLocale, locale, addedPositions);
        if(locale && position){
            return <MarkerWithLabel
                key={id}
                labelAnchor={{x: 0, y: -5}}
                position={position}
                onClick={() => {
                    Router.push({
                        pathname: '/locale',
                        query: {id},
                    });
                }}
                icon={getMarkerImage(hasUneditedPageUrl, hasApprovedPageUrl)}
            >
                <div style={{
                    backgroundColor: 'yellow',
                    padding: 2
                }}>{locale.name} | {numberOfPagesVisible.toString()}</div>
            </MarkerWithLabel>
        }

        return null;
    })

}

const Map = ({locales, localeFilter, uneditedFilter, editedLocales, globallyDisapprovedPageUrls}) =>
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
        {addMarkers(locales, localeFilter, uneditedFilter, editedLocales, globallyDisapprovedPageUrls)}
    </GoogleMap>;




export default withScriptjs(withGoogleMap(Map));