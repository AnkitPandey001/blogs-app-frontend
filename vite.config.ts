import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api':'https://blogs-app-backend-mb0v.onrender.com'
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
