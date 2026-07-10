import { useState } from 'react';
import { Link } from 'react-router-dom';

const CORPORATE_KEY = 'jh_corporate_vaccination';

const programs = [
  { id: 'flu', icon: '💉', name: 'Employee Flu Vaccination Camp', desc: 'Annual flu shots for your workforce. Reduce absenteeism by up to 40%.', price: '₹699/person', minEmployees: 20, badge: 'Popular' },
  { id: 'covid-booster', icon: '🛡️', name: 'COVID Booster Camp', desc: 'Booster doses for all employees. On-site or at-home options.', price: '₹599/person', minEmployees: 10, badge: 'Essential' },
  { id: 'wellness', icon: '🌿', name: 'Employee Wellness Vaccination', desc: 'Complete immunization program including flu, typhoid, hepatitis, and tetanus.', price: '₹2,499/person', minEmployees: 20, badge: 'Comprehensive' },
  { id: 'workplace', icon: '🏢', name: 'Workplace Immunization Drive', desc: 'Custom vaccination program tailored to your industry and workforce demographics.', price: 'Custom Quote', minEmployees: 50, badge: 'Custom' },
];

const initialForm = { company: '', name: '', email: '', phone: '', employees: '', program: '', location: '', date: '', notes: '' };

export default function CorporateVaccination() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [enquiries, setEnquiries] = useState([]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company || !form.name || !form.phone || !form.program) return;
    const enquiry = { ...form, id: 'CORP-' + Date.now().toString(36).toUpperCase(), createdAt: new Date().toISOString(), status: 'New' };
    const list = JSON.parse(localStorage.getItem(CORPORATE_KEY) || '[]');
    list.push(enquiry);
    localStorage.setItem(CORPORATE_KEY, JSON.stringify(list));
    setEnquiries(list);
    setSubmitted(true);
    setForm(initialForm);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>🏢</span>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Corporate Vaccination Programs</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 auto 16px', maxWidth: 500 }}>
            Protect your workforce with on-site vaccination camps. Boost productivity, reduce absenteeism, and ensure employee well-being.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {['🏆 150+ Corporate Clients', '💉 50,000+ Vaccines Administered', '📋 Digital Reports', '🏠 On-site Service'].map(b => (
              <span key={b} style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 600 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Our Corporate Programs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {programs.map(p => (
            <div key={p.id} style={{ padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', borderTop: `3px solid #2563eb` }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{p.name}</h3>
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: '#EFF6FF', color: '#2563eb', fontWeight: 700 }}>{p.badge}</span>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }}>{p.desc}</p>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#059669', marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>Min. {p.minEmployees} employees</div>
              <button onClick={() => { setForm(f => ({ ...f, program: p.id })); document.getElementById('corp-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>
                Enquire Now →</button>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="page-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>How Corporate Vaccination Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { n: '1', icon: '📋', t: 'Submit Enquiry', d: 'Tell us your requirements and employee count' },
              { n: '2', icon: '📞', t: 'Get a Call Back', d: 'Our corporate team will reach out within 24 hours' },
              { n: '3', icon: '📅', t: 'Schedule Camp', d: 'Pick a date for on-site vaccination' },
              { n: '4', icon: '💉', t: 'Vaccination Day', d: 'Our team arrives and administers vaccines' },
              { n: '5', icon: '📊', t: 'Receive Report', d: 'Complete vaccination report for your records' },
            ].map(s => (
              <div key={s.n} style={{ textAlign: 'center', padding: 18, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, margin: '0 auto 8px' }}>{s.n}</div>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <h4 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{s.t}</h4>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Form */}
      <div className="page-section container" id="corp-form" style={{ maxWidth: 560 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>Get a Corporate Quote</h2>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16, textAlign: 'center' }}>Fill in your details and our team will contact you within 24 hours</p>
        {submitted ? (
          <div style={{ padding: 24, borderRadius: 12, background: '#dcfce7', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#166534' }}>Enquiry Submitted!</h3>
            <p style={{ fontSize: 12, color: '#166534', margin: 0 }}>Our corporate team will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Company Name *</label><input required value={form.company} onChange={e => update('company', e.target.value)} placeholder="Your company" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Your Name *</label><input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Full name" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Email</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@company.com" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Phone Number *</label><input required type="tel" pattern="[0-9]{10}" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Program *</label><select required value={form.program} onChange={e => update('program', e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}><option value="">Select</option>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Employees *</label><input required type="number" value={form.employees} onChange={e => update('employees', e.target.value)} placeholder="Number of employees" min="1" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Location</label><input value={form.location} onChange={e => update('location', e.target.value)} placeholder="City / Area" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Preferred Date</label><input type="date" value={form.date} onChange={e => update('date', e.target.value)} min={new Date().toISOString().slice(0, 10)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
            </div>
            <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Additional Notes</label><textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Any specific requirements..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} /></div>
            <button type="submit" style={{ height: 48, borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Submit Enquiry →</button>
          </form>
        )}
      </div>

      {/* Benefits */}
      <div className="page-section" style={{ background: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>Why Corporates Choose Jeevan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { icon: '📋', t: 'End-to-End Management', d: 'From employee registration to vaccination certificate - we handle everything.' },
              { icon: '📊', t: 'Digital Reports', d: 'Detailed vaccination reports with employee-wise records for compliance.' },
              { icon: '🏠', t: 'On-Site Service', d: 'Our team comes to your office. No employee travel required.' },
              { icon: '💰', t: 'Bulk Discounts', d: 'Special pricing for corporate clients. GST invoice provided.' },
              { icon: '⚡', t: 'Quick Setup', d: 'Camp can be organized within 3-5 working days.' },
              { icon: '🩺', t: 'Certified Team', d: 'All vaccines administered by trained healthcare professionals.' },
            ].map(b => (
              <div key={b.t} style={{ padding: 16, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{b.t}</h4>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="page-section container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Ready to Protect Your Workforce?</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Get a free consultation and customized quote for your organization.</p>
        <a href="https://wa.me/919700104108?text=Hi%2C%20I%27m%20interested%20in%20corporate%20vaccination%20for%20my%20company" target="_blank" rel="noopener noreferrer"
          style={{ height: 48, padding: '0 32px', borderRadius: 8, border: 'none', background: '#25d366', color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', cursor: 'pointer' }}>
          💬 Talk to Corporate Team
        </a>
      </div>
    </div>
  );
}
