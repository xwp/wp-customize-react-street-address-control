/* global wp, console */
import React from 'react';
import ReactDOM from 'react-dom';
import StreetAddressForm from './StreetAddressForm';

const Control = wp.customize.Control.extend({

	/**
	 * Render the control into the DOM.
	 *
	 * @returns {void}
	 */
	renderContent: function() {
		const control = this;
		const value = control.setting.get();

		const onChange = ( props ) => {
			control.setting.set( {
				...control.setting.get(),
				...props
			} );
		};

		const form = <StreetAddressForm
			label={ control.params.label }
			street={ value.street }
			city={ value.city }
			state={ value.state }
			zip={ value.zip }
			onChange={ onChange }
		/>;
		ReactDOM.render(
			form,
			control.container[0]
		);
	},

	/**
	 * After control has been first rendered, start re-rendering when setting changes.
	 *
	 * React is able to be used here instead of the wp.customize.Element abstraction.
	 *
	 * @returns {void}
	 */
	ready: function() {
		const control = this;

		// Re-render control when setting changes.
		control.setting.bind( () => {
			control.renderContent();
		} );
	}

});

// Register control type with Customizer.
wp.customize.controlConstructor.street_address = Control;
