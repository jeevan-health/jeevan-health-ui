import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import DoctorConsultation from './pages/DoctorConsultation';
import DoctorProfile from './pages/DoctorProfile';
import MyAppointments from './pages/MyAppointments';
import ConsultationRoom from './pages/ConsultationRoom';
import Pharmacy from './pages/Pharmacy';
import MyOrders from './pages/MyOrders';
import HealthRecords from './pages/HealthRecords';
import VitalsTracker from './pages/VitalsTracker';
import Diagnostics from './pages/Diagnostics';
import MyTestOrders from './pages/MyTestOrders';
import TestResults from './pages/TestResults';
import Contact from './pages/Contact';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import FamilyList from './pages/FamilyList';
import AddFamily from './pages/AddFamily';
import WellnessHub from './pages/WellnessHub';
import FoodDiary from './pages/FoodDiary';

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/onboarding" />;
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
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/consultation/:appointmentId" element={<ProtectedRoute><ConsultationRoom /></ProtectedRoute>} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/health-records" element={<ProtectedRoute><HealthRecords /></ProtectedRoute>} />
          <Route path="/vitals" element={<ProtectedRoute><VitalsTracker /></ProtectedRoute>} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/my-test-orders" element={<ProtectedRoute><MyTestOrders /></ProtectedRoute>} />
          <Route path="/test-results/:orderId" element={<ProtectedRoute><TestResults /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<Contact />} />
          <Route path="/wellness" element={<WellnessHub />} />
          <Route path="/food-diary" element={<ProtectedRoute><FoodDiary /></ProtectedRoute>} />
        </Route>
        <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><OtpVerification /></PublicRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/family" element={<ProtectedRoute><FamilyList /></ProtectedRoute>} />
        <Route path="/family/add" element={<ProtectedRoute><AddFamily /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
