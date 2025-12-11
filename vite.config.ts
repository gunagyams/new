import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React core libraries into separate chunk (~130 KB)
          // This allows browser to cache React independently from app code
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],

          // Split React Router into separate chunk (~50 KB)
          // Most pages use routing, so this is shared across routes
          'vendor-router': ['react-router-dom'],

          // Split Framer Motion animations into separate chunk (~100 KB)
          // Used across multiple components for animations
          'vendor-motion': ['framer-motion'],

          // Split TipTap editor (only used in admin panel) (~200 KB)
          // This prevents loading heavy editor code for regular visitors
          'vendor-editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-image',
            '@tiptap/extension-link',
            '@tiptap/extension-placeholder'
          ],

          // Split Supabase client into separate chunk (~80 KB)
          // Used across the app but can be cached separately
          'vendor-supabase': ['@supabase/supabase-js'],

          // Split other utilities
          'vendor-utils': ['lucide-react', 'react-helmet-async'],
        },
      },
    },

    // Increase chunk size warning limit (we've split chunks manually)
    chunkSizeWarningLimit: 600,

    // Enable minification for production using esbuild (faster than terser)
    minify: 'esbuild',

    // Optimize source maps for production
    sourcemap: false,
  },
});
