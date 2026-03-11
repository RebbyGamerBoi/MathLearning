import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

console.log("Arcade: main.jsx execution started");

const container = document.getElementById('root');

if (!container) {
  console.error("Arcade Error: Root element '#root' not found in DOM.");
} else {
  try {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log("Arcade: React render initiated successfully");
  } catch (err) {
    console.error("Arcade: Fatal Render Error:", err);
    container.innerHTML = `
      <div style="padding: 40px; background: #18181b; color: #ef4444; font-family: monospace; border: 2px solid #ef4444; margin: 20px; border-radius: 8px;">
        <h2 style="margin-top: 0;">Fatal Render Error</h2>
        <pre style="white-space: pre-wrap; font-size: 12px;">${err.stack || err.message}</pre>
        <button onclick="window.location.reload()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Retry Load</button>
      </div>
    `;
  }
}
