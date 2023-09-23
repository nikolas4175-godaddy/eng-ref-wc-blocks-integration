---
title: WC Blocks Architecture
description: A guided summary of our approach to WC Cart/Checkout block integration.
---

# General Architecture

🔗 WC Developer Blog (~2 min): [Understanding the Architecture of Cart and Checkout Blocks](https://developer.woocommerce.com/2023/09/18/architecture-of-cart-and-checkout-blocks/)

Here’s a rough outline of the contextual layers that our plugin integrations will be operating within:

```json
WP Page {
	WP Blocks {
		(...any other blocks on the page)
		WC Cart Block {
			Inner Blocks [
				Cart Items {...},
				Cart Summary {...},
				(...),
				Proceed to Checkout Button,
			]
		}
		WC Checkout Block {
			Inner Blocks [
				Billing Fields {...},
				Shipping Fields {...},
				Payment Fields {...},
				Order Summary {...},
				(...),
				Place Order Button,
			]
		}
	}
}
```

And here are some examples of what the default Cart and Checkout blocks look like on the site

[ TODO: Screens of Cart and Checkout Blocks in editor and FE ]