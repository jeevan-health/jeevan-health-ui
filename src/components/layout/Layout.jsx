import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UploadModal from './UploadModal';
import FloatingActions from './FloatingActions';
import CartDrawer from './CartDrawer';
import useUploadModal from '../../stores/uploadModalStore';
import useCartStore from '../../stores/cartStore';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <UploadModal />
      <CartDrawer />
      <FloatingActions />
      <div className="mobile-bottom-bar">
        <a href="/diagnostics">🔬 Tests</a>
        <a href="/services">📦 Packages</a>
        <a href="/upload-prescription" onClick={e => { e.preventDefault(); useUploadModal.getState().setOpen(true); }}>📄 Upload</a>
        <button className="mbb-cart" onClick={() => useCartStore.getState().setCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'inherit', padding: 0 }}>
          🛒 Cart
        </button>
        <a href="/my-orders">🧾 Orders</a>
      </div>
    </>
  );
}
