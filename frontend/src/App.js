import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DynamicLandingPage from "./pages/DynamicLandingPage";
import MentorEditPage from "./pages/MentorEditPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Generic landing - redirect to home or show generic */}
          <Route path="/" element={<HomePage />} />
          
          {/* Mentor edit panel with magic token */}
          <Route path="/edit/:slug" element={<MentorEditPage />} />
          
          {/* Dynamic mentor landing */}
          <Route path="/:slug" element={<DynamicLandingPage />} />
          
          {/* Admin routes will be added later */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;