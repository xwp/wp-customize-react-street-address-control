/* global wp, console */
import React from 'react';
import ReactDOM from 'react-dom';
import StreetAddressForm from './StreetAddressForm';

const addressValue = new wp.customize.Value( {
	street: "123 Main St",
	city: "Portland",
	state: "OR",
	zip: "97205"
} );

const renderComponent = () => {
	const address = addressValue.get();
	const form = <StreetAddressForm
		label="Address"
		street={ address.street }
		city={ address.city }
		state={ address.state }
		zip={ address.zip }
		onChange={ ( props ) => {
			addressValue.set( { ...addressValue.get(), ...props } );
		} }
	/>;
	ReactDOM.render(
		form,
		document.getElementById('root')
	);
};

renderComponent();
addressValue.bind( renderComponent );

window.addressValue = addressValue;
