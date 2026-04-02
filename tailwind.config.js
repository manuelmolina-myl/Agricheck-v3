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
				'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }]
			},
			colors: {
				primary: {
					50: '#EEF4FF',
					100: '#D9E5FF',
					200: '#BBCFFF',
					300: '#8BADFF',
					400: '#5485FF',
					500: '#2B5FFF',
					600: '#0D3FFF',
					700: '#0033F0',
					800: '#0529C1',
					900: '#0A2798',
					950: '#071A5C'
				},
				accent: {
					50: '#ECFDF5',
					100: '#D1FAE5',
					200: '#A7F3D0',
					300: '#6EE7B7',
					400: '#34D399',
					500: '#10B981',
					600: '#059669',
					700: '#047857',
					800: '#065F46',
					900: '#064E3B',
					950: '#022C22'
				},
				surface: {
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A',
					950: '#020617'
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
				'soft-md':
					'0 4px 8px -2px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
				'soft-lg':
					'0 10px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
				'soft-xl':
					'0 20px 50px -12px rgb(0 0 0 / 0.12), 0 8px 16px -8px rgb(0 0 0 / 0.06)',
				'glow-primary': '0 0 20px rgb(13 63 255 / 0.15)',
				'glow-accent': '0 0 20px rgb(16 185 129 / 0.15)',
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
					from: { opacity: '0', transform: 'translateX(-16px)' },
					to: { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-right': {
					from: { opacity: '0', transform: 'translateX(16px)' },
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
					'50%': { transform: 'translateY(-6px)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'fade-in-down': 'fade-in-down 0.5s ease-out',
				'slide-in-left': 'slide-in-left 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.4s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'bounce-in': 'bounce-in 0.6s ease-out',
				shimmer: 'shimmer 2s infinite linear',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
				shake: 'shake 0.5s ease-out',
				float: 'float 3s ease-in-out infinite'
			},
			backdropBlur: {
				xs: '2px'
			},
			spacing: {
				sidebar: '16.5rem'
			}
		}
	},
	plugins: []
};
