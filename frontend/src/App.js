import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DynamicLandingPage from "./pages/DynamicLandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Generic landing - redirect to home or show generic */}
          <Route path="/" element={<HomePage />} />
          
          {/* Dynamic mentor landing */}
          <Route path="/:slug" element={<DynamicLandingPage />} />
          
          {/* Admin and edit routes will be added later */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;