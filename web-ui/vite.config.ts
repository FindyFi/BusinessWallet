import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests to the backend during development so that relative
    // URLs (used when VITE_API_BASE_URL is not set) are forwarded correctly.
    // Override the target with the API_PROXY_TARGET env var when the backend
    // is not on localhost (e.g. inside Docker Compose where the service is
    // reachable as "backend-dev").
    proxy: {
      '/credentials': {
        target: process.env['API_PROXY_TARGET'] ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
