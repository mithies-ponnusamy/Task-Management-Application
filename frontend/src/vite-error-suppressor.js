// Global error suppression for Vite overlay issues
(function() {
  'use strict';
  
  // Suppress console errors that match Vite overlay patterns
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Filter out Vite-specific errors
    if (message.includes('Failed to update Vite client error overlay') ||
        message.includes('angular-memory-plugin.js') ||
        message.includes('viteTransformMiddleware') ||
        message.includes('loadViteClientCode')) {
      return; // Suppress these errors
    }
    
    originalConsoleError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args.join(' ');
    
    // Filter out Vite-specific warnings
    if (message.includes('Failed to update Vite client error overlay') ||
        message.includes('angular-memory-plugin.js') ||
        message.includes('viteTransformMiddleware')) {
      return; // Suppress these warnings
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  // Suppress unhandled promise rejections related to Vite
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('Failed to update Vite client error overlay')) {
      event.preventDefault();
    }
  });
  
})();
