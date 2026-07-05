import { Outlet, Link } from 'react-router-dom';
import { WhatsappLogo, Phone, CalendarDots } from '@phosphor-icons/react';
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

      {/* Mobile Sticky Bottom Bar */}
      <div className="mobile-bottom-bar">
        <a href="tel:+919700104108">
          <Phone size={20} weight="fill" />
          <span>Call Now</span>
        </a>
        <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer">
          <WhatsappLogo size={20} weight="fill" />
          <span>WhatsApp</span>
        </a>
        <Link to="/book-appointment" className="mbb-cta">
          <CalendarDots size={18} weight="fill" />
          <span>Book Now</span>
        </Link>
      </div>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 9999,
        width: 52, height: 52, borderRadius: '50%',
        background: '#25d366', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.4)'; }}
      >
        <WhatsappLogo size={26} weight="fill" />
      </a>
    </>
  );
}
