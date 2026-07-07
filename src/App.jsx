import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/layout/Layout';
import useAuthStore from './stores/authStore';

const Home = lazy(() => import('./pages/Home'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const TestDetail = lazy(() => import('./pages/TestDetail'));
const Services = lazy(() => import('./pages/Services'));
const PackageDetail = lazy(() => import('./pages/PackageDetail'));
const MyTestOrders = lazy(() => import('./pages/MyTestOrders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Signup = lazy(() => import('./pages/Signup'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));

function Protected({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  if (!isAuth) return <Navigate to="/signup" />;
  return children;
}

function Loading() {
  return <div className="page-section container text-center" style={{ padding: '80px 16px' }}>Loading...</div>;
}

export default function App() {
  const fetchProfile = useAuthStore(s => s.fetchProfile);
  const isAuth = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (isAuth) fetchProfile();
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/test/:slug" element={<TestDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/package/:slug" element={<PackageDetail />} />
            <Route path="/my-orders" element={<Protected><MyTestOrders /></Protected>} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
