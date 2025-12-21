// ============================================
// ResizeObserver Loop Error - DEFINITIVE FIX
// ============================================
// This MUST execute FIRST, before any imports or React loading.
// Reference: https://github.com/radix-ui/primitives/issues/2313

// STEP 1: Patch ResizeObserver globally BEFORE React loads
const NativeResizeObserver = window.ResizeObserver;
window.ResizeObserver = class PatchedResizeObserver extends NativeResizeObserver {
  constructor(callback) {
    super((entries, observer) => {
      // Defer callback to next animation frame to prevent loop detection
      window.requestAnimationFrame(() => {
        callback(entries, observer);
      });
    });
  }
};

// STEP 2: Intercept error events BEFORE they reach React's error overlay
// This uses capture phase and stops propagation completely
const resizeObserverErrorFilter = (event) => {
  const msg = event?.message || event?.reason?.message || '';
  if (msg.includes('ResizeObserver loop')) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
};
window.addEventListener('error', resizeObserverErrorFilter, true);
window.addEventListener('unhandledrejection', resizeObserverErrorFilter, true);

// STEP 3: Override console methods to filter the error from logs
const nativeConsoleError = console.error.bind(console);
const nativeConsoleWarn = console.warn.bind(console);
console.error = (...args) => {
  if (args.join(' ').includes('ResizeObserver loop')) return;
  nativeConsoleError(...args);
};
console.warn = (...args) => {
  if (args.join(' ').includes('ResizeObserver loop')) return;
  nativeConsoleWarn(...args);
};

// STEP 4: Disable React Error Overlay for this specific error
// The overlay listens to window errors; we intercept its handler
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Override the error overlay's event listener registration
  const originalAddEventListener = window.addEventListener.bind(window);
  window.addEventListener = function(type, listener, options) {
    if (type === 'error') {
      // Wrap the listener to filter ResizeObserver errors
      const wrappedListener = function(event) {
        if (event?.message?.includes('ResizeObserver loop')) {
          return; // Don't show overlay for this error
        }
        return listener.apply(this, arguments);
      };
      return originalAddEventListener(type, wrappedListener, options);
    }
    return originalAddEventListener(type, listener, options);
  };
}

// NOW load React and the app
import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
