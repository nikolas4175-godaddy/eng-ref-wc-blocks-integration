---
title: Payment Integration
description: A summary of our approach to WC Cart/Checkout block integration.
---

Woo has implemented their own abstract class and several registration/integration methods specifically to help streamline payment method integration with their Cart and Checkout blocks.  

## Declaring plugin block compatibility

Gateway plugins still need to declare block compatibility at the plugin level (same as other block integrations). The FW helper methods for this in `Blocks_Handler.php` ([code](https://github.com/godaddy-wordpress/wc-plugin-framework/blob/release/cart-checkout-blocks-support/woocommerce/Blocks/Blocks_Handler.php)) will read from the plugin's `'supported-features'` array to check for compatibility. This is best declared in the plugin's constructor function, e.g.:

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
Payment Methods in WooCommerce declare their own set of supported gateway-specific features under the `'supports'` key. Our plugin framework's supported WooCommerce features are declared under `'supported_features'`.
:::