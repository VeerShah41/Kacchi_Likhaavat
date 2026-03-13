/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark navy → indigo spectrum (backgrounds, surfaces)
                navy: {
                    50:  '#f0f3f8',
                    100: '#d6ddf0',
                    200: '#aabbdf',
                    300: '#7b9bb5',
                    400: '#4e749a',
                    500: '#2d3561',
                    600: '#242a50',
                    700: '#1e2243',
                    800: '#1a1e2e',
                    900: '#13162200',
                },
                // Accent: muted sky / steel blue
                primary: {
                    50:  '#eef5fb',
                    100: '#d1e6f5',
                    200: '#a8cee9',
                    300: '#7bb5dc',
                    400: '#7b9bb5',
                    500: '#5a88b0',
                    600: '#3a6e96',
                    700: '#2d5a7d',
                    800: '#1d4160',
                    900: '#122d44',
                },
                // Warm cream text palette
                cream: {
                    50:  '#fdfaf6',
                    100: '#f8f2e8',
                    200: '#f0e5d0',
                    300: '#e8ddd0',
                    400: '#d9c9b3',
                    500: '#c9b99a',
                    600: '#a8956f',
                    700: '#8a7352',
                    800: '#6b5839',
                    900: '#4a3c26',
                },
                accent: {
                    50:  '#f0f7ff',
                    100: '#d8ebfa',
                    200: '#b8d4e8',
                    300: '#90bcdb',
                    400: '#65a2cd',
                    500: '#3b88bb',
                    600: '#2573a0',
                    700: '#1a5c84',
                    800: '#134868',
                    900: '#0c334d',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(24px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
