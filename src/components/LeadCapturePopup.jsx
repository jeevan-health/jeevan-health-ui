import { useState, useEffect, useRef } from 'react';
import { useT } from '../i18n/LanguageProvider';
import { trackLead } from '../lib/analytics';

const LEADS_KEY = 'jh_website_leads';
const DISMISS_KEY = 'jh_popup_dismissed';
const POPUP_DELAY = 30000;
const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000;

function isDismissed() {
  try {
    const val = localStorage.getItem(DISMISS_KEY);
    if (!val) return false;
    return Date.now() - Number(val) < DISMISS_TTL;
  } catch { return false; }
}

function saveLead(data) {
  try {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    leads.push({ ...data, timestamp: new Date().toISOString(), source: 'popup' });
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch {}
}

const SERVICES = [
  { id: 'lab', label: '🔬 Lab Test' },
  { id: 'nursing', label: '👩‍⚕️ Nursing at Home' },
  { id: 'physio', label: '💪 Physiotherapy' },
  { id: 'vaccination', label: '💉 Vaccination' },
  { id: 'equipment', label: '🛏️ Medical Equipment' },
  { id: 'other', label: '❓ Other' },
];

export default function LeadCapturePopup() {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('lab');
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState('form');
  const timerRef = useRef(null);
  const exitedRef = useRef(false);

  useEffect(() => {
    if (isDismissed()) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY);

    const handleExit = (e) => {
      if (e.clientY <= 0 && !exitedRef.current && !isDismissed()) {
        exitedRef.current = true;
        clearTimeout(timerRef.current);
        setVisible(true);
      }
    };
    document.addEventListener('mouseleave', handleExit);

    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener('mouseleave', handleExit);
    };
  }, []);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setVisible(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const clean = phone.replace(/\D/g, '');
    if (!name.trim() || clean.length < 10) return;
    const leadData = { name: name.trim(), phone: clean, service, query: SERVICES.find(s => s.id === service)?.label || service, source: 'popup' };
    saveLead(leadData);
    trackLead('popup');
    setSubmitted(true);
  }

  if (!visible) return null;

  return (
    <>
      <div onClick={dismiss} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popupFadeIn 0.3s ease',
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: '#fff', borderRadius: 16, padding: 0, width: 360, maxWidth: '92vw',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'popupSlideIn 0.3s ease',
        }}>
          {submitted ? (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
                Thank you, {name}!
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.5 }}>
                Our team will contact you shortly at <strong>{phone}</strong>.
                You can also reach us directly on WhatsApp.
              </div>
              <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi Jeevan Health! I am ${name}. I am interested in ${SERVICES.find(s => s.id === service)?.label || 'your services'}. Please help.`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 10, background: '#25D366', color: '#fff',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit',
                  marginBottom: 12,
                }}>
                💬 Chat on WhatsApp
              </a>
              <br />
              <button onClick={dismiss} style={{
                background: 'none', border: 'none', color: '#999', fontSize: 12, cursor: 'pointer',
                fontFamily: 'inherit', textDecoration: 'underline',
              }}>Close</button>
            </div>
          ) : (
            <>
              <div style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', padding: '20px 24px', color: '#fff' }}>
                <button onClick={dismiss} style={{
                  position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none',
                  color: '#fff', borderRadius: '50%', width: 28, height: 28, fontSize: 14, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
                }}>✕</button>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🏥</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                  Get Free Consultation
                </div>
                <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.5 }}>
                  Book lab tests, nursing, physiotherapy, or vaccination at home. Our team will call you back.
                </div>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Enter your name"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} required placeholder="10-digit phone number" pattern="[0-9]{10}"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>I need help with</label>
                  <select value={service} onChange={e => setService(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                    {SERVICES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Call Me Back
                </button>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <button type="button" onClick={dismiss} style={{
                    background: 'none', border: 'none', color: '#999', fontSize: 11, cursor: 'pointer',
                    fontFamily: 'inherit', textDecoration: 'underline',
                  }}>Not now • Don't show again for 7 days</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes popupFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupSlideIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </>
  );
}
