import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// ============================================
// ResizeObserver Loop Error - DEFINITIVE FIX
// ============================================
// This error is a known issue with Radix UI components (Dialog, Toast, etc.)
// Reference: https://github.com/radix-ui/primitives/issues/2313
// 
// The fix wraps ResizeObserver callbacks in requestAnimationFrame to defer
// notifications to the next frame, preventing the browser's loop detection.

// CRITICAL: This must run BEFORE any Radix component loads
(function() {
  // Store the original ResizeObserver
  const OriginalResizeObserver = window.ResizeObserver;
  
  // Create a patched version that defers callbacks to avoid loop errors
  window.ResizeObserver = class PatchedResizeObserver extends OriginalResizeObserver {
    constructor(callback) {
      // Wrap the callback to execute in the next animation frame
      const wrappedCallback = (entries, observer) => {
        // Use requestAnimationFrame to defer the callback execution
        // This prevents "loop completed with undelivered notifications"
        window.requestAnimationFrame(() => {
          callback(entries, observer);
        });
      };
      super(wrappedCallback);
    }
  };
  
  // Global error handler - captures errors at the window level
  // This must use capture phase (third param = true) to intercept before React
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  }, true);
  
  // Unhandled rejection handler for Promise-based errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  }, true);
  
  // Console error filter - prevents console noise
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('ResizeObserver loop')) {
      return; // Silently ignore
    }
    return originalConsoleError.apply(console, args);
  };
  
  // Console warn filter as well
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('ResizeObserver loop')) {
      return;
    }
    return originalConsoleWarn.apply(console, args);
  };
})();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
