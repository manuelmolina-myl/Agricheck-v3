/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', '../../packages/ui/src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#eff6ff',
					500: '#0066FF',
					600: '#0052CC',
					700: '#003D99'
				}
			}
		}
	},
	plugins: []
};
