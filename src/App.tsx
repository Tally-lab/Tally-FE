import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import OrganizationDetail from "./pages/OrganizationDetail";
import { isAuthenticated } from "./utils/auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organization/:orgName"
          element={
            <ProtectedRoute>
              <OrganizationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis/:owner/:repo"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
