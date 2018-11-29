import React from "react"
import ReactGA from 'react-ga';
import MapRenderer from './map-renderer';
import ErrorBoundary from '../error-boundary'

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.onMapMounted = this.onMapMounted.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.setActiveMarker = this.setActiveMarker.bind(this);
    }

    state = {
        userPosition: undefined
    };

    onMapMounted(map){
        this.ref = map;
    }

    setActiveMarker(id){
        this.setState({activeMarker: id})
    }

    setLocation(){
        ReactGA.event({
            category: 'User',
            action: 'Clicked on find me'
        });
        navigator.geolocation.getCurrentPosition((position) => {
            if(this.ref){
                this.ref.panTo({lat: position.coords.latitude, lng: position.coords.longitude})
            }
            this.setState({
                userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}
            })
        });
    }

    render(){
        const {userPosition, activeMarker} = this.state;
        const {locales, currentLocale, visitedLocales, style = {}, options, showFindMeButton, enableUserInteractions} = this.props;

        return (
            <ErrorBoundary>
                <MapRenderer
                    locales={locales}
                    visitedLocales={visitedLocales}
                    activeMarker={activeMarker}
                    currentLocale={currentLocale}
                    onMapMounted={this.onMapMounted}
                    onToggleOpen={this.onToggleOpen}
                    setLocation={this.setLocation}
                    setActiveMarker={this.setActiveMarker}
                    userPosition={userPosition}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API}&v=3.exp&librarie=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100vh`, width: '100%', ...style }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    options={options}
                    showFindMeButton={showFindMeButton}
                    enableUserInteractions={enableUserInteractions}
                />
            </ErrorBoundary>
        )
    }
}

export default Map;