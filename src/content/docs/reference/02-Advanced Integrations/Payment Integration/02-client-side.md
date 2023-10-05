---
title: Payment Method Integration - Client Side
description: The frontend/JS portion of our payment method integrations
---

## FE File Structure
```
wp-plugin-frontend monorepo
   ├── apps                                    // monorepo directory housing each plugin integration
   |   └── woocommerce-plugin-slug
   |      ├── src
   │      |   ├── components
   |      |   |   ├── block-checkout
   |      |   |   |   └── block-checkout.tsx  // FE component that handles most of the checkout block integration logic
   |      |   |   └── ui                      // one-off components specific to this plugin
   |      |   |       └── input.tsx
   │      |   ├── styles
   |      |   |   └── block-checkout.css
   │      |   └── types
   │      |      └── types.ts
   │      └── app.tsx                         // FE module responsible for registering the FE payment method
   ├── packages                               // monorepo directory for resources shared across plugins
   │   ├── types-woocommerce                  // WC component typedefs and guards that we've exposed for our own typesafety
   │   ├── ui                                 // shared components mostly based on WP & WC block components
   |   |                                         // plus some from our own Kodiak library
   └───└── woocommerce                        // a couple other WC types and utils
```
:::note
The monorepo structure will be used in dev and will house our shared FE code going forward, but FE integrations will ultimately be packaged and built with their respective plugin code. That structure is TBD.
:::


[ TODO: refactor below sections to match our existing setup (`app.tsx` + `block-checkout.tsx`) ]

## FE Block Payment Method Script

This is the base JS module for your gateway block integration that you registered in the `initialize()` method of your `Gateway_Checkout_Block_Integration` concrete class. Woo handles enqueuing these scripts in their `\Blocks\Payments\API` class ([code](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/src/Payments/Api.php)). 

The core of this module is a JS object that defines a set of options specific to your payment method which is passed to Woo’s FE Block Registry via their `registerPaymentMethod()` function, which we have wrapped in our `@gdcorp-partners/woocommerce` package.

```js
import { registerPaymentMethod } from '@gdcorp-partners/woocommerce'
import { getSetting } from '@gdcorp-partners/woocommerce'

/**
 * Retrieve the gateway settings that we exposed with our backend Checkout Block Integration's `get_payment_method_data()` method.
 */
const blockCheckoutSettings = getSetting<PluginSettings>(
	'my_payment_method_data',
	{
		title: '',
		description: '',
		supports: [],
		flags: [],
	},
)

const ExampleCreditCardGateway = {
	name: 'my_payment_method',
	content: <Content />,
	edit: <Description />,
	canMakePayment: () => true,
	label: blockCheckoutSettings.title,
	ariaLabel: blockCheckoutSettings.title,
	placeOrderButtonLabel: __( 'Continue', 'woocommerce-plugin-domain' ),
	supports: {
		features: blockCheckoutSettings.supports,
	},
};

registerPaymentMethod(ExampleCreditCardGateway);
```

:::note
The `name` property used to register with the frontend **must match** the name set in the backend `PaymentMethodRegistry`. For our FW payment methods, this will default to the payment gateway ID, e.g. `'authorize_net_cim_credit_card'`. Similarly, the data handle for retrieving the Checkout Block Integration data uses this same name with `_data` appended to the end.
:::

## Payment Method Components

In the Block Registry options, Woo allows us to define two base nodes, `content` and `edit` , that will be cloned and rendered in the frontend and admin editor respectively. Those nodes will contain all of the UI and logic needed for customers to enter and submit payment details (in `content`) and for merchants to preview the checkout experience in the admin editor (in `edit`).

```js
// app.tsx
import { registerPaymentMethod } from '@gdcorp-partners/woocommerce'
import {
	BlockCheckout,
	BlockCheckoutDescription,
	blockCheckoutSettings,
} from './components/block-checkout/block-checkout'

registerPaymentMethod({
	name: 'my_payment_method',
	label: label,
	content: <BlockCheckout />,
	edit: <BlockCheckoutDescription />,
	// [...]
});
```


[ More here on implementation paths, creating component exports, other rPM options, etc. ]
