import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'
import theme from '../static/theme.json';
import axios from 'axios';

function addMarkers({addresses, onMarkerClick}){
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

                if(positionAdded){
                    position.lat = position.lat - 0.0001;
                    position.lng = position.lng + 0.0001;
                    addedPositions.push(JSON.stringify(position));
                }
                else{
                    addedPositions.push(positionAsString);
                }

                return <Marker
                    key={key} position={position}
                    onClick={() => {
                        onMarkerClick(key, address)
                    }}
                    label={address.pages.length.toString()}
                />
            }

            return null;
        })
    }

    return null;
}

const GooglMapWrapper = compose(
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
        {addMarkers((props))}
    </GoogleMap>
);

class Map extends React.PureComponent {
    state = {
        addresses: undefined,
        currentAddress: undefined,
        count: null
    };

    componentDidMount() {
        let that = this;
        fetch('http://localhost:3001/get')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                console.log(responseAsJson)
                that.setState(responseAsJson)
            });
        fetch('/static/crawler-result-with-locale.json')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({ addresses: responseAsJson })
            });
    }

    handleMarkerClick = (key, address) => {
        this.setState({ currentAddress: {key, address}})
    };

    handleClick = () => {
        let that = this;
        let count = this.state.count + 1;
        fetch('http://localhost:3001/add', {
            method: 'post',
            body: JSON.stringify({
                count: count
            })
        })
        .then(function(response) {
            console.log(response)
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState(responseAsJson)
        });
    };

    render() {
        return (
            <div>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta charSet="utf-8" />
                </Head>
                <style jsx global>{`
                  body {
                    font: 11px menlo;
                    color: #222;
                    margin: 0;
                  }
                `}</style>
                <button onClick={this.handleClick}>add  | {this.state.count}</button>
                <GooglMapWrapper
                    onMarkerClick={this.handleMarkerClick}
                    addresses={this.state.addresses}
                />
                {this.state.currentAddress && <div style={{
                    position: 'absolute',
                    top: '0',
                    backgroundColor: '#ffffffbd',
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    padding: '10px',
                    boxSizing: 'border-box'

                }}>
                    <h1 style={{
                        textAlign: 'center',
                        textTransform: 'capitalize'
                    }}>{this.state.currentAddress.key}</h1>
                    <ul style={{
                        padding: 0,
                        margin: 0
                    }}>
                        {this.state.currentAddress.address.pages.map((page, i) => {
                            return (
                                <li key={i} style={{
                                    listStyle: 'none',
                                    width: '50%',
                                    float: 'left',
                                    marginBottom: '10px'
                                }}>
                                    {page.images.length > 0 && <img src={`http://www.nykarlebyvyer.nu/${page.images[0].replace('../../../', '')}`} alt="" width="100px"/>}
                                    <br/>
                                    <a href={page.url} target="_blank">{page.title || page.url}</a>
                                </li>
                            )
                        })}
                    </ul>
                    <button onClick={() => {
                        this.setState({
                            currentAddress: undefined
                        })
                    }} style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px'
                    }}>Stäng</button>
                </div>}
            </div>
        )
    }
}

export default () => <Map />;