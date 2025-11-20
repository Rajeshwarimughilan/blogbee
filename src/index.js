import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logo from './logo.png';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Replace favicon with project logo (uses webpack asset path)
try {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'icon';
  link.href = logo;
  const head = document.getElementsByTagName('head')[0];
  if (!document.querySelector("link[rel*='icon']")) head.appendChild(link);
} catch (e) {
  // ignore in non-browser environments
  // console.warn('Failed to set favicon', e);
}
