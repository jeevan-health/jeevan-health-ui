import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="floating-wa">
        💬
      </a>
      <div className="mobile-bottom-bar">
        <a href="/diagnostics">🔬 Tests</a>
        <a href="/services">📦 Packages</a>
        <a href="/my-orders">🧾 Orders</a>
        <a href="/diagnostics" className="mbb-cta">📅 Book Now</a>
      </div>
    </>
  );
}
