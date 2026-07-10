import { useState } from 'react';
import { Link } from 'react-router-dom';
import { packageList } from '../data/healthPackages';

const VACCINE_CATEGORIES = [
  { icon: '👶', name: 'Childhood Vaccines', desc: 'BCG, Polio, DPT, MMR, Hepatitis B & more as per IAP schedule', age: '0–12 years', color: '#2563eb' },
  { icon: '🧑', name: 'Adult Vaccines', desc: 'Typhoid, Hepatitis A/B, HPV, Shingles, Pneumococcal', age: '18–65 years', color: '#059669' },
  { icon: '✈️', name: 'Travel Vaccines', desc: 'Yellow Fever, Typhoid, Hepatitis A, Meningococcal, Cholera', age: 'All ages', color: '#d97706' },
  { icon: '🌿', name: 'Seasonal Vaccines', desc: 'Influenza (Flu), COVID-19 boosters, H1N1', age: '6 months+', color: '#7c3aed' },
  { icon: '🤰', name: 'Pregnancy Vaccines', desc: 'Tdap, Influenza, COVID-19 (safe during pregnancy)', age: 'Pregnant women', color: '#db2777' },
  { icon: '🧓', name: 'Senior Vaccines', desc: 'Pneumococcal, Shingles, Influenza, Tdap booster', age: '60+ years', color: '#dc2626' },
];

const POPULAR_VACCINES = [
  { name: 'Influenza (Flu)', schedule: 'Annual', price: 899, doses: 1, age: '6 months+' },
  { name: 'Typhoid', schedule: 'Every 3 years', price: 499, doses: 1, age: '2 years+' },
  { name: 'Hepatitis A', schedule: '2 doses, 6 months apart', price: 1299, doses: 2, age: '1 year+' },
  { name: 'Hepatitis B', schedule: '3 doses over 6 months', price: 599, doses: 3, age: 'Birth+' },
  { name: 'MMR', schedule: '2 doses, 4 weeks apart', price: 799, doses: 2, age: '12 months+' },
  { name: 'HPV (Cervical Cancer)', schedule: '2-3 doses over 6 months', price: 3499, doses: 3, age: '9–45 years' },
  { name: 'Pneumococcal', schedule: 'Single dose / booster at 65', price: 2499, doses: 1, age: '65+ / high risk' },
  { name: 'Shingles (Herpes Zoster)', schedule: '2 doses, 2-6 months apart', price: 4999, doses: 2, age: '50+' },
  { name: 'Tdap (Tetanus + Pertussis)', schedule: 'Booster every 10 years', price: 599, doses: 1, age: '11 years+' },
  { name: 'Yellow Fever', schedule: 'Single dose, lifetime', price: 1999, doses: 1, age: '9 months+' },
  { name: 'Meningococcal', schedule: 'Single dose / booster', price: 1799, doses: 1, age: '11–18 years' },
  { name: 'Chickenpox (Varicella)', schedule: '2 doses, 4-8 weeks apart', price: 1499, doses: 2, age: '12 months+' },
];

const STEPS = [
  { icon: '📅', title: 'Book Your Slot', desc: 'Choose your preferred vaccine and pick a convenient date & time.' },
  { icon: '👨‍⚕️', title: 'Trained Nurse Visits', desc: 'A qualified nurse arrives at your doorstep with the vaccine in a cold chain.' },
  { icon: '💉', title: 'Vaccination Done', desc: 'Vaccine administered safely at home. Certificate provided immediately.' },
  { icon: '📱', title: 'Follow-up Reminder', desc: 'Get SMS/app reminders for the next dose and booster schedules.' },
];

const FAQS = [
  { q: 'Is vaccination at home safe?', a: 'Yes. Our trained nurses follow strict clinical protocols. Vaccines are transported in cold-chain conditions and administered with full aseptic precautions.' },
  { q: 'Which vaccines can I get at home?', a: 'All major vaccines — childhood (IAP schedule), adult, travel, seasonal (flu), and pregnancy vaccines. Some live vaccines may require a clinic visit.' },
  { q: 'Do you provide vaccination certificates?', a: 'Yes, a digital vaccination certificate is provided after each dose. Travel vaccines include the International Certificate of Vaccination (Yellow Card) where applicable.' },
  { q: 'How do I store the vaccine between doses?', a: 'Vaccines are brought fresh for each visit. Multi-dose vaccines are scheduled so you don\'t need to store anything at home.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 4 hours before the appointment. Late cancellations may incur a ₹100 fee.' },
  { q: 'Do you offer corporate vaccination camps?', a: 'Yes! We conduct on-site flu and health vaccination camps for corporates. Bulk discounts available. Contact us for a quote.' },
];

