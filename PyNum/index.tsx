import React from 'react';
import ReactDOM from 'react-dom/client';
// Remove BrowserRouter import
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* Do NOT add BrowserRouter here, because App.tsx already has HashRouter */}
    <App />
  </React.StrictMode>
);

// Register Service Worker for Offline PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use relative path './sw.js' to support subdirectory deployments (e.g. /PyNum/)
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('PyNum ServiceWorker registration successful with scope: ', registration.scope);
      }, (err) => {
        console.log('PyNum ServiceWorker registration failed: ', err);
      });
  });
}