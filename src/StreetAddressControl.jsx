/* global wp, jQuery */
import React from 'react';
import ReactDOM from 'react-dom';
import StreetAddressForm from './StreetAddressForm';

/**
 * StreetAddressControl.
 *
 * @class
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
const StreetAddressControl = wp.customize.Control.extend({

	/**
	 * Initialize.
	 *
	 * @param {string} id - Control ID.
	 * @param {object} params - Control params.
	 */
	initialize: function( id, params ) {
		const control = this;

		// Bind for the sake of passing as prop to React component.
		control.setNotificationContainer = control.setNotificationContainer.bind( control );

		wp.customize.Control.prototype.initialize.call( control, id, params );
	},

	/**
	 * Set notification container and render.
	 *
	 * This is called when the React component is mounted.
	 *
	 * @param {Element} element - Notification container.
	 */
	setNotificationContainer: function setNotificationContainer( element ) {
		const control = this;
		control.notifications.container = jQuery( element );
		control.notifications.render();
	},

	/**
	 * Render the control into the DOM.
	 *
	 * @returns {void}
	 */
	renderContent: function renderContent() {
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
			{ ...value }
			setNotificationContainer={ control.setNotificationContainer }
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

export default StreetAddressControl;
