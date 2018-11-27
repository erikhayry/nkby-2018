import React from "react"
import Map from './map';
import ErrorBoundary from './error-boundary'
import MapList from './map-list';
import ReactGA from 'react-ga';

class MapWrapper extends React.Component {
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
        const {isSmallDevice, locales, currentLocale} = this.props;
        return (
            <ErrorBoundary>
                <Map
                    locales={locales}
                    activeMarker={activeMarker}
                    currentLocale={currentLocale}
                    isSmallDevice={isSmallDevice}
                    onMapMounted={this.onMapMounted}
                    onToggleOpen={this.onToggleOpen}
                    setLocation={this.setLocation}
                    setActiveMarker={this.setActiveMarker}
                    userPosition={userPosition}
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API}&v=3.exp&librarie=geometry,drawing,places`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100vh`, width: '100%' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </ErrorBoundary>
        )
    }
}

export default MapWrapper;