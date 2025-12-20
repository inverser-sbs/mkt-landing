import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DynamicLandingPage from "./pages/DynamicLandingPage";
import MentorEditPage from "./pages/MentorEditPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

// Admin pages (will be created)
import MentorsListPage from "./pages/admin/MentorsListPage";
import MentorFormPage from "./pages/admin/MentorFormPage";
import ActionsPage from "./pages/admin/ActionsPage";
import CSVPage from "./pages/admin/CSVPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Mentor edit panel with magic token */}
            <Route path="/edit/:slug" element={<MentorEditPage />} />
            
            {/* Admin routes (protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <MentorsListPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mentor/new"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <MentorFormPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mentor/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <MentorFormPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/actions"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <ActionsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/csv"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <CSVPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AnalyticsPage />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Dynamic mentor landing - MUST be last */}
            <Route path="/:slug" element={<DynamicLandingPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;