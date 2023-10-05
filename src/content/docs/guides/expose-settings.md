---
title: How to Expose / Access Gateway Data
description: Getting gateway settings and data from the backend to a block script
---

### Problem
You're building a payment method blocks integration and need to be able to access settings and data from your backend gateway class in your frontend blocks integration.

### Solution
Expose plugin data to the frontend via your concrete `Gateway_Checkout_Block_Integration` class, and consume it with `getSetting()`.

---

## 1) Exposing gateway data from concrete integration class
Concrete gateway classes that inherit from `Gateway_Checkout_Block_Integration` can use the `$gateway` property to expose gateway data to our frontend block checkout scripts via their `payment_method_data()` method. The parent FW class has a few settings exposed by default:
```php
/**
 * Gets the payment method data.
 *
 * @since 5.12.0
 *
 * @return array<string, mixed>
 */
public function get_payment_method_data() : array {
		return [
				'title'       => $this->gateway->method_title,
				'description' => $this->gateway->method_description,
				'supports'    => $this->gateway->supports,
				'flags' => [
						'is_credit_card_gateway' => $this->gateway->is_credit_card_gateway(),
						'is_echeck_gateway'      => $this->gateway->is_echeck_gateway(),
						'csc_enabled'            => $this->gateway->csc_enabled(),
						'csc_enabled_for_tokens' => $this->gateway->csc_enabled_for_tokens(),
						'tokenization_enabled'   => $this->gateway->tokenization_enabled(),
				]
		];
}
```

If we want to add data to that payload from our concrete gateway, we'll want to override that method like:
```php
/**
 * Gets the payment method data.
 *
 * @see SkyVerge\WooCommerce\PluginFramework\v5_11_9\Payment_Gateway\Blocks\Gateway_Checkout_Block_Integration::get_payment_method_data()
 * 
 * @since 3.10.0-dev.1
 *
 * @return array<string, mixed>
 */
public function get_payment_method_data() : array {
	$data = parent::get_payment_method_data();

	$data []= [
		'gateway' => [
			'merchant_id' => $gateway->get_merchant_id(),
			'api_key'  => $gateway->get_api_key(),
		]
	];
	
	return $data;
}
```

## 2) Consuming data in block checkout script
We can use our wrapped version of Woo's `getSetting` function to access this same data in our frontend script. Following the above example, our `getSetting()` call would look like:
```js
import { getSetting } from '@gdcorp-partners/woocommerce'
import { PluginSettings } from '@/types/types'

/**
 * Consume payment method data exposed by `get_payment_method_data()` in the backend integration class
 * 
 * @param string name: payment method data key
 * @param obj fallback: default values to return if name is not found
 * @param function filter: callback used to format the returned value (optional)
 */
export const blockCheckoutSettings = getSetting<PluginSettings>(
	'my_payment_method_data',
	{
		title: '',
		description: '',
		supports: [],
		flags: [],
	},
);
```
:::note
The `name` parameter value needs to match the name assigned to the payment method block integration on the backend with `_data` appeneded.

So, e.g., data for the intergation named `'authorize_net_cim_credit_card'` is accessed by passing `'authorize_net_cim_credit_card_data'` to `getSetting`.
:::

### Usage
We can then use that data in our frontend script, e.g.:
```js
export function BlockCheckoutDescription() {
	return decodeEntities(blockCheckoutSettings.description || '');
}
```