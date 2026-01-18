import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Suppress harmless errors from third-party libraries
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || String(event.reason || '');
  // Suppress known harmless errors from foblex/flow library
  if (errorMessage.includes('checkout popup config') || 
      errorMessage.includes('No checkout popup config found')) {
    event.preventDefault(); // Prevent the error from being logged
    return;
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
