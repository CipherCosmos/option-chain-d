import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth'],
  },
  build: {
    rollupOptions: {
      external: ['firebase/app', 'firebase/auth'],
      output: {
        globals: {
          'firebase/app': 'firebase',
          'firebase/auth': 'firebaseAuth'
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://127.0.0.1:10001/api')
  }
});