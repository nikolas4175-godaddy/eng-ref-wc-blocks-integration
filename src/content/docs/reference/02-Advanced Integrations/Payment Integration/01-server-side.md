---
title: Payment Method Integration - Server Side
description: The backend/PHP portion of our payment method integrations
---

## Back-End `PaymentMethodRegistry`

Woo handles block-compatible payment methods in their `PaymentMethodRegistry` ([code](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/src/Payments/PaymentMethodRegistry.php)), so individual gateways (your plugin might have more than one) will need to add themselves to this registry. We have FW helper methods for this level of integration in `Gateway_Blocks_Handler.php` ([code](https://github.com/godaddy-wordpress/wc-plugin-framework/blob/release/cart-checkout-blocks-support/woocommerce/payment-gateway/Blocks/Gateway_Blocks_Handler.php)). Our registration method will call `get_checkout_block_integration_instance()` on the integrating gateway class, which should return your `Gateway_Checkout_Block_Integration` instance (more on this in the next step).

```php
	/**
	 * Gets the checkout block integration instance.
	 *
	 * @return Credit_Card_Checkout_Block_Integration
	 */
	public function get_checkout_block_integration_instance(): ?Framework\Payment_Gateway\Blocks\Gateway_Checkout_Block_Integration {

		if ( null === $this->credit_card_checkout_block ) {

			require_once( $this->get_plugin()->get_plugin_path() . '/src/Blocks/Credit_Card_Checkout_Block_Integration.php' );

			$this->credit_card_checkout_block = new Credit_Card_Checkout_Block_Integration( $this->get_plugin(), $this );
		}

		return $this->credit_card_checkout_block;
	}
```


## Gateway Integration Class

Each integrating gateway should extend the `Gateway_Checkout_Block_Integration` class to provide Woo with the integration details for rendering your FE. This includes the base gateway block checkout scripts and styles to load in an `initialize()`method, as well as the data that should be exposed to those scripts via `get_script_data()`. 

```php
use SkyVerge\WooCommerce\PluginFramework\v5_11_8\Payment_Gateway\Blocks\Gateway_Checkout_Block_Integration;

/**
 * Checkout block integration class.
 */
class Credit_Card_Checkout_Block_Integration extends Gateway_Checkout_Block_Integration
{

	/**
	 * Initializes the block integration.
	 *
	 * @internal
	 *
	 * @return void
	 */
	public function initialize() : void {

		// register the base checkout block JS for this gateway
		wp_register_script(
			$this->get_main_script_handle(),
			wc_plugin()->get_plugin_url() . '/assets/js/blocks/block-checkout.js',
			[
				'wc-blocks-registry',
				'wc-settings',
				'wp-element',
				'wp-html-entities',
				'wp-i18n',
			],
			null, // replace with PLUGIN::VERSION later
			[
				// 'strategy' => 'defer' or 'async' (optional)
				'in_footer' => true,
			]
		);

		// register the above script for i18n
		wp_set_script_translations( $this->get_main_script_handle(), 'woocommerce-gateway-plugin-domain' );

		// enqueue styles for the payment method UI
		wp_enqueue_block_style('checkout', [
			'handle' => $this->get_main_script_handle(),
			'src'    => wc_plugin()->get_plugin_url() . '/assets/css/blocks/block-checkout.css',
		]);
	}

	/**
	 * Gets the payment method data for client exposure.
	 *
	 * @return array<string, string>
	 */
	public function get_script_data() : array {

		return [
			'title'       => $this->gateway->method_title,
			'description' => $this->gateway->method_description,
			'supports'    => $this->gateway->supports,
			'my_payment_data' => [
				'value' => EXAMPLE_DATA1,
				'value' => EXAMPLE_DATA2,
				['value' => ARRAY_DATA_VALUE, 'label' => __( 'ArrayDataLabel', 'woocommerce-plugin-domain' ) ],
			]
		];
	}
}
```