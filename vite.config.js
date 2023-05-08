import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import i18n from 'laravel-react-i18n/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        i18n(),
    ],
    server: {
        hmr: {
            host: '192.168.1.4',
        },
        port: '5173',
        host: true
    } 
});
