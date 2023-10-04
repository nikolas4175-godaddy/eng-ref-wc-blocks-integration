---
title: Payment Method Integration - Client Side
description: The frontend/JS portion of our payment method integrations
---

## FE Block Payment Method Script

This is the base JS module for your gateway block integration that you registered in the `initialize()` method of your `Gateway_Checkout_Block_Integration` concrete class. Woo handles enqueuing these scripts in their `\Blocks\Payments\API` class ([code](https://github.com/woocommerce/woocommerce-blocks/blob/trunk/src/Payments/Api.php)). 

The core of this module is a JS object that defines a set of options specific to your payment method which is passed to Woo’s FE Block Registry via their `registerPaymentMethod()` function.

```js
import { registerPaymentMethod } from '@woocommerce/blocks-registry';

const ExampleCreditCardGateway = {
	name: 'my_payment_method',
	content: <Content />,
	edit: <Description />,
	canMakePayment: () => true,
	label: settings.title,
	ariaLabel: settings.title,
	placeOrderButtonLabel: __( 'Continue', 'woocommerce-plugin-domain' ),
	supports: {
		features: settings.supports,
	},
};

registerPaymentMethod(ExampleCreditCardGateway);
```

:::note
The `name` property used to register with the frontend **must match** the name set in the backend `PaymentMethodRegistry`. For our FW payment methods, this will default to the payment gateway ID, e.g. `'authorize_net_cim_credit_card'`.
:::

## Payment Method Components

In the Block Registry options, Woo allows us to define two base nodes, `content` and `edit` , that will be cloned and rendered in the frontend and admin editor respectively. Those nodes will contain all of the UI and logic needed for customers to enter and submit payment details (in `content`) and for merchants to preview the checkout experience in the admin editor (in `edit`).

[ More here on Simon & Alex’s proposed component architecture ]
