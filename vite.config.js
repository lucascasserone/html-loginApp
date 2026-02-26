import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    hmr: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
          'alpine': ['alpinejs'],
          'sweetalert': ['sweetalert2'],
        }
      }
    }
  },
  optimizeDeps: {
    include: ['alpinejs', '@supabase/supabase-js', 'sweetalert2']
  },
  define: {
    __APP_VERSION__: JSON.stringify('11.9'),
  }
});
