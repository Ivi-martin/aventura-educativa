import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                // Aquí añadiremos fuentes divertidas más adelante
            },
            colors: {
                brand: {
                    light: '#4ade80',
                    DEFAULT: '#22c55e',
                    dark: '#16a34a',
                },
            },
        },
    },
    plugins: [forms],
};