import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Check if it's a Vite client error that we want to suppress
    if (error?.message?.includes('Failed to update Vite client error overlay') ||
        error?.stack?.includes('angular-memory-plugin.js') ||
        error?.stack?.includes('viteTransformMiddleware')) {
      // Silently ignore these Vite overlay errors
      return;
    }

    // For other errors, log them normally but don't let them bubble up to Vite
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn('Application error:', error);
    }
  }
}
