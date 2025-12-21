import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress ResizeObserver loop error that occurs during rapid UI updates
// This is a known issue with Radix UI components (Toast, Dialog, etc.)
// The error is benign and doesn't affect functionality
const suppressResizeObserverError = () => {
  const errorHandler = (event) => {
    if (event.message && event.message.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return false;
    }
  };
  
  window.addEventListener('error', errorHandler);
  
  // Also handle unhandled promise rejections that might include this error
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        event.reason.message.includes('ResizeObserver loop')) {
      event.preventDefault();
      return false;
    }
  });
};

suppressResizeObserverError();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
