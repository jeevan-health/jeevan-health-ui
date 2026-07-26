import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Diagnostics from './pages/Diagnostics.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminCatalog from './pages/admin/AdminCatalog.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Navigate to="/signup" replace />} />
        <Route path="diagnostics" element={<Diagnostics />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admin/catalog" element={<AdminCatalog />} />
        <Route path="admin" element={<Navigate to="/admin/catalog" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
