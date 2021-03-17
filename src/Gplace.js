/* global google */
import React, { Component } from 'react'
import { connect } from "react-redux";
import * as UserActions from './actions/user'
import TextField from '@material-ui/core/TextField';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import { compose, withProps, lifecycle } from "recompose";
import Script from 'react-load-script';


const GOOGLE_MAP_API_KEY = 'AIzaSyDWABjiUb5VF5IT9X3Z8Q6pRQgHvsiORLM';

const MyMapComponent = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`,
        loadingElement: <div style={{ height: `100%`, width: `100%` }} />,
        containerElement: <div style={{ height: `100%`, width: `100%` }} />,
        mapElement: <div style={{ height: `100%`, width: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentDidMount() {
            this.renderRoute();
        },
        renderRoute() {
        }
    })
)(props =>
    <GoogleMap zoom={15} center={props.center} onDragEnd={props.onMapDrag} />
);

class Place extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tempArray: [], 
            center: {
                lat: 3.22,
                lng: 101.89
            },
            query: ''
        }
    }

    handleScriptLoad = () => {
        // Declare Options For Autocomplete
        const options = {
            types: ['(cities)'],
        };

        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
            options,
        );

        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components and formatted
        // address.
        this.autocomplete.setFields(['address_components', 'formatted_address']);

        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handleInput);
    }

    handleInput = () => {
        // Extract City From Address Object
        const addressObject = this.autocomplete.getPlace();
        const address = addressObject.address_components;

        // Check if address is valid
        if (address) {
            // Set State
            this.setState({
                query: addressObject.formatted_address
            }, () => {
                //push in term of array
                this.state.tempArray.push(addressObject.formatted_address)
                //update to the store for the list of search
                this.props.updateSearch(this.state.tempArray)
            
            })
        }
    }

    // for testing insert store
    handleInputChange(target) {
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        }, () => {
            if (value && value.length > 4) {
                this.state.tempArray.push(value)
                this.props.updateSearch(this.state.tempArray)
            }
        })
    }

    render() {
        const { center,query } = this.state
        return (
            <div className="placePage">
                <Script
                    url={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`}
                    onLoad={this.handleScriptLoad}
                />
                <div className="textCont">
                    <TextField
                        id="autocomplete"
                        label="Place"
                        autoComplete="place"
                        value={query}
                    />
                    <TextField
                        id="test"
                        label="Test"
                        onChange={(e) => this.handleInputChange(e.target)}
                    />
                </div>
                <div className="mapCont">
                    <MyMapComponent
                        onMapDrag={this.handleMapDrag}
                        center={center}
                    />
                </div>
            </div>
        )
    }
}
const mapStateToProps = ({ }) => ({

});

const mapDispatchToProps = (dispatch) => ({
    updateSearch: (data) => dispatch(UserActions.updateSearchPlace(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Place);
