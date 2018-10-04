import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const GooglMapWrapper = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBoFBVnwa-VAWKXuZ5m32Jh6fL4lvPYVxQ&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap
)((props) =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 63.5217687, lng: 22.5216011 }}
    >
        {props.addresses && Object.keys(props.addresses).map((key) => {
            const address = props.addresses[key];

            if(address.location){
                return <Marker key={key} position={address.location} onClick={() => {
                    props.onMarkerClick(key, address)
                }} />;
            }

            return null;
        })}
    </GoogleMap>
);

class Map extends React.PureComponent {
    state = {
        addresses: undefined,
        currentAddress: undefined
    };

    componentDidMount() {
        let that = this;

        fetch('/static/result.json')
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

    render() {
        return (
            <div>
                <GooglMapWrapper
                    onMarkerClick={this.handleMarkerClick}
                    addresses={this.state.addresses}
                />
                {this.state.currentAddress && <div>
                    <h1>{this.state.currentAddress.key}</h1>
                    <ul>
                        {this.state.currentAddress.address.uris.map((uri, i) => {
                            return (
                                <li key={i}>
                                    {uri.images.length > 0 && <img src={`http://www.nykarlebyvyer.nu/${uri.images[0].replace('../../../', '')}`} alt="" width="100px"/>}
                                    <br/>
                                    <a href={uri.uri}>{uri.title || uri.uri}</a>
                                    {uri.addressWithStreetNumber && <p>({uri.addressWithStreetNumber})</p>}
                                </li>
                            )
                        })}
                    </ul>
                </div>}
            </div>
        )
    }
}

export default () => <Map />;