import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// ============================================
// ResizeObserver Loop Error Suppression
// ============================================
// This error is benign and comes from Radix UI components (Dialog, Toast, etc.)
// when the DOM changes during measurement. It doesn't affect functionality.
// 
// We suppress it at multiple levels to prevent the React Dev Overlay from showing.

// Method 1: Wrap ResizeObserver to catch the specific error
const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
  constructor(callback) {
    super((entries, observer) => {
      // Use requestAnimationFrame to avoid the loop error
      window.requestAnimationFrame(() => {
        try {
          callback(entries, observer);
        } catch (e) {
          // Silently catch ResizeObserver errors
          if (!e.message?.includes('ResizeObserver')) {
            throw e;
          }
        }
      });
    });
  }
};

// Method 2: Global error handler for any that slip through
const errorHandler = (event) => {
  if (event.message?.includes('ResizeObserver loop') || 
      event.message?.includes('ResizeObserver loop completed')) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return true;
  }
};

window.addEventListener('error', errorHandler, true);

// Method 3: Override console.error to filter out the specific error
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('ResizeObserver loop')) {
    return; // Suppress
  }
  originalConsoleError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
