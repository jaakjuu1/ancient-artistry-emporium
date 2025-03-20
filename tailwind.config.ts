
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				serif: ['Cormorant Garamond', 'serif'],
				display: ['Cinzel Decorative', 'serif'],
				sans: ['EB Garamond', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				mystic: {
					50: '#f8f5f0',
					100: '#e8e0d5',
					200: '#d8ccb8',
					300: '#c3b096',
					400: '#b09775',
					500: '#9c7f5a',
					600: '#8c6744',
					700: '#735235',
					800: '#5f442e',
					900: '#4d3826',
					950: '#2b1f15',
				},
				parchment: {
					50: '#fbf9f3',
					100: '#f5f0e2',
					200: '#eadfc2',
					300: '#dcc89a',
					400: '#d0b176',
					500: '#c29856',
					600: '#b3804b',
					700: '#95663f',
					800: '#7a5339',
					900: '#654633',
					950: '#362318',
				},
				burgundy: {
					50: '#fbf5f5',
					100: '#f8eaea',
					200: '#f2d5d5',
					300: '#e9b5b4',
					400: '#dc8785',
					500: '#cc6160',
					600: '#b54546',
					700: '#973136',
					800: '#7c2b30',
					900: '#68282c',
					950: '#3a1314',
				},
				sapphire: {
					50: '#f1f6fd',
					100: '#e0ecfb',
					200: '#c8ddf7',
					300: '#a3c7f1',
					400: '#76a9e9',
					500: '#558ae0',
					600: '#406dd3',
					700: '#3659c2',
					800: '#31489e',
					900: '#2c3e7c',
					950: '#202651',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'parchment-texture': "url('https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=1600&q=80')",
				'stone-texture': "url('https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&w=1600&q=80')",
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'smooth-appear': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'scale-in': 'scale-in 0.7s ease-out',
				'smooth-appear': 'smooth-appear 1.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
