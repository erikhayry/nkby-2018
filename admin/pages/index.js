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
        locationFilter: 'all',
    };

    componentDidMount() {
        let that = this;
        fetch('http://localhost:3001/get')
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                console.log(responseAsJson)
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

    setCurrentAddress = (key, address) => {
        this.setState({ currentAddress: key && address ? {key, address} : undefined})
    };

    setFilter = (type) => {
        this.setState({
            locationFilter: type
        })
    }

    approve = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/add/approved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocations: responseAsJson})
        });
    };

    undoApprove = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/remove/approved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(responseAsJson) {
            console.log(responseAsJson)
            that.setState({editedLocations: responseAsJson})
        });
    };

    disapprove = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/add/disapproved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
                that.setState({editedLocations: responseAsJson})
            });
    };

    undoDisapprove = ({id, url}) => {
        let that = this;
        fetch('http://localhost:3001/remove/disapproved-page', {
            method: 'post',
            body: JSON.stringify({
                id, url
            })
        })
            .then(function(response) {
                return response.json()
            })
            .then(function(responseAsJson) {
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
                    <button onClick={() => {
                        this.setFilter('approved')
                    }}>{'Visa godkända'}</button>
                    <button onClick={() => {
                        this.setFilter('unedited')
                    }}>{'Visa oediterade'}</button>
                    <button onClick={() => {
                        this.setFilter('all')
                    }}>{'Visa alla'}</button>
                </div>
                <Map
                    onMarkerClick={this.setCurrentAddress}
                    addresses={this.state.addresses}
                    locationFilter={this.state.locationFilter}
                    editedLocations={this.state.editedLocations}
                />
                <Overlay
                    approve={this.approve}
                    undoApprove={this.undoApprove}
                    disapprove={this.disapprove}
                    undoDisapprove={this.undoDisapprove}
                    currentAddress={this.state.currentAddress}
                    editedLocations={this.state.editedLocations}
                    setCurrentAddress={this.setCurrentAddress}
                />
            </div>
        )
    }
}

export default () => <App />;