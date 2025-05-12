import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: '/',

  server: {
    allowedHosts: [
      'b913-160-178-238-101.ngrok-free.app',
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

