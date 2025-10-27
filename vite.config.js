import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: '/',

  server: {
    allowedHosts: [
      '5753-196-217-92-216.ngrok-free.app', // ngrok
    ],

    historyApiFallback: true,
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: '/index.html',
    },
  },
});