const FOREIGN_KEYS = ['id', 'slug', 'faqId', 'vaccinationId'];

export default function VaccinationAtHome() {
  const [form, setForm] = useState({ name: '', phone: '', vaccine: '', date: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.vaccine) return;
    const bookings = JSON.parse(localStorage.getItem('jh_vaccination_bookings') || '[]');
    bookings.push({ ...form, id: Date.now(), createdAt: new Date().toISOString(), status: 'Requested' });
    localStorage.setItem('jh_vaccination_bookings', JSON.stringify(bookings));
    setSubmitted(true);
    setForm({ name: '', phone: '', vaccine: '', date: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const travelPkg = packageList.filter(p => p.name.toLowerCase().includes('travel'));

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #0891b2 100%)', padding: '48px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 40 }}>💉</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 }}>Vaccination at Home</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '4px 0 0' }}>Safe, certified vaccination at your doorstep — all age groups</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['👶 Childhood', '🧑 Adult', '✈️ Travel', '🌿 Seasonal', '🤰 Pregnancy', '🧓 Senior'].map(tag => (
              <span key={tag} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Vaccine Categories */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Vaccine Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {VACCINE_CATEGORIES.map(c => (
            <div key={c.name} style={{ padding: 18, borderRadius: 14, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{c.name}</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px', lineHeight: 1.4 }}>{c.desc}</p>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${c.color}15`, color: c.color, fontWeight: 600 }}>{c.age}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="page-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.title} style={{ textAlign: 'center', padding: 20, background: '#fff', borderRadius: 14, position: 'relative' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, margin: '0 auto 10px' }}>{i + 1}</div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Vaccines + Pricing */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Popular Vaccines & Pricing</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Prices include vaccine cost + nurse visit + certificate. Free home delivery.</p>
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 650 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Vaccine</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Schedule</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Doses</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Age</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Price/dose</th>
              </tr>
            </thead>
            <tbody>
              {POPULAR_VACCINES.map(v => (
                <tr key={v.name} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{v.name}</td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 11 }}>{v.schedule}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#475569' }}>{v.doses}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', color: '#475569', fontSize: 11 }}>{v.age}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>₹{v.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Form */}
      <div className="page-section" style={{ background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Request Vaccination at Home</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px', textAlign: 'center' }}>Fill in your details and we\'ll call you to confirm the appointment.</p>
          {submitted ? (
            <div style={{ padding: 24, background: '#dcfce7', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#166534' }}>Request Submitted!</h3>
              <p style={{ fontSize: 12, color: '#166534', margin: 0 }}>We\'ll contact you shortly to confirm your vaccination appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Your Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Phone Number *</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile" type="tel" pattern="[0-9]{10}" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Vaccine Needed *</label>
                <select required value={form.vaccine} onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">— Select Vaccine —</option>
                  {POPULAR_VACCINES.map(v => <option key={v.name} value={v.name}>{v.name} (₹{v.price}/dose)</option>)}
                  <option value="other">Other (specify in message)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Preferred Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} min={new Date().toISOString().slice(0, 10)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>For Whom</label>
                  <select value={form.forWhom || ''} onChange={e => setForm(f => ({ ...f, forWhom: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Select</option>
                    <option value="self">Self</option>
                    <option value="child">My Child</option>
                    <option value="parent">My Parent</option>
                    <option value="elderly">Elderly Family Member</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Additional Notes</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={2} placeholder="Any specific requirements or medical conditions..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>📩 Submit Request</button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="page-section container" style={{ maxWidth: 700 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {FAQS.map(f => (
            <div key={f.q} style={{ borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <button onClick={() => setExpandedFaq(expandedFaq === f.q ? null : f.q)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontFamily: 'inherit', textAlign: 'left' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{f.q}</span>
                <span style={{ fontSize: 16, color: '#94a3b8', transition: 'transform 0.2s', transform: expandedFaq === f.q ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>
              {expandedFaq === f.q && (
                <div style={{ padding: '0 16px 12px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Travel Packages */}
      {travelPkg.length > 0 && (
        <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Related Health Packages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {travelPkg.slice(0, 3).map(p => (
              <Link key={p.id} to={`/package/${p.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', borderTop: `3px solid ${p.color || '#2563eb'}` }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon || '✈️'}</div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{p.name}</h3>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>{p.description?.slice(0, 100)}...</p>
                  <div style={{ fontWeight: 700, color: '#059669', fontSize: 14 }}>₹{p.offerPrice}
                    <span style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through', marginLeft: 6 }}>₹{p.mrp}</span>
                    <span style={{ fontSize: 10, color: '#059669', marginLeft: 6 }}>{p.discount}% off</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .page-section { padding: 24px 16px !important; }
        }
      `}</style>
    </div>
  );
}
