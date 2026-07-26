import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HostGate from './components/HostGate.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Diagnostics from './pages/Diagnostics.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import { isAdminHostname, isAdminRole } from './utils/authRoles.js';
import useAuthStore from './stores/authStore.js';

function AdminCatchAll() {
  const user = useAuthStore((s) => s.user);
  if (user && isAdminRole(user.role)) return <Navigate to="/admin" replace />;
  return <Navigate to="/admin/login" replace />;
}

export default function App() {
  const adminHost = isAdminHostname();

  return (
    <HostGate>
      <Routes>
        {/* Admin portal — works on apex and admin.* */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="catalog" element={<AdminCatalog />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {adminHost ? (
          /* admin.jeevanhealthcare.com — ops only, no patient home */
          <Route path="*" element={<AdminCatchAll />} />
        ) : (
          /* Main patient site */
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Navigate to="/signup" replace />} />
            <Route path="diagnostics" element={<Diagnostics />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </HostGate>
  );
}
