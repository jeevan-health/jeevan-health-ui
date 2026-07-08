import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import UploadModal from './UploadModal';
import useUploadModal from '../../stores/uploadModalStore';

export default function Layout() {
  const setOpen = useUploadModal(s => s.setOpen);
  return (
    <>
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
      <UploadModal />
      <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="floating-wa">💬</a>
      <button onClick={() => setOpen(true)} className="floating-upload" title="Upload Prescription">📄</button>
      <div className="mobile-bottom-bar">
        <a href="/diagnostics">🔬 Tests</a>
        <a href="/services">📦 Packages</a>
        <a href="/upload-prescription" onClick={e => { e.preventDefault(); setOpen(true); }}>📄 Upload</a>
        <a href="/my-orders">🧾 Orders</a>
      </div>
    </>
  );
}
