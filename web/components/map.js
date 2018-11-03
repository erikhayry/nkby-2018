import React from "react"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel"
import theme from '../static/themes/dark.json';
import Overlay from './overlay.js';

const   MapWrapper = withScriptjs(withGoogleMap((props) => {
    const userMarkerImage = {
        url: '/static/images/markers/white.png',
        size: new google.maps.Size(22, 40),
        labelOrigin: new google.maps.Point(11, 12)
    };

    const renderPage = (page, i) =>{
        return (
            <li key={i} style={{
                listStyle: 'none',
                width: '100%',
                marginBottom: '20px'
            }}>
                <a href={page.url} target="_blank" style={{
                    textDecoration: 'none',
                    display: 'block',
                    minHeight: 100,
                    width: '100%'
                }}>
                    {page.image && <img
                        src={`http://www.nykarlebyvyer.nu/${page.image.replace('../../../', '')}`}
                        alt=""
                        width="100%"
                        style={{
                            maxWidth: '100%',
                            display: 'block',
                            width: 'auto',
                            margin: '0 auto'
                        }}
                    />}
                    <div style={{
                        display: 'inline-block',
                        marginBottom: 10,
                        color: '#fff',
                        backgroundColor: '#222',
                        padding: 5,
                        textDecoration: 'none',
                        fontSize: 16,
                        maxHeight: 'calc(100% - 30px)',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        border: '5px solid #222',
                        width: '100%'
                    }}>{page.title || page.url}</div>
                </a>

            </li>
        )
    }

    const { currentLocale, isSmallDevice, onToggleOpen } = props;

    return (
        <React.Fragment>
            <GoogleMap
                defaultZoom={12}
                defaultCenter={{ lat: 63.5217687, lng: 22.5216011 }}
                ref={props.onMapMounted}
                options={{
                    fullscreenControl: !isSmallDevice,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    scaleControl: false,
                    scrollwheel: false,
                    locationControl: true,
                    styles: theme,
                }}
            >
                {props.markers}
                {props.userPosition && <Marker
                    key={'user'}
                    position={props.userPosition}
                    icon={userMarkerImage}
                />}
                {!isSmallDevice && currentLocale && <InfoWindow position={currentLocale.position} onCloseClick={onToggleOpen}>
                    <div style={{
                        width: 500,
                        height: 500,
                        borderRadius: 0,
                        padding: 5
                    }}>
                        <h1 style={{
                            textTransform: 'capitalize',
                            margin: '5px 0 20px',
                            letterSpacing: 2,
                            color: '#ceb216',
                            textAlign: 'left'
                        }}>{currentLocale.name}</h1>
                        <ul style={{
                            padding: 0,
                            margin: 0,
                            overflow: 'hidden'
                        }}>
                            {currentLocale.pages.map((page, index) => renderPage(page, index))}
                        </ul>
                    </div>
                </InfoWindow>}
                {isSmallDevice && currentLocale && <Overlay
                    currentLocale={currentLocale}
                    setCurrentLocale={onToggleOpen}
                />}
            </GoogleMap>
            <button onClick={props.setLocation} style={{
                backgroundColor: 'transparent',
                position: 'absolute',
                top: 5,
                left: 5,
                padding: 4,
                color: '#fff',
                border: '2px solid #fff',
                textTransform: 'uppercase',
                fontSize: '14',
                zIndex: 1
            }}>Hitta mig</button>
        </React.Fragment>
    )
}));

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.onMapMounted = this.onMapMounted.bind(this);
        this.setLocation = this.setLocation.bind(this);
    }

    state = {
        currentLocale: undefined,
        userPosition: undefined
    };

    getMarkers(locales, activeMarker){
        if(locales) {
            return Object.keys(locales).map((key) => {
                const locale = locales[key];
                const { name, position } = locale;
                return position ? <MarkerWithLabel
                        key={key}
                        position={position}
                        labelAnchor={{x: 0, y: 0}}
                        labelStyle={{
                            backgroundColor: "yellow",
                            fontSize: "14px",
                            padding: "16px",
                            visibility: key === activeMarker ? 'visible' : 'hidden'
                        }}
                        zIndex={key === activeMarker ? 1 : 0}
                        onClick={() => {
                            this.onToggleOpen(locale)
                        }}
                        onMouseOver={() => {
                            this.onSetActiveMarker(key)
                        }}
                    >
                        <div>{name}</div>
                    </MarkerWithLabel> : null
            })
        }

        return null;
    }

    onToggleOpen(currentLocale) {
        this.setState({currentLocale})
    }

    onSetActiveMarker(activeMarker) {
        this.setState({activeMarker})
    }

    onMapMounted(map){
        this.ref = map;
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
        const {userPosition, currentLocale, activeMarker} = this.state;
        const {isSmallDevice, locales} = this.props;
        const markers = this.getMarkers(locales, activeMarker);
        return <MapWrapper
                    markers={markers}
                    currentLocale={currentLocale}
                    isSmallDevice={isSmallDevice}
                    onMapMounted={this.onMapMounted}
                    onToggleOpen={this.onToggleOpen}
                    setLocation={this.setLocation}
                    userPosition={userPosition}
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ&v=3.exp&libraries=geometry,drawing,places"}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100vh`, width: '100%' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
    }
}

export default Map;