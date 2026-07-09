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

const services = [
  { label: 'Lab Tests', path: '/diagnostics' },
  { label: 'Health Packages', path: '/services' },
  { label: 'Doctor Consultation', path: '/consult-doctor' },
  { label: 'Medicine Delivery', path: '/services' },
  { label: 'Pharmacy', path: '/services' },
  { label: 'Home Sample Collection', path: '/diagnostics' },
  { label: 'Home Nursing', path: '/services' },
  { label: 'Caregiver Services', path: '/services' },
  { label: 'Physiotherapy', path: '/services' },
  { label: 'Vaccination', path: '/services' },
  { label: 'Medical Equipment Rental', path: '/services' },
  { label: 'Home ICU', path: '/services' },
  { label: 'ECG at Home', path: '/services' },
  { label: 'X-Ray at Home', path: '/services' },
  { label: 'EEG at Home', path: '/services' },
  { label: 'Corporate Health Checkups', path: '/services' },
  { label: 'Occupational Health Services', path: '/services' },
  { label: 'Health Camps', path: '/contact' },
  { label: 'Insurance Health Checkups', path: '/services' },
];

const popularTests = [
  { label: 'CBC Test', slug: 'complete-blood-count-cbc' },
  { label: 'HbA1c Test', slug: 'hba1c' },
  { label: 'Blood Sugar Test', slug: 'blood-sugar-fasting' },
  { label: 'Thyroid Profile', slug: 'thyroid-profile-t3-t4-tsh' },
  { label: 'Lipid Profile', slug: 'lipid-profile' },
  { label: 'Liver Function Test', slug: 'liver-function-test-lft' },
  { label: 'Kidney Function Test', slug: 'kidney-function-test-kft' },
  { label: 'Vitamin D Test', slug: 'vitamin-d-25-hydroxy' },
  { label: 'Vitamin B12 Test', slug: 'vitamin-b12' },
  { label: 'Iron Profile', slug: 'iron-studies' },
  { label: 'Ferritin', slug: 'ferritin' },
  { label: 'ESR', slug: 'esr' },
  { label: 'CRP', slug: 'hs-crp' },
  { label: 'Dengue Profile', slug: 'dengue-test' },
  { label: 'Fever Profile', slug: 'fever-profile' },
  { label: 'Pregnancy Test', slug: 'pregnancy-test' },
  { label: 'COVID Test', slug: 'covid-19-rt-pcr' },
  { label: 'Cancer Markers', slug: 'cancer-markers' },
];

const packages = [
  { label: 'Basic Health Checkup', slug: 'basic-health-checkup' },
  { label: 'Executive Health Checkup', slug: 'executive-health-checkup' },
  { label: 'Premium Health Checkup', slug: 'premium-health-checkup' },
  { label: 'Complete Body Checkup', slug: 'executive-health-checkup' },
  { label: "Women's Health Package", slug: 'basic-health-checkup' },
  { label: "Men's Health Package", slug: 'executive-health-checkup' },
  { label: 'Senior Citizen Package', slug: 'premium-health-checkup' },
  { label: 'Diabetes Package', slug: 'premium-health-checkup' },
  { label: 'Heart Health Package', slug: 'premium-health-checkup' },
  { label: 'Thyroid Package', slug: 'basic-health-checkup' },
  { label: 'Kidney Package', slug: 'basic-health-checkup' },
  { label: 'Liver Package', slug: 'basic-health-checkup' },
  { label: 'Pre-Employment Package', slug: 'basic-health-checkup' },
  { label: 'Corporate Health Package', slug: 'executive-health-checkup' },
];

const categories = [
  'Blood Tests', 'Diabetes Tests', 'Heart Tests', 'Liver Tests', 'Kidney Tests',
  'Hormone Tests', 'Vitamin Tests', 'Cancer Screening', 'Allergy Tests',
  "Women's Health", "Men's Health", 'Pregnancy Tests', 'Fertility Tests',
  'Infectious Disease Tests', 'Genetic Tests', 'Preventive Health',
  'Lifestyle Disorders', 'Microbiology', 'Pathology',
];

