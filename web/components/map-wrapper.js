import React from "react"
import Map from './map';
import ErrorBoundary from './error-boundary'
import MapList from './map-list';

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
        navigator.geolocation.getCurrentPosition((position) => {
            this.ref.panTo({lat: position.coords.latitude, lng: position.coords.longitude})
            this.setState({
                userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}
            })
        });
    }

    render(){
        const {userPosition, activeMarker} = this.state;
        const {isSmallDevice, locales, currentLocale, isClient} = this.props;

        return (
            <div>
                {!false && <MapList locales={locales} />}
                {false && <ErrorBoundary alternate={<MapList locales={locales} />}>
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
                        googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ&v=3.exp&libraries=geometry,drawing,places"}
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `100vh`, width: '100%' }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </ErrorBoundary>}
            </div>
        )
    }
}

export default MapWrapper;