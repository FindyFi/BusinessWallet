import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy rule shared by both the dev server and the preview server.
// Override the target with the API_PROXY_TARGET env var when the backend
// is not on localhost (e.g. inside Docker Compose where the service is
// reachable as "backend-dev").
const apiProxy = {
  '/credentials': {
    target: process.env['API_PROXY_TARGET'] ?? 'http://localhost:3001',
    changeOrigin: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to the backend during `npm run dev` so that relative
    // URLs (used when VITE_API_BASE_URL is not set) are forwarded correctly.
    proxy: apiProxy,
  },
  preview: {
    // Same proxy for `npm run preview` (production build preview on port 4173).
    proxy: apiProxy,
  },
});
