/* globals _, console, React */

const StreetAddressForm = ( props ) => {
	const idPrefix = _.uniqueId();

	const handleFieldChange = ( event ) => {
		props.onChange( { [
			event.target.dataset.field]: event.target.value
		} );
	};

	return (
		<fieldset>
			<legend className="customize-control-title">{ props.label }</legend>
			<div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>
			<p>
				<label htmlFor={ idPrefix + 'street' }>
					Street:
				</label>
				<input type="text" data-field="street" id={ idPrefix + 'street' } value={ props.street } onChange={ handleFieldChange } />
			</p>
			<p>
				<label htmlFor={ idPrefix + 'city' } >
					City:
				</label>
				<input type="text" data-field="city" id={ idPrefix + 'city' } value={ props.city } onChange={ handleFieldChange } />
			</p>
			<p>
				<label htmlFor={ idPrefix + 'state' } >
					State:
				</label>
				<input type="text" data-field="state" id={ idPrefix + 'state' }  value={ props.state } onChange={ handleFieldChange } pattern="^[A-Z][A-Z]$" maxlength="2" />
			</p>
			<p>
				<label htmlFor={ idPrefix + 'zip' } >
					ZIP:
				</label>
				<input type="text" data-field="zip" id={ idPrefix + 'zip' }  value={ props.zip } pattern="\d\d\d\d\d" onChange={ handleFieldChange } />
			</p>
		</fieldset>
	);
};

export default StreetAddressForm;
