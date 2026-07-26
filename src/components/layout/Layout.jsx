import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import MobileNav from './MobileNav.jsx';
import CartDrawer from './CartDrawer.jsx';
import './layout.css';

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <CartDrawer />
    </div>
  );
}
