import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UploadModal from './UploadModal';
import FloatingActions from './FloatingActions';
import useUploadModal from '../../stores/uploadModalStore';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <UploadModal />
      <FloatingActions />
      <div className="mobile-bottom-bar">
        <a href="/diagnostics">🔬 Tests</a>
        <a href="/services">📦 Packages</a>
        <a href="/upload-prescription" onClick={e => { e.preventDefault(); useUploadModal.getState().setOpen(true); }}>📄 Upload</a>
        <a href="/my-orders">🧾 Orders</a>
      </div>
    </>
  );
}
