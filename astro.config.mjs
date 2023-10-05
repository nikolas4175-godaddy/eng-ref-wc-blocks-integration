import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'SV Plugin x WooCommerce Blocks Integration Docs',
			social: {
				github: 'https://github.com/nikolas4175-godaddy/eng-ref-wc-blocks-integration',
			},
			sidebar: [
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },
				},
			],
		}),
	],
});
