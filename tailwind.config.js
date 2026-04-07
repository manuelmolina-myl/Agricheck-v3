/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
			},
			fontSize: {
				'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
				'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
				'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
				'display-xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }]
			},
			colors: {
				// Primary: deep forest green
				primary: {
					50: '#F0FDF4',
					100: '#DCFCE7',
					200: '#BBF7D0',
					300: '#86EFAC',
					400: '#4ADE80',
					500: '#22C55E',
					600: '#16A34A',
					700: '#15803D',
					800: '#166534',
					900: '#14532D',
					950: '#052E16'
				},
				// Accent: warm golden/wheat
				accent: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F',
					950: '#451A03'
				},
				// Earth: warm browns
				earth: {
					50: '#FEFDFB',
					100: '#FBF5ED',
					200: '#F5E6D0',
					300: '#E8CDA5',
					400: '#D4A96E',
					500: '#B8864A',
					600: '#9A6B33',
					700: '#7C5428',
					800: '#634322',
					900: '#52381E',
					950: '#2D1D0E'
				},
				// Surface: warm gray with earth undertone
				surface: {
					50: '#FAFAF9',
					100: '#F5F5F4',
					200: '#E7E5E4',
					300: '#D6D3D1',
					400: '#A8A29E',
					500: '#78716C',
					600: '#57534E',
					700: '#44403C',
					800: '#292524',
					900: '#1C1917',
					950: '#0C0A09'
				},
				warning: {
					50: '#FFFBEB',
					100: '#FEF3C7',
					200: '#FDE68A',
					300: '#FCD34D',
					400: '#FBBF24',
					500: '#F59E0B',
					600: '#D97706',
					700: '#B45309',
					800: '#92400E',
					900: '#78350F'
				},
				danger: {
					50: '#FEF2F2',
					100: '#FEE2E2',
					200: '#FECACA',
					300: '#FCA5A5',
					400: '#F87171',
					500: '#EF4444',
					600: '#DC2626',
					700: '#B91C1C',
					800: '#991B1B',
					900: '#7F1D1D'
				}
			},
			boxShadow: {
				card: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.02), 0 0 0 1px rgb(0 0 0 / 0.03)',
				'card-hover':
					'0 8px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -6px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.04)',
				'soft-xs': '0 1px 2px 0 rgb(0 0 0 / 0.03)',
				'soft-sm': '0 2px 4px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)',
				'soft-md': '0 4px 8px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
				'soft-lg': '0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
				'soft-xl': '0 20px 50px -12px rgb(0 0 0 / 0.12), 0 8px 16px -8px rgb(0 0 0 / 0.06)',
				'glow-primary': '0 0 24px rgb(22 163 74 / 0.2)',
				'glow-accent': '0 0 24px rgb(245 158 11 / 0.2)',
				'inner-soft': 'inset 0 1px 2px 0 rgb(0 0 0 / 0.04)'
			},
			keyframes: {
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(12px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					from: { opacity: '0', transform: 'translateY(-12px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-left': {
					from: { opacity: '0', transform: 'translateX(-24px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					from: { opacity: '0', transform: 'translateX(24px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.9)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'bounce-in': {
					'0%': { opacity: '0', transform: 'scale(0.3)' },
					'50%': { opacity: '1', transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				shimmer: {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'ping-slow': {
					'75%, 100%': { transform: 'scale(1.8)', opacity: '0' }
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateY(-12px) rotate(2deg)' }
				},
				'rotate-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.8' }
				},
				'scroll-reveal': {
					from: { opacity: '0', transform: 'translateY(16px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.25s ease-out',
				'fade-in-up': 'fade-in-up 0.3s ease-out',
				'fade-in-down': 'fade-in-down 0.25s ease-out',
				'slide-in-left': 'slide-in-left 0.25s ease-out',
				'slide-in-right': 'slide-in-right 0.25s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'bounce-in': 'bounce-in 0.4s ease-out',
				shimmer: 'shimmer 1.5s infinite linear',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
				shake: 'shake 0.35s ease-out',
				float: 'float 3s ease-in-out infinite',
				'float-slow': 'float-slow 5s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'scroll-reveal': 'scroll-reveal 0.4s ease-out both'
			},
			spacing: {
				sidebar: '16.5rem'
			}
		}
	},
	plugins: []
};