const homeCollection = [
  { label: 'Book Home Collection', path: '/diagnostics' },
  { label: 'Schedule Appointment', path: '/diagnostics' },
  { label: 'Same Day Collection', path: '/diagnostics' },
  { label: 'Early Morning Collection', path: '/diagnostics' },
  { label: 'Senior Citizen Services', path: '/services' },
  { label: 'Corporate Collection', path: '/services' },
  { label: 'Upload Prescription', path: '/upload-prescription' },
  { label: 'Track Booking', path: '/my-orders' },
  { label: 'Download Reports', path: '/dashboard' },
];

const offers = [
  { label: "Today's Offers", path: '/diagnostics' },
  { label: 'Up to 60% OFF', path: '/diagnostics' },
  { label: 'Health Checkup Discounts', path: '/services' },
  { label: 'Corporate Discounts', path: '/services' },
  { label: 'Family Packages', path: '/services' },
  { label: 'Membership Plans', path: '/services' },
  { label: 'Cashback Offers', path: '/diagnostics' },
  { label: 'Refer & Earn', path: '/contact' },
];

const resources = [
  { label: 'Health Blog', path: '/blog' },
  { label: 'Health Library', path: '/health-library' },
  { label: 'Health Articles', path: '/blog' },
  { label: 'FAQs', path: '/contact' },
  { label: 'Diseases A–Z', path: '/health-library' },
  { label: 'Symptoms A–Z', path: '/health-library' },
  { label: 'Lab Tests A–Z', path: '/health-library' },
  { label: 'Normal Values', path: '/health-library' },
  { label: 'Health Tips', path: '/blog' },
  { label: 'Preparation Guides', path: '/health-library' },
  { label: 'Medical Glossary', path: '/health-library' },
  { label: 'BMI Calculator', path: '/health-tool/bmi-calculator' },
  { label: 'BMR Calculator', path: '/health-tool/bmr-calculator' },
  { label: 'Diabetes Risk Calculator', path: '/health-tool/diabetes-risk-calculator' },
  { label: 'Heart Risk Calculator', path: '/health-tool/heart-risk-calculator' },
];

const company = [
  { label: 'About Jeevan Healthcare', path: '/about' },
  { label: 'Our Story', path: '/about' },
  { label: 'Mission & Vision', path: '/about' },
  { label: 'Leadership Team', path: '/about' },
  { label: 'Careers', path: '/contact' },
  { label: 'Life at Jeevan', path: '/contact' },
  { label: 'Corporate Services', path: '/services' },
  { label: 'Partner With Us', path: '/contact' },
  { label: 'Franchise', path: '/contact' },
  { label: 'Media', path: '/contact' },
  { label: 'News', path: '/contact' },
  { label: 'Testimonials', path: '/' },
  { label: 'Contact Us', path: '/contact' },
];

const legal = [
  { label: 'Privacy Policy', path: '/policy/privacy-policy' },
  { label: 'Terms & Conditions', path: '/policy/terms-and-conditions' },
  { label: 'Refund Policy', path: '/policy/refund-policy' },
  { label: 'Cancellation Policy', path: '/policy/cancellation-policy' },
  { label: 'Shipping Policy', path: '/policy/shipping-policy' },
  { label: 'Cookie Policy', path: '/policy/cookie-policy' },
  { label: 'Disclaimer', path: '/policy/disclaimer' },
  { label: 'Patient Rights', path: '/policy/patient-rights' },
  { label: 'Data Protection', path: '/policy/data-protection' },
  { label: 'Consent Policy', path: '/policy/consent-policy' },
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
  'Visa', 'MasterCard', 'RuPay', 'UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Net Banking', 'Cash on Collection',
];

function FooterLink({ children, ...props }) {
  if (props.to) {
    return <Link to={props.to} style={linkStyle}>{children}</Link>;
  }
  if (props.href) {
    return <a href={props.href} target={props.target || '_self'} rel={props.rel || ''} style={linkStyle}>{children}</a>;
  }
  if (props.onClick) {
    return <button onClick={props.onClick} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: 'inherit' }}>{children}</button>;
  }
  return <span style={{ ...linkStyle, cursor: 'default' }}>{children}</span>;
}

