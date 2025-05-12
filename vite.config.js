import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Base path configuration (if your app is deployed at the root, this is fine as '/')
  base: '/',

  server: {
    allowedHosts: [
      'b913-160-178-238-101.ngrok-free.app',  // You can remove this if it's unnecessary for your production environment
    ],

    // This will enable client-side routing for single-page applications (SPA)
    historyApiFallback: true,  // This allows all routes to be handled by React Router or your SPA router
  },

  build: {
    outDir: 'dist',  // Specify the output directory (Vercel will use this)
    rollupOptions: {
      input: '/index.html', // Ensure the right entry point for Vite
    },
  },
});

