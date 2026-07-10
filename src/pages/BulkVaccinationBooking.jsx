import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vaccines, vaccineCategories } from '../data/vaccinationData';

const BULK_KEY = 'jh_bulk_vaccination';

export default function BulkVaccinationBooking() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    organization: '', contactName: '', email: '', phone: '',
    address: '', city: '', pincode: '',
    category: '', vaccineIds: [], participants: 10,
    preferredDate: '', preferredTime: '', notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleVaccine = (id) => {
    const list = form.vaccineIds.includes(id) ? form.vaccineIds.filter(x => x !== id) : [...form.vaccineIds, id];
    update('vaccineIds', list);
  };

  const selectedVaccines = vaccines.filter(v => form.vaccineIds.includes(v.id));
  const filteredVaccines = form.category ? vaccines.filter(v => v.category === form.category) : vaccines;

  const handleSubmit = () => {
    const entry = { ...form, id: 'bulk-' + Date.now().toString(36), status: 'Pending', createdAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem(BULK_KEY) || '[]');
    existing.push(entry);
    localStorage.setItem(BULK_KEY, JSON.stringify(existing));
    setSubmitted(true);
  };

  const totalCost = selectedVaccines.reduce((sum, v) => sum + v.price * form.participants, 0);

  if (submitted) {
    return (
      <div className="page-section container" style={{ maxWidth: 600, textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>Request Submitted!</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 4px' }}>Your bulk vaccination request has been received.</p>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 24px' }}>We will contact {form.contactName} at {form.phone} or {form.email} within 24 hours.</p>
        <Link to="/vaccination" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>← Back to Vaccination</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #059669 0%, #059669cc 100%)', padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/vaccination" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← Back to Vaccination</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>🏥</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>Bulk Vaccination Booking</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>For schools, offices, housing societies, and events</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step >= s ? '#fff' : 'rgba(255,255,255,0.2)', color: step >= s ? '#059669' : 'rgba(255,255,255,0.7)' }}>{s}</div>
                <span style={{ fontSize: 11, color: step >= s ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: step >= s ? 700 : 400 }}>{s === 1 ? 'Organization' : s === 2 ? 'Vaccines' : 'Confirm'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20, maxWidth: 700 }}>
        {step === 1 && (
          <div style={{ padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: '#0f172a' }}>Organization Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Organization / School / Society Name *</label>
                  <input value={form.organization} onChange={e => update('organization', e.target.value)} placeholder="e.g. Sunshine School, Green Valley Society"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Contact Person *</label>
                <input value={form.contactName} onChange={e => update('contactName', e.target.value)} placeholder="Full name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Phone Number *</label>
                <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="10-digit mobile" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Email</label>
                <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="Email address" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>City *</label>
                <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Pincode</label>
                <input value={form.pincode} onChange={e => update('pincode', e.target.value)} placeholder="Pincode" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Address</label>
                  <textarea value={form.address} onChange={e => update('address', e.target.value)} rows={2} placeholder="Full address for on-site camp" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!form.organization || !form.contactName || !form.phone || !form.city}
              style={{ marginTop: 8, padding: '10px 32px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: (!form.organization || !form.contactName || !form.phone || !form.city) ? 0.5 : 1 }}>
              Next → Select Vaccines
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>Select Vaccines</h3>
            <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 12px' }}>Choose vaccines and specify participant count ({form.organization})</p>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Estimated Participants *</label>
              <input type="number" value={form.participants} onChange={e => update('participants', Number(e.target.value))} min={1} style={{ width: 120, padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => update('category', '')} style={{ padding: '4px 12px', borderRadius: 16, border: '1px solid #d0d5dd', background: !form.category ? '#059669' : '#fff', color: !form.category ? '#fff' : '#475569', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>All</button>
              {vaccineCategories.map(c => (
                <button key={c.id} onClick={() => update('category', form.category === c.id ? '' : c.id)} style={{ padding: '4px 12px', borderRadius: 16, border: '1px solid #d0d5dd', background: form.category === c.id ? '#059669' : '#fff', color: form.category === c.id ? '#fff' : '#475569', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: form.category === c.id ? 600 : 400 }}>{c.icon} {c.name}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
              {filteredVaccines.map(v => {
                const selected = form.vaccineIds.includes(v.id);
                return (
                  <div key={v.id} onClick={() => toggleVaccine(v.id)} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${selected ? '#059669' : '#e2e8f0'}`, background: selected ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${selected ? '#059669' : '#d0d5dd'}`, background: selected ? '#059669' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {selected ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{v.disease} · {v.ageGroup}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>₹{v.price}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>× {form.participants}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button onClick={() => setStep(1)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={form.vaccineIds.length === 0}
                style={{ padding: '10px 32px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: form.vaccineIds.length === 0 ? 0.5 : 1 }}>
                Next → Confirm & Submit
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: '#0f172a' }}>Confirm Bulk Booking</h3>
            <div style={{ marginBottom: 14, padding: 14, borderRadius: 8, background: '#f8fafc', fontSize: 12 }}>
              <p style={{ fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>🏢 {form.organization}</p>
              <p style={{ margin: '0 0 4px', color: '#475569' }}>Contact: {form.contactName} · {form.phone} · {form.email}</p>
              <p style={{ margin: '0 0 4px', color: '#475569' }}>📍 {form.address}, {form.city} - {form.pincode}</p>
              <p style={{ margin: 0, color: '#475569' }}>👥 {form.participants} participants</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Selected Vaccines ({selectedVaccines.length})</h4>
              <div style={{ display: 'grid', gap: 6 }}>
                {selectedVaccines.map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 6, background: '#f0fdf4', fontSize: 11 }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{v.name}</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>₹{v.price} × {form.participants} = ₹{(v.price * form.participants).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14, padding: 12, borderRadius: 8, background: '#fffbeb', border: '1px solid #fef3c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>Estimated Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>₹{totalCost.toLocaleString()}</span>
              </div>
              <p style={{ fontSize: 10, color: '#92400e', margin: '4px 0 0' }}>* Final pricing may vary based on on-site assessment and group discounts</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Preferred Date</label>
                <input type="date" value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Preferred Time</label>
                <input type="time" value={form.preferredTime} onChange={e => update('preferredTime', e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>Additional Notes</label>
                  <textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} placeholder="Any special requirements..." style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep(2)} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
              <button onClick={handleSubmit} style={{ padding: '10px 32px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Submit Bulk Request</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
