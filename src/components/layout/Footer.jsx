import { Link } from 'react-router-dom';
import { useState } from 'react';
import useUploadModal from '../../stores/uploadModalStore';

const socialLinks = [
  { label: 'Facebook', url: 'https://facebook.com/jeevanhealthcare', icon: 'f' },
  { label: 'Instagram', url: '#', icon: '📷' },
  { label: 'LinkedIn', url: '#', icon: 'in' },
  { label: 'YouTube', url: '#', icon: '▶' },
  { label: 'X (Twitter)', url: '#', icon: '𝕏' },
];

const sections = [
  { key: 'services', label: 'Services', links: [
    { label: 'Lab Tests', path: '/diagnostics' },
    { label: 'Health Packages', path: '/services' },
    { label: 'Doctor Consultation', path: '/consult-doctor' },
    { label: 'Medicine Delivery', path: '/services' },
    { label: 'Pharmacy', path: '/services' },
    { label: 'Home Sample Collection', path: '/diagnostics' },
    { label: 'Home Nursing', path: '/services' },
    { label: 'Caregiver Services', path: '/services' },
    { label: 'Physiotherapy', path: '/services' },
    { label: 'Corporate Health Checkups', path: '/services' },
    { label: 'Health Camps', path: '/contact' },
  ]},
  { key: 'tests', label: 'Popular Tests', links: [
    { label: 'CBC Test', path: '/test/complete-blood-count-cbc' },
    { label: 'HbA1c Test', path: '/test/hba1c' },
    { label: 'Thyroid Profile', path: '/test/thyroid-profile-t3-t4-tsh' },
    { label: 'Lipid Profile', path: '/test/lipid-profile' },
    { label: 'Liver Function Test', path: '/test/liver-function-test-lft' },
    { label: 'Kidney Function Test', path: '/test/kidney-function-test-kft' },
    { label: 'Vitamin D Test', path: '/test/vitamin-d-25-hydroxy' },
    { label: 'Vitamin B12 Test', path: '/test/vitamin-b12' },
    { label: 'Blood Sugar Test', path: '/test/blood-sugar-fasting' },
    { label: 'Iron Profile', path: '/test/iron-studies' },
  ]},
  { key: 'packages', label: 'Health Packages', links: [
    { label: 'Basic Health Checkup', path: '/package/basic-health-checkup' },
    { label: 'Executive Health Checkup', path: '/package/executive-health-checkup' },
    { label: 'Premium Health Checkup', path: '/package/premium-health-checkup' },
    { label: "Women's Health Package", path: '/package/basic-health-checkup' },
    { label: "Men's Health Package", path: '/package/executive-health-checkup' },
    { label: 'Senior Citizen Package', path: '/package/premium-health-checkup' },
    { label: 'Diabetes Package', path: '/package/premium-health-checkup' },
    { label: 'Heart Health Package', path: '/package/premium-health-checkup' },
    { label: 'Corporate Health Package', path: '/package/executive-health-checkup' },
  ]},
  { key: 'company', label: 'Company', links: [
    { label: 'About Us', path: '/about' },
    { label: 'Careers', path: '/contact' },
    { label: 'Corporate Services', path: '/services' },
    { label: 'Partner With Us', path: '/contact' },
    { label: 'Franchise', path: '/contact' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Health Blog', path: '/blog' },
    { label: 'Health Library', path: '/health-library' },
    { label: 'FAQs', path: '/contact' },
  ]},
  { key: 'legal', label: 'Legal', links: [
    { label: 'Privacy Policy', path: '/policy/privacy-policy' },
    { label: 'Terms & Conditions', path: '/policy/terms-and-conditions' },
    { label: 'Refund Policy', path: '/policy/refund-policy' },
    { label: 'Cancellation Policy', path: '/policy/cancellation-policy' },
    { label: 'Shipping Policy', path: '/policy/shipping-policy' },
    { label: 'Cookie Policy', path: '/policy/cookie-policy' },
    { label: 'Disclaimer', path: '/policy/disclaimer' },
    { label: 'Data Protection', path: '/policy/data-protection' },
  ]},
  { key: 'tools', label: 'Health Tools', links: [
    { label: 'BMI Calculator', path: '/health-tool/bmi-calculator' },
    { label: 'BMR Calculator', path: '/health-tool/bmr-calculator' },
    { label: 'Diabetes Risk', path: '/health-tool/diabetes-risk-calculator' },
    { label: 'Heart Risk', path: '/health-tool/heart-risk-calculator' },
    { label: 'Ideal Weight', path: '/health-tool/ideal-weight-calculator' },
    { label: 'Bone Health', path: '/health-tool/bone-health-calculator' },
  ]},
];

const cities = [
  'Hyderabad', 'Secunderabad', 'Bengaluru', 'Vijayawada', 'Warangal',
  'Karimnagar', 'Nizamabad', 'Khammam', 'Nalgonda', 'Guntur',
  'Kurnool', 'Kadapa', 'Rajahmundry', 'Tirupati', 'Visakhapatnam',
  'Amaravati', 'Anantapur', 'Eluru', 'Ongole', 'Srikakulam',
];

const trustBadges = [
  'NABL Partner Labs', 'Certified Professionals', '100% Secure Payments',
  'Data Privacy Protected', 'Digital Reports', 'Home Collection Available',
  'Doctor Verified', 'Trusted by 100000+ Patients',
];

const paymentMethods = [
  'Visa', 'MasterCard', 'RuPay', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Net Banking',
];

const linkStyle = {
  display: 'block',
  padding: '2px 0',
  fontSize: 12,
  textDecoration: 'none',
  transition: 'color 0.15s, padding-left 0.15s',
  lineHeight: 1.8,
};

function CollapsibleSection({ section, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 4 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, letterSpacing: 0.3, marginBottom: open ? 6 : 0, textAlign: 'left' }}>
        {section.label}
        <span style={{ fontSize: 16, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
      </button>
      {open && section.links.map(l => (
        <Link key={l.label} to={l.path} style={linkStyle}>{l.label}</Link>
      ))}
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ fontSize: 13 }}>
      {/* ===== PRE-FOOTER CTA ===== */}
      <div style={{ background: 'linear-gradient(135deg, #1866C9 0%, #00D9FF 100%)', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Ready to Book Your Health Checkup?</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
            Book Lab Tests · Home Collection · Doctor Consultation · Digital Reports
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" style={{ background: '#fff', color: '#1866C9', fontWeight: 700, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
              Book Lab Test
            </Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, padding: '12px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
              Upload Prescription
            </button>
          </div>
        </div>
      </div>

      {/* ===== MAIN FOOTER — brand color combo sections ===== */}
      {/* Top band — brand identity */}
      <div style={{ background: 'linear-gradient(135deg, #0F4A96 0%, #1866C9 100%)', color: 'rgba(255,255,255,0.85)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>Jeevan HealthCare at Home</h3>
              <p style={{ fontSize: 12, margin: '4px 0 0', color: 'rgba(255,255,255,0.65)' }}>Your trusted healthcare partner since 2010</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener" title={s.label}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', textDecoration: 'none', transition: 'background 0.2s' }}>
                  {s.icon === 'f' ? <span style={{ fontWeight: 700 }}>f</span> : s.icon === 'in' ? <span style={{ fontWeight: 700 }}>in</span> : <span>{s.icon}</span>}
                </a>
              ))}
            </div>
          </div>

          {/* Trust badges + rating */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: '#FFD54F' }}>★★★★★</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Google Rating</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>👥 100000+ Patients</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>|</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>⭐ 15+ Years</span>
          </div>

          {/* Collapsible link sections — 3-column on desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            {sections.map(s => (
              <div key={s.key} className="ft-collapse">
                <CollapsibleSection section={s} defaultOpen={true} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MID BAND — Contact + App + Newsletter ===== */}
      <div style={{ background: '#0A3D7A', color: 'rgba(255,255,255,0.8)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {/* Contact */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: 0.3 }}>Contact Us</h4>
              <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                <div><strong style={{ color: '#fff' }}>24×7 Customer Care</strong><br /><a href="tel:+919700104108" style={{ color: '#FFD54F', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>+91 97001 04108</a></div>
                <div style={{ marginTop: 6 }}><strong style={{ color: '#fff' }}>Email</strong><br /><a href="mailto:care@jeevanhealthcare.com" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>care@jeevanhealthcare.com</a></div>
                <div style={{ marginTop: 6 }}><strong style={{ color: '#fff' }}>WhatsApp</strong><br /><a href="https://wa.me/919700104108" target="_blank" rel="noopener" style={{ color: '#25d366', textDecoration: 'none' }}>Chat with Executive</a></div>
                <div style={{ marginTop: 6 }}><strong style={{ color: '#fff' }}>Corporate Office</strong><br /><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Jeevan HealthCare at Home Solutions Pvt. Ltd., Hyderabad</span></div>
              </div>
            </div>

            {/* Download App */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: 0.3 }}>Download App</h4>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Book Tests · View Reports · Track Orders · Health Wallet</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a href="#" style={{ padding: '8px 14px', background: '#000', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>▶ Google Play</a>
                <a href="#" style={{ padding: '8px 14px', background: '#000', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>🍎 App Store</a>
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '16px 0 8px', letterSpacing: 0.3 }}>Trust Badges</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {trustBadges.map(b => (
                  <span key={b} style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 6, color: 'rgba(255,255,255,0.75)' }}>✓ {b}</span>
                ))}
              </div>
            </div>

            {/* Newsletter + Payment + Language */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: 0.3 }}>Stay Updated</h4>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>Health tips, offers & wellness updates</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={() => { if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); } }} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #00D9FF, #00B8D6)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Subscribe</button>
              </div>
              {subscribed && <div style={{ fontSize: 12, color: '#22C55E', marginBottom: 10 }}>✓ Subscribed successfully!</div>}
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '10px 0 6px', letterSpacing: 0.3 }}>Payment Methods</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {paymentMethods.map(m => (
                  <span key={m} style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4, color: 'rgba(255,255,255,0.7)' }}>{m}</span>
                ))}
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '10px 0 6px', letterSpacing: 0.3 }}>Language</h4>
              <select style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 12, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
                <option value="en" style={{ color: '#000' }}>English</option>
                <option value="hi" style={{ color: '#000' }}>हिन्दी</option>
                <option value="te" style={{ color: '#000' }}>తెలుగు</option>
                <option value="kn" style={{ color: '#000' }}>ಕನ್ನಡ</option>
                <option value="ta" style={{ color: '#000' }}>தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CITIES ===== */}
      <div style={{ background: '#0A3D7A', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px' }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: 0.3 }}>Cities We Serve</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cities.map(c => (
              <Link key={c} to={`/diagnostics?city=${encodeURIComponent(c)}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '1px 6px', whiteSpace: 'nowrap' }}>{c}</Link>
            ))}
            <span style={{ fontSize: 11, color: '#00D9FF' }}>And more...</span>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div style={{ background: '#072D5C', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
            <Link to="/policy/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <Link to="/policy/terms-and-conditions" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms & Conditions</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <Link to="/policy/refund-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Refund Policy</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <Link to="/policy/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Sitemap</Link>
          </div>
          <div>© {new Date().getFullYear()} Jeevan HealthCare at Home Solutions Pvt. Ltd. All Rights Reserved.</div>
          <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.3)' }}>Made with ❤️ for Better Healthcare</div>
        </div>
      </div>

      {/* Back to Top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ position: 'fixed', bottom: 80, right: 16, width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Back to top">↑</button>

      <style>{`
        .ft-col-links a:hover, .ft-collapse a:hover {
          color: #00D9FF !important;
          padding-left: 4px;
        }
        @media (max-width: 768px) {
          .ft-collapse .ft-col-links { column-count: 2 !important; }
          .ft-collapse a { padding: 4px 0 !important; }
          .ft-collapse button { padding: 10px 0 !important; }
        }
      `}</style>
    </footer>
  );
}