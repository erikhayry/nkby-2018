import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import Head from 'next/head'
import theme from '../static/theme.json';
import Overlay from '../components/overlay';
import Map from '../components/map';

class App extends React.PureComponent {
    state = {
        addresses: undefined,
        currentAddress: undefined,
        editedLocations: {},
        showApproved: false,
    };

    componentDidMount() {
        let that = this;
        fetch('http://localhost:3001/get')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({editedLocations: responseAsJson})
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

    toggleView = () => {
        this.setState({
            showApproved: !this.state.showApproved
        })
    }

    approve = ({id, url}) => {
        console.log(id, url)
        let that = this;
        fetch('http://localhost:3001/approve', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
        .then(function(response) {
            console.log(response)
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocations: responseAsJson})
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
                <div>
                    <button onClick={this.toggleView}>{this.state.showApproved ? 'Visa alla' : 'Visa godkända'}</button>
                </div>
                <Map
                    onMarkerClick={this.handleMarkerClick}
                    addresses={this.state.addresses}
                    showApproved={this.state.showApproved}
                    approvedLocations={this.state.editedLocations}
                />
                <Overlay
                    currentAddress={this.state.currentAddress}
                    closeOverlay={() => {
                        this.setState({
                            currentAddress: undefined
                        })
                    }}
                />
            </div>
        )
    }
}

export default () => <App />;