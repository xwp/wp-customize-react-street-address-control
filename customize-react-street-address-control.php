<?php
/**
 * Plugin Name: Customize React Street Address Control
 * Description: Demonstration of a Customizer control that uses React for its interface.
 * Version: 0.1.0
 * Author: Weston Ruter, XWP
 * Author URI: https://weston.ruter.net/
 * License: GPLv2+
 *
 * @package Customize_React_Street_Address_Control
 */

namespace Customize_React_Street_Address_Control;

add_action( 'customize_controls_enqueue_scripts', function() {

	$build_js = glob( __DIR__ . '/build/static/js/*.js' );
	if ( 0 === count( $build_js ) ) {
		wp_die( 'You must run <code>yarn build</code> in the <code>wp-content/plugins/customize-react-street-address-control</code> directory because there is no built JS located in its <code>build/static/js</code> directory.' );
	}

	$handle = 'customize-react-street-address-control';
	$src = plugin_dir_url( __FILE__ ) . 'build/static/js/' . basename( array_shift( $build_js ) );
	$deps = array( 'customize-controls' );
	wp_enqueue_script( $handle, $src, $deps );
} );

add_action( 'wp_print_styles', function() {
	?>
	<style>
		#business-address {
			position: fixed;
			bottom: 0;
			right: 0;
			padding: 0.5em;
			background: rgba( 255, 255, 255, 0.5 );
			color: black;
		}
	</style>
	<?php
} );

/**
 * Render business address template part.
 */
$render_business_address = function() {
	$address = get_option( 'business_address' );

	// Short-circuit, but still render container when in Customzier preview for selective refresh.
	if ( empty( $address ) ) {
		if ( is_customize_preview() ) {
			echo '<div id="busness-address" hidden></div>';
		}
		return;
	}

	?>
	<div id="business-address" itemscope itemtype="http://schema.org/LocalBusiness">
		<span itemprop="name"><?php bloginfo( 'name' ); ?></span>,
		<span itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
			<span itemprop="streetAddress"><?php echo esc_html( $address['street'] ); ?></span>
			<span itemprop="addressLocality"><?php echo esc_html( $address['city'] ); ?></span>,
			<span itemprop="addressRegion"><?php echo esc_html( $address['state'] ); ?></span>
			<span itemprop="postalCode"><?php echo esc_html( $address['zip'] ); ?></span>
		</span>
	</div>
	<?php
};

add_action( 'wp_footer', $render_business_address, 100 );

// Add setting, control, and partial.
add_action( 'customize_register', function( \WP_Customize_Manager $wp_customize ) use ( $render_business_address ) {

	$setting = $wp_customize->add_setting( 'business_address', array(
		'transport' => 'postMessage',
		'default' => array(
			'street' => '123 Main St',
			'city' => 'Portland',
			'state' => 'OR',
			'zip' => '97205',
		),
		'type' => 'option',
		'sanitize_callback' => function( $value ) {
			if ( ! is_array( $value ) ) {
				return new \WP_Error( 'invalid_value', __( 'Expected array.', 'customize-react-street-address-control' ) );
			}
			if ( 4 !== count( array_intersect( array_keys( $value ), array( 'street', 'city', 'state', 'zip' ) ) ) ) {
				return new \WP_Error( 'invalid_keys', __( 'Missing address parts.', 'customize-react-street-address-control' ) );
			}
			foreach ( $value as $key => $prop ) {
				if ( ! is_string( $prop ) ) {
					return new \WP_Error( 'invalid_value_type', __( 'Expected string.', 'customize-react-street-address-control' ) );
				}
			}
			if ( 2 !== strlen( $value['state'] ) ) {
				return new \WP_Error( 'invalid_state_length', __( 'Expected 2-letter state code.', 'customize-react-street-address-control' ) );
			}
			$value['state'] = strtoupper( $value['state'] );
			if ( ! preg_match( '/^\d\d\d\d\d(-\d\d\d\d)?$/', $value['zip'] ) ) {
				return new \WP_Error( 'invalid_zip_format', __( 'Expected American Zip code.', 'customize-react-street-address-control' ) );
			}
			$value['street'] = sanitize_text_field( $value['street'] );
			$value['city'] = sanitize_text_field( $value['city'] );
			return $value;
		},
	) );

	$wp_customize->add_control( 'business_address', array(
		'type' => 'street_address',
		'section' => 'title_tagline',
		'label' => 'Business address',
		'settings' => array( $setting->id ),
	) );

	$wp_customize->selective_refresh->add_partial( 'business_address', array(
		'selector' => '#business-address',
		'container_inclusive' => true,
		'render_callback' => $render_business_address,
		'settings' => array( 'blogname', $setting->id ),
	) );
} );
