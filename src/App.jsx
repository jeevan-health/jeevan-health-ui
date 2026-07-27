import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HostGate from './components/HostGate.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Diagnostics from './pages/Diagnostics.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Reports from './pages/Reports.jsx';
import PhlebotomistOnboarding from './pages/PhlebotomistOnboarding.jsx';
import PhleboAssessment from './pages/PhleboAssessment.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminPhleboHire from './pages/admin/AdminPhleboHire.jsx';
import AdminReports from './pages/admin/AdminReports.jsx';
import PhleboHome from './pages/phlebo/PhleboHome.jsx';
import PhleboLogin from './pages/phlebo/PhleboLogin.jsx';
import PhleboDashboard from './pages/phlebo/PhleboDashboard.jsx';
import PhleboJob from './pages/phlebo/PhleboJob.jsx';
import {
  isAdminHostname,
  isPhleboHostname,
  isAdminRole,
  isPhleboRole,
} from './utils/authRoles.js';
import useAuthStore from './stores/authStore.js';
import PwaInstallBanner from './components/PwaInstallBanner.jsx';

function AdminCatchAll() {
  const user = useAuthStore((s) => s.user);
  if (user && isAdminRole(user.role)) return <Navigate to="/admin" replace />;
  return <Navigate to="/admin/login" replace />;
}

/** Unknown paths on phlebo host → landing (login-first), never hire form by default */
function PhleboCatchAll() {
  const user = useAuthStore((s) => s.user);
  if (user && (isPhleboRole(user.role) || isAdminRole(user.role))) {
    return <Navigate to="/phlebo" replace />;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  const adminHost = isAdminHostname();
  const phleboHost = isPhleboHostname();

  return (
    <HostGate>
      <PwaInstallBanner />
      <Routes>
        {/* Admin portal — apex + admin.* */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="catalog" element={<AdminCatalog />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="phlebo" element={<AdminPhleboHire />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Phlebo portal + hire form — apex + phlebo.* */}
        <Route path="/phlebo/login" element={<PhleboLogin />} />
        <Route path="/phlebo" element={<PhleboDashboard />} />
        <Route path="/phlebo/jobs/:orderId" element={<PhleboJob />} />
        <Route path="/onboarding-phlebotomist" element={<PhlebotomistOnboarding />} />
        <Route path="/careers/phlebotomist" element={<PhlebotomistOnboarding />} />
        <Route path="/careers/assessment/:token" element={<PhleboAssessment />} />
        <Route path="/assessment/:token" element={<PhleboAssessment />} />

        {adminHost ? (
          <Route path="*" element={<AdminCatchAll />} />
        ) : phleboHost ? (
          <>
            {/* Login-first landing — not the hire form */}
            <Route index element={<PhleboHome />} />
            <Route path="*" element={<PhleboCatchAll />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Navigate to="/signup" replace />} />
            <Route path="diagnostics" element={<Diagnostics />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="reports" element={<Reports />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* Hire form still available from patient site careers link */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </HostGate>
  );
}
