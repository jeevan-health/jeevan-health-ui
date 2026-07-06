import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import useAuthStore from './store/authStore';
import Layout from './components/layout/Layout';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const DoctorConsultation = lazy(() => import('./pages/DoctorConsultation'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const MyAppointments = lazy(() => import('./pages/MyAppointments'));
const ConsultationRoom = lazy(() => import('./pages/ConsultationRoom'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const HealthRecords = lazy(() => import('./pages/HealthRecords'));
const VitalsTracker = lazy(() => import('./pages/VitalsTracker'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const MyTestOrders = lazy(() => import('./pages/MyTestOrders'));
const TestResults = lazy(() => import('./pages/TestResults'));
const Contact = lazy(() => import('./pages/Contact'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Signup = lazy(() => import('./pages/Signup'));
const OtpVerification = lazy(() => import('./pages/OtpVerification'));
const ProfileSetup = lazy(() => import('./pages/ProfileSetup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const FamilyList = lazy(() => import('./pages/FamilyList'));
const AddFamily = lazy(() => import('./pages/AddFamily'));
const WellnessHub = lazy(() => import('./pages/WellnessHub'));
const FoodDiary = lazy(() => import('./pages/FoodDiary'));
const PackageDetail = lazy(() => import('./pages/PackageDetail'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
import './data/initGlobals'; // initialize __packagesByAxis when __allTests is ready

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
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: 13, color: 'var(--text-light)' }}>
          Loading...
        </div>
      }>
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
            <Route path="/my-test-orders" element={<MyTestOrders />} />
            <Route path="/test-results/:orderId" element={<ProtectedRoute><TestResults /></ProtectedRoute>} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wellness" element={<WellnessHub />} />
            <Route path="/food-diary" element={<ProtectedRoute><FoodDiary /></ProtectedRoute>} />
            <Route path="/health-packages" element={<Diagnostics />} />
            <Route path="/package/:slug" element={<PackageDetail />} />
          </Route>
          <Route path="/onboarding" element={<PublicRoute><Onboarding /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><OtpVerification /></PublicRoute>} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/family" element={<ProtectedRoute><FamilyList /></ProtectedRoute>} />
          <Route path="/family/add" element={<ProtectedRoute><AddFamily /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
