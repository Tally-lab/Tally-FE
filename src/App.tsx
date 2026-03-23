import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Overview from './pages/Overview';
import AuthCallback from './pages/AuthCallback';
import Report from './pages/Report';
import { isAuthenticated } from './utils/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />
            </ProtectedRoute>
          }
        />
        <Route path="/report/:reportId" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
