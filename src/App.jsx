import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import FamilyList from './pages/FamilyList';
import AddFamily from './pages/AddFamily';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/signup" />;
  return children;
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  return children;
}

export default function App() {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Onboarding /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/family" element={<ProtectedRoute><FamilyList /></ProtectedRoute>} />
        <Route path="/family/add" element={<ProtectedRoute><AddFamily /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
