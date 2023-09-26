---
title: Payment Method Integration
description: A guided summary of our approach to WC Cart/Checkout block integration.
---

Woo has implemented their own abstract class and several registration/integration methods specifically to help streamline payment method integration with their blocks.  

### Declaring plugin block compat

Gateway plugins still need to declare block compatibility at the plugin level (same as other block integrations). The FW helper methods for this in `Blocks_Handler.php` [(code)](https://github.com/godaddy-wordpress/wc-plugin-framework/blob/release/cart-checkout-blocks-support/woocommerce/Blocks/Blocks_Handler.php) read from the plugin's `'supported-features'` array to check for compatibility. This is best declared in the plugin's constructor function, e.g.:

```php
	public function __construct() {

		parent::__construct(
			self::PLUGIN_ID,
			self::VERSION,
			[
				'text_domain'        => 'woocommerce-gateway-plugin-domain',
				'gateways'           => $this->get_enabled_gateways(),
				'require_ssl'        => true,
				'supports'           => [
					self::FEATURE_CAPTURE_CHARGE,
					self::FEATURE_MY_PAYMENT_METHODS,
					self::FEATURE_CUSTOMER_ID,
				],
				'supported_features' => [
					'hpos'   => true,
					'blocks' => [
						'checkout' => true,
					]
				],
			]
		);
```

:::note
WooCommerce Payment Methods declare their own set of supported gateway features under the `'supports'` key. Our plugin framework's supported WooCommerce features are declared under `'supported_features'`.
:::

### BE PaymentMethodRegistry

Next you’ll need to add your payment method to Woo’s `PaymentMethodRegistry` to […what does this do specifically?]. We have FW methods for this level of integration in `Gateway_Blocks_Handler.php` [(code)](https://github.com/godaddy-wordpress/wc-plugin-framework/blob/release/cart-checkout-blocks-support/woocommerce/payment-gateway/Blocks/Gateway_Blocks_Handler.php). This registration method calls `get_checkout_block_integration_instance()` on the integrating gateway class, which should return your `Gateway_Checkout_Block_Integration` instance (described in the next step).

`add_action( ‘woocodmmerce_blocks_payment_method_type_registration’ […])`

[ Code example of `get_checkout_block_integration_instance()`implementation ]

### Gateway Integration Class

Each integrating gateway should extend the `Gateway_Checkout_Block_Integration` class to provide Woo with the integration details for rendering your FE. This includes the base gateway block checkout scripts and styles to load in an `initialize()`method, as well as the data that should be exposed to those scripts via `get_script_data()`. 

### FE Block Payment Method Script

The base JS module for your gateway block integration. The core of this module is a JS object that defines a set of options specific to your payment method which is passed to Woo’s FE Block Registry via their `registerPaymentMethod()` function.

```js
import { registerPaymentMethod } from '@woocommerce/blocks-registry';

const AuthorizeNetCIMCreditCardGateway = {
	name: 'my_payment_method',
	content: <Content />,
	edit: <Description />,
	canMakePayment: () => true,
	label: settings.title,
	ariaLabel: settings.title,
	placeOrderButtonLabel: __( 'Continue', 'woocommerce-gateway-authorize-net-cim' ),
	supports: {
		features: settings.supports,
	},
};

registerPaymentMethod(AuthorizeNetCIMCreditCardGateway);
```

### Payment Method Components

In the Block Registry options, Woo allows us to define two base nodes, `content` and `edit` , that will be cloned and rendered in the frontend and admin editor respectively. Those nodes will contain all of the UI and logic needed for customers to enter and submit payment details (in `content`) and for merchants to preview the checkout experience in the admin editor (in `edit`).

[ More here on Simon & Alex’s proposed component architecture ]
