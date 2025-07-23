import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

// Configure Tailwind CSS
const script = document.createElement('script');
script.textContent = `
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          dark: '#1e293b',
          light: '#f8fafc',
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        height: {
          'screen': '100vh',
          'screen-90': '90vh',
        },
        minHeight: {
          'screen': '100vh',
          'screen-90': '90vh',
        }
      }
    }
  }
`;
document.head.appendChild(script);

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));