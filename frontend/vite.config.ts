import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    hmr: {
      overlay: false, // Completely disable error overlay
      clientPort: 24678
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  clearScreen: false,
  logLevel: 'error', // Only show errors, not warnings
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  optimizeDeps: {
    force: true,
    exclude: ['@angular/build']
  },
  define: {
    // Suppress HMR overlay in client
    'import.meta.hot': 'undefined'
  }
});