const linkStyle = {
  display: 'block',
  padding: '3px 0',
  color: 'rgba(255,255,255,0.7)',
  fontSize: 12,
  textDecoration: 'none',
  transition: 'color 0.2s, padding-left 0.2s',
};

function FooterHeading({ children }) {
  return (
    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: 0.3 }}>
      {children}
    </h4>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer style={{ background: '#0F4A96', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
      {/* PRE-FOOTER CTA */}
      <div style={{ background: 'linear-gradient(135deg, #1866C9 0%, #00D9FF 100%)', padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Ready to Book Your Health Checkup?</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>
            Book Lab Tests · Home Collection · Doctor Consultation · Digital Reports
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#fff', color: '#1866C9', fontWeight: 700, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
              Book Lab Test
            </Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, padding: '12px 28px', borderRadius: 10, border: '2px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
              Upload Prescription
            </button>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER GRID */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px 20px' }}>
        <div className="mega-footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr',
          gap: '28px 24px',
        }}>
          {/* COL 1: Company + Social + Trust */}
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>🏥 Jeevan Healthcare</h3>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
              Your trusted healthcare partner providing diagnostics, home healthcare, doctor consultation, pharmacy, preventive health checkups and corporate wellness services.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <span style={{ color: '#FFD54F', fontSize: 14 }}>★★★★★</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Google Rating</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, marginBottom: 12 }}>
              <span>👥 100000+ Patients</span>
              <span>⭐ 15+ Years</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {socialLinks.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener" title={s.label}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', textDecoration: 'none', transition: 'background 0.2s' }}>
                  {s.icon === 'f' ? <span style={{ fontWeight: 700 }}>f</span> : s.icon === 'in' ? <span style={{ fontWeight: 700 }}>in</span> : <span>{s.icon}</span>}
                </a>
              ))}
            </div>
            {/* Trust Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {trustBadges.map(b => (
                <span key={b} style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 6, color: 'rgba(255,255,255,0.75)' }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* COL 2: Services + Popular Tests */}
          <div>
            <FooterHeading>Services</FooterHeading>
            <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
              {services.map(s => (
                <FooterLink key={s.label} to={s.path}>{s.label}</FooterLink>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <FooterHeading>Popular Lab Tests</FooterHeading>
              <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
                {popularTests.map(t => (
                  <FooterLink key={t.label} to={`/test/${t.slug}`}>{t.label}</FooterLink>
                ))}
              </div>
            </div>
          </div>

          {/* COL 3: Packages + Categories + Offers + Home Collection */}
          <div>
            <FooterHeading>Health Packages</FooterHeading>
            <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
              {packages.map(p => (
                <FooterLink key={p.label} to={`/package/${p.slug}`}>{p.label}</FooterLink>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <FooterHeading>Test Categories</FooterHeading>
              <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
                {categories.map(c => (
                  <FooterLink key={c} to={`/diagnostics?cat=${encodeURIComponent(c)}`}>{c}</FooterLink>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <FooterHeading>Home Collection</FooterHeading>
              <div className="ft-col-links">
                {homeCollection.map(h => (
                  <FooterLink key={h.label} to={h.path}>{h.label}</FooterLink>
                ))}
              </div>
            </div>
          </div>

          {/* COL 4: Offers + Resources + Company + Legal + Contact + App */}
          <div>
            <FooterHeading>Offers</FooterHeading>
            <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
              {offers.map(o => (
                <FooterLink key={o.label} to={o.path}>{o.label}</FooterLink>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <FooterHeading>Health Resources</FooterHeading>
              <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
                {resources.map(r => (
                  <FooterLink key={r.label} to={r.path}>{r.label}</FooterLink>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <FooterHeading>Company</FooterHeading>
              <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
                {company.map(c => (
                  <FooterLink key={c.label} to={c.path}>{c.label}</FooterLink>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <FooterHeading>Legal</FooterHeading>
              <div className="ft-col-links" style={{ columnCount: 2, columnGap: 12 }}>
                {legal.map(l => (
                  <FooterLink key={l.label} to={l.path}>{l.label}</FooterLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT + APP + PAYMENTS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Contact */}
          <div>
            <FooterHeading>📞 Contact Us</FooterHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>Customer Care (24×7)</div>
                <a href="tel:+919700104108" style={{ color: '#FFD54F', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>+91 97001 04108</a>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>Email</div>
                <a href="mailto:care@jeevanhealthcare.com" style={{ color: 'rgba(255,255,255,0.8)' }}>care@jeevanhealthcare.com</a>
                <br /><a href="mailto:bookings@jeevanhealthcare.com" style={{ color: 'rgba(255,255,255,0.8)' }}>bookings@jeevanhealthcare.com</a>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>WhatsApp</div>
                <a href="https://wa.me/919700104108" target="_blank" rel="noopener" style={{ color: '#25d366' }}>Chat with Executive</a>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>Corporate Office</div>
                <div style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.6)' }}>
                  Jeevan Healthcare Solutions Pvt. Ltd.<br />
                  Hyderabad, Telangana, India
                </div>
                <a href="https://maps.google.com/?q=Jeevan+Healthcare+Hyderabad" target="_blank" rel="noopener" style={{ color: '#FFD54F', fontSize: 11 }}>🗺 View on Google Maps</a>
              </div>
            </div>
          </div>

          {/* Download App + Payment Methods */}
          <div>
            <FooterHeading>📱 Download App</FooterHeading>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
              Book Tests · View Reports · Track Orders · Manage Family · Health Wallet
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <a href="#" style={{ padding: '8px 14px', background: '#000', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>▶</span> Google Play
              </a>
              <a href="#" style={{ padding: '8px 14px', background: '#000', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>🍎</span> App Store
              </a>
            </div>
            <FooterHeading>Payment Methods</FooterHeading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {paymentMethods.map(m => (
                <span key={m} style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 4, color: 'rgba(255,255,255,0.7)' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Newsletter + Quick Search + Recently Viewed */}
          <div>
            <FooterHeading>Stay Updated</FooterHeading>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 10 }}>
              Receive health tips, offers and wellness updates.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
              />
              <button
                onClick={() => { if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); } }}
                style={{ padding: '8px 16px', background: '#FFD54F', color: '#0F4A96', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Subscribe
              </button>
            </div>
            {subscribed && <div style={{ fontSize: 12, color: '#22C55E', marginBottom: 10 }}>✓ Subscribed successfully!</div>}
            <FooterHeading>Popular Searches</FooterHeading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {['CBC Test', 'HbA1c', 'Vitamin D', 'Thyroid', 'Lipid Profile'].map(s => (
                <Link key={s} to={`/test/${s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                  style={{ fontSize: 10, background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 6, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
                  {s}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <FooterHeading>Language</FooterHeading>
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

        {/* CITIES SERVED */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <FooterHeading>📍 Cities We Serve</FooterHeading>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {cities.map(c => (
              <Link key={c} to={`/diagnostics?city=${encodeURIComponent(c)}`}
                style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', padding: '1px 6px', whiteSpace: 'nowrap' }}>
                {c}
              </Link>
            ))}
            <span style={{ fontSize: 11, color: '#FFD54F' }}>And more...</span>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
            <Link to="/policy/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Privacy Policy</Link>
            <span>|</span>
            <Link to="/policy/terms-and-conditions" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Terms & Conditions</Link>
            <span>|</span>
            <Link to="/policy/refund-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Refund Policy</Link>
            <span>|</span>
            <Link to="/policy/privacy-policy" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Sitemap</Link>
          </div>
          <div>© {new Date().getFullYear()} Jeevan Healthcare Solutions Private Limited. All Rights Reserved.</div>
          <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.3)' }}>Made with ❤️ for Better Healthcare</div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          .mega-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .mega-footer-grid { grid-template-columns: 1fr !important; }
          .ft-col-links { column-count: 1 !important; }
        }
        .ft-col-links a:hover, .ft-col-links button:hover {
          color: #fff !important;
          padding-left: 4px;
        }
      `}</style>
    </footer>
  );
}
