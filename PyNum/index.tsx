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