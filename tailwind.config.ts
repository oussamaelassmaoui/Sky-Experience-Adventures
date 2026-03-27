import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                'xs': '475px', // Extra small devices (large phones)
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                sky: {
                    900: '#1E3A8A', // Custom blue
                    50: '#f0f9ff',
                },
                orange: {
                    500: '#F97316', // Custom orange
                    600: '#EA580C',
                },
                beige: {
                    50: '#FDFBF7',
                    100: '#FDF6E9',
                    200: '#F5E6D3',
                    300: '#EBD6B8',
                    400: '#E0C59E',
                    500: '#D6B485',
                }
            },
            fontFamily: {
                sans: ['var(--font-montserrat)', 'sans-serif'],
                playfair: ['var(--font-playfair)', 'serif'],
                script: ['var(--font-dancing)', 'cursive'],
            },
        },
    },
    plugins: [],
} satisfies Config;
