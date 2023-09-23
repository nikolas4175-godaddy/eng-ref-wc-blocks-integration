---
title: Background Context
description: How we got here and where we're going
---
# Context

WooCommerce’s Cart and Checkout blocks bring the WP Block Editor (aka Gutenberg) interface to WooCommerce, allowing merchants to preview the look and feel of their checkout experience in the site admin while providing a more streamlined, React-driven checkout experience for customers on the frontend. 

Previously, the Cart and Checkout pages in WooCommerce could be output only via [WordPress shortcodes](https://woocommerce.com/document/woocommerce-shortcodes/), which would print the necessary HTML and supporting assets like JS code and CSS styles when viewed in the front-end. The blocks take a rather different approach as, while they can still be inserted in a standard WordPress page in the form of a block component, they are entirely React-driven, utilizing a different templating model (JSX) and set of JS events compared to the previous shortcode implementation.

While Woo plans to retain the existing shortcode system for backwards compatibility, block-based checkout will be the default experience for new installs starting in v8.4 (scheduled early Nov).

As such, many of our WooCommerce extensions need updating to integrate our existing backends with the new block-based frontend that Woo has constructed. 