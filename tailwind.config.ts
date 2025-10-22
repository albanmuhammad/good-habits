import type {Config} from 'tailwindcss'

export default {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                accent: {DEFAULT: '#16a34a'}
            }
        }
    },
    plugins: []
} satisfies Config