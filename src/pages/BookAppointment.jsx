import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, WhatsappLogo, User, DeviceMobile, Envelope, ClipboardText, FileText,
  ChatText, CheckCircle, SpinnerGap, ArrowLeft, Clock, Flask, Heart,
  Stethoscope, Syringe, Pill, Users, Monitor, Shield, CaretRight,
} from '@phosphor-icons/react';

const services = [
  { icon: Stethoscope, label: 'Doctor Consultation', desc: 'Consult top doctors from home' },
  { icon: Flask, label: 'Lab Test / Diagnostics', desc: 'Book tests with home collection' },
  { icon: ClipboardText, label: 'Health Checkup Package', desc: 'Preventive health screening' },
  { icon: Pill, label: 'Medicine Delivery', desc: 'Prescription medicines at your door' },
  { icon: User, label: 'Nursing Care', desc: 'Trained nurses for home care' },
  { icon: Heart, label: 'Physiotherapy', desc: 'Rehabilitation at home' },
  { icon: Syringe, label: 'Vaccination', desc: 'Vaccines at home for all ages' },
  { icon: Monitor, label: 'Home ICU Setup', desc: 'Critical care equipment at home' },
  { icon: Shield, label: 'Corporate Healthcare', desc: 'Employee wellness programs' },
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const bookingId = 'JHC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Date.now().toString(36).toUpperCase().slice(-4);

  const handlePhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (!digits) setPhoneError('');
    else if (digits.length < 10) setPhoneError('Enter at least 10 digits.');
    else setPhoneError('');
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setPrescription(f);
  };

  const removeFile = () => {
    setPrescription(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="page-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)', padding: 40 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(46,125,50,0.2)' }}>
            <CheckCircle size={48} weight="fill" color="#2e7d32" />
          </div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Booking Confirmed!</h1>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20 }}>Our healthcare team will contact you within 15-30 minutes.</p>
          <div style={{ background: 'linear-gradient(135deg, #e8f0fe, #d4e4f7)', borderRadius: 12, padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#0F5DA8', fontWeight: 700, marginBottom: 24 }}>
            <CheckCircle size={18} weight="fill" /> Booking ID: {bookingId}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919700104108" style={{ background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 14px rgba(10,94,176,0.3)' }}>
              <Phone size={18} weight="fill" /> Call Now
            </a>
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
              <WhatsappLogo size={18} weight="fill" /> WhatsApp
            </a>
            <button onClick={() => navigate('/')} style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canSubmit = name && phone.length === 10 && message;

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 50%, #0B7DE5 100%)', padding: '60px 20px 40px', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: 20, left: 20, width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
          <ArrowLeft size={18} weight="bold" />
        </button>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <ClipboardText size={36} weight="fill" color="#fff" />
        </div>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Book an Appointment</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          Fill in your details, upload your prescription, and our team will reach out to confirm your booking.
        </p>
      </div>

      <div style={{ maxWidth: 640, margin: '-20px auto 40px', padding: '0 16px', position: 'relative', zIndex: 2 }}>
        {/* Steps indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
          {['Details', 'Upload', 'Confirm'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i ? '#22C55E' : step === i + 1 ? '#0F5DA8' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
              <span style={{ fontSize: 12, fontWeight: 500, color: step >= i + 1 ? '#0F5DA8' : '#999' }}>{s}</span>
              {i < 2 && <div style={{ width: 24, height: 2, background: step > i ? '#22C55E' : '#e0e0e0' }} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <>
              <h3 style={{ fontSize: 18, marginBottom: 20, color: '#0F5DA8' }}>Your Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={13} weight="fill" color="#0F5DA8" /> Full Name <span style={{ color: '#0F5DA8' }}>*</span>
                  </label>
                  <input type="text" placeholder="Enter your name" required className="input"
                    value={name} onChange={e => setName(e.target.value)}
                    style={{ borderColor: '#d1d5db', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DeviceMobile size={13} weight="fill" color="#0F5DA8" /> Phone <span style={{ color: '#0F5DA8' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: '#f0f4f8', border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 13, fontWeight: 600, color: '#374151' }}>+91</span>
                    <input type="tel" inputMode="numeric" placeholder="XXXXXXXXXX" required className="input"
                      value={phone} onChange={e => handlePhone(e.target.value)}
                      style={{ borderRadius: '0 8px 8px 0', borderColor: phoneError ? '#dc2626' : '#d1d5db', fontSize: 14 }} />
                  </div>
                  {phoneError && <span style={{ fontSize: 11, color: '#dc2626', marginTop: 3, display: 'block' }}>{phoneError}</span>}
                  {!phoneError && phone.length > 0 && phone.length === 10 && (
                    <span style={{ fontSize: 11, color: '#2e7d32', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircle size={11} weight="fill" /> Valid mobile number
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Envelope size={13} weight="fill" color="#0F5DA8" /> Email Address
                </label>
                <input type="email" placeholder="Enter your email" className="input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ borderColor: '#d1d5db', fontSize: 14 }} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ClipboardText size={13} weight="fill" color="#0F5DA8" /> Select Service <span style={{ color: '#0F5DA8' }}>*</span>
                </label>
                <select className="input" value={service} onChange={e => setService(e.target.value)}
                  style={{ borderColor: '#d1d5db', fontSize: 14 }}>
                  <option value="">Select a service</option>
                  {services.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => navigate(-1)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                <button type="button" onClick={() => setStep(2)} className="btn-accent" style={{ flex: 2, padding: '12px' }} disabled={!name || phone.length < 10}>
                  Continue <CaretRight size={16} weight="bold" />
                </button>
              </div>
            </>
          )}

          {/* Step 2: Upload Prescription */}
          {step === 2 && (
            <>
              <h3 style={{ fontSize: 18, marginBottom: 20, color: '#0F5DA8' }}>Upload Prescription</h3>
              <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16 }}>
                Have a prescription from your doctor? Upload it here so we can prepare your order accurately.
              </p>

              {prescription ? (
                <div style={{ border: '1px solid #d1d5db', borderRadius: 12, padding: '14px 16px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>📎</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prescription.name}</div>
                    <div style={{ fontSize: 12, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} weight="fill" /> Uploaded successfully</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{(prescription.size / (1024 * 1024)).toFixed(1)} MB</div>
                  </div>
                  <button type="button" onClick={removeFile} style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#dc2626', cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap' }}>Replace</button>
                </div>
              ) : (
                <div style={{ border: '1px dashed #d1d5db', borderRadius: 12, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: '#f9fafb', marginBottom: 16 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F5DA8'; e.currentTarget.style.background = '#eef4ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#f9fafb'; }}
                  onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} />
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Click to upload prescription</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>Supports PDF, JPG, PNG — Max 10 MB</p>
                </div>
              )}
              <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
                <Shield size={13} /> Your prescription is secure and used only for medical review.
              </span>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ChatText size={13} weight="fill" color="#0F5DA8" /> Your Message <span style={{ color: '#0F5DA8' }}>*</span>
                </label>
                <textarea rows={3} placeholder="Describe your query or request..." required className="input"
                  value={message} onChange={e => setMessage(e.target.value)}
                  style={{ borderColor: '#d1d5db', fontSize: 14, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '12px' }}>Back</button>
                <button type="submit" disabled={!message || submitting} className="btn-accent" style={{ flex: 2, padding: '12px' }}>
                  {submitting ? <><SpinnerGap size={18} weight="bold" className="spin" /> Processing…</> : <><CheckCircle size={18} weight="fill" /> Confirm Booking</>}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Service tiles */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 15, color: 'var(--text-light)', marginBottom: 12, textAlign: 'center' }}>Our Services</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {services.slice(0, 6).map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '14px 12px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8edf2' }}>
                <s.icon size={22} color="#0F5DA8" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div style={{ textAlign: 'center', marginTop: 32, padding: '20px', background: '#fff', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>Prefer to call? Our team is available 24×7</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919700104108" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: '#e8f0fe', color: '#0F5DA8', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              <Phone size={16} weight="fill" /> +91 97001 04108
            </a>
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: '#e8f5e9', color: '#2e7d32', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              <WhatsappLogo size={16} weight="fill" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
