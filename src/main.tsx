import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// In AI Studio preview environment, HMR is disabled. Ignore Vite WebSocket errors per environment constraints.
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('WebSocket') ||
      event.message?.includes('createWebSocketModuleRunnerTransport') ||
      event.filename?.includes('@vite/client')
    ) {
      event.preventDefault();
    }
  });
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (
      reason?.message?.includes('WebSocket') ||
      (typeof reason === 'string' && reason.includes('WebSocket')) ||
      reason?.stack?.includes('@vite/client')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
