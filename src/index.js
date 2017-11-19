/* global wp */

import StreetAddressControl from './StreetAddressControl';

// Register control type with Customizer.
wp.customize.controlConstructor.street_address = StreetAddressControl;
