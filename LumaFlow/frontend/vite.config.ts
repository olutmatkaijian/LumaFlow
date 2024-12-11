import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const FLASK_SERVER_URL = process.env.VITE_FLASK_SERVER_URL || 'http://localhost:5000';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            '/api': {
                target: FLASK_SERVER_URL,
                changeOrigin: true,
                secure: false,
                credentials: 'include',
            },
            '/api/logout': {
                target: FLASK_SERVER_URL,
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api\/logout/, '/logout'),
                credentials: 'include',
            },
            '/api/user': {
                target: FLASK_SERVER_URL,
                changeOrigin: true,
                secure: false,
                credentials: 'include',
            },
            '/api/socket.io': {
                target: FLASK_SERVER_URL,
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/api\/socket.io/, '/socket.io'),
            },
            '/api/yjs': {
                target: FLASK_SERVER_URL,
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/api\/yjs/, '/yjs'),
            },
        },
    },
});

