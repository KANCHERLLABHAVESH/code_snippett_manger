import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SnippetFormPage from "./pages/SnippetFormPage.jsx";
import SnippetDetailPage from "./pages/SnippetDetailPage.jsx";
import CollectionsPage from "./pages/CollectionsPage.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/snippets/new"
            element={
              <ProtectedRoute>
                <SnippetFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="/snippets/:id" element={<SnippetDetailPage />} />
          <Route
            path="/collections"
            element={
              <ProtectedRoute>
                <CollectionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </main>
    </>
  );
};

export default App;

