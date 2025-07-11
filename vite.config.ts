import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'grommet-icons', 'react-icons'],
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api-dolar': {
        target: 'https://dolarapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-dolar/, ''),
        secure: true
      },
      '/api-criptoya': {
        target: 'https://criptoya.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-criptoya/, ''),
        secure: true
      }
    }
  },
  preview: {
    port: 4173,
    host: true,
    open: true
  }
});