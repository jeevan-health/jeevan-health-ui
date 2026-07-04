import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import DoctorConsultation from './pages/DoctorConsultation';
import Pharmacy from './pages/Pharmacy';
import Diagnostics from './pages/Diagnostics';
import Contact from './pages/Contact';
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
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctor-consultation" element={<DoctorConsultation />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/family" element={<ProtectedRoute><FamilyList /></ProtectedRoute>} />
        <Route path="/family/add" element={<ProtectedRoute><AddFamily /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
