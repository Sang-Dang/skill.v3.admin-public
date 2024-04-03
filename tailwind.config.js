import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    corePlugins: {
        preflight: false,
    },
    important: true,
    theme: {
        extend: {
            screens: {
                xs: '576px',
            },
        },
    },
    plugins: [forms],
}
