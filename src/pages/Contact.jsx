import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, SpinnerGap, Phone, WhatsappLogo } from '@phosphor-icons/react';

export default function Contact() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
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

  const formatPhone = (d) => {
    if (!d) return '';
    return d.length > 5 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : `+91 ${d}`;
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
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{
          background: '#fff', borderRadius: 'var(--radius-lg)',
          width: '100%', maxWidth: 440, padding: '40px 36px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', animation: 'none',
          }}>
            <CheckCircle size={36} weight="fill" color="#2e7d32" />
          </div>
          <h2 style={{ color: 'var(--text-dark)', fontSize: 22, marginBottom: 6 }}>Thank you for your submission.</h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 12 }}>Our healthcare team will contact you shortly.</p>
          <div style={{
            background: '#f0f7ff', borderRadius: 'var(--radius)',
            padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 16,
          }}>
            <CheckCircle size={16} weight="fill" /> Booking ID: {bookingId}
          </div>
          <p style={{ fontSize: 13, color: '#2e7d32', fontWeight: 500, marginBottom: 20 }}>
            Expected response time: 15–30 minutes
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <a href="tel:+919700104108" style={{
              background: 'var(--primary)', color: '#fff', padding: '10px 20px',
              borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
            }}>
              <Phone size={16} weight="fill" /> Call Now
            </a>
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{
              background: '#25d366', color: '#fff', padding: '10px 20px',
              borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
            }}>
              <WhatsappLogo size={16} weight="fill" /> WhatsApp
            </a>
          </div>
          <button onClick={() => navigate(-1)} style={{
            marginTop: 20, background: 'none', border: 'none', fontSize: 13,
            color: 'var(--text-light)', cursor: 'pointer', textDecoration: 'underline',
          }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const canSubmit = name && phone.length === 10 && message;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        position: 'relative', padding: '32px 36px',
      }}>
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 14, right: 14, width: 32, height: 32,
          borderRadius: '50%', border: 'none', background: '#f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#666', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e0e0e0'; e.currentTarget.style.color = '#333'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0f0f0'; e.currentTarget.style.color = '#666'; }}
        >
          <X size={18} weight="bold" />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ color: 'var(--primary)', fontSize: 22, marginBottom: 6 }}>Book Appointment</h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>We'll get back to you within 2-4 hours</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>
                Your Name <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input type="text" placeholder="Enter your name" required className="input"
                value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>
                Phone Number <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input type="tel" placeholder="+91 XXXXX XXXXX" required className="input"
                value={formatPhone(phone)} onChange={e => handlePhone(e.target.value)}
                style={{ borderColor: phoneError ? '#dc2626' : 'var(--border)' }} />
              {phoneError && (
                <span style={{ fontSize: 11, color: '#dc2626', marginTop: 2, display: 'block' }}>{phoneError}</span>
              )}
              {!phoneError && phone.length > 0 && phone.length === 10 && (
                <span style={{ fontSize: 11, color: '#2e7d32', marginTop: 2, display: 'block' }}>Valid mobile number</span>
              )}
              <span style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2, display: 'block' }}>
                We will send booking updates on this number.
              </span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>Email Address</label>
            <input type="email" placeholder="Enter your email" className="input"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>Select Service</label>
            <select className="input" value={service} onChange={e => setService(e.target.value)}
              style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'%3E%3Cpath d=\'M6 8L1 3h10z\' fill=\'%23888\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
              <option value="">Select a service</option>
              <option>Doctor Consultation</option>
              <option>Medicine Delivery</option>
              <option>Lab Test / Diagnostics</option>
              <option>Nursing Care</option>
              <option>Physiotherapy</option>
              <option>Vaccination</option>
              <option>Health Checkup Package</option>
              <option>Corporate Healthcare</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>Upload Prescription</label>
            {prescription ? (
              <div style={{
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '12px 14px', background: '#f9fafb',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>📎</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prescription.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={12} weight="fill" /> Uploaded successfully
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)' }}>
                    {(prescription.size / (1024 * 1024)).toFixed(1)} MB
                  </div>
                </div>
                <button type="button" onClick={removeFile} style={{
                  background: '#fee2e2', border: 'none', borderRadius: 6,
                  padding: '4px 10px', fontSize: 12, color: '#dc2626',
                  cursor: 'pointer', fontWeight: 500, whiteSpace: 'nowrap',
                }}>Replace</button>
              </div>
            ) : (
              <div style={{
                border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
                padding: '16px', textAlign: 'center', cursor: 'pointer',
                background: 'var(--bg-light)', transition: 'border-color 0.2s',
                fontSize: 13, color: 'var(--text-light)',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} />
                <span style={{ display: 'block', marginBottom: 4, fontSize: 20 }}>📄</span>
                Click to upload prescription (PDF or image)
              </div>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4, display: 'block' }}>
              Your prescription is secure and used only for medical review.
            </span>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>
              Your Message <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea rows={4} placeholder="Describe your query or request..." required className="input"
              value={message} onChange={e => setMessage(e.target.value)}
              style={{ resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" disabled={!canSubmit || submitting} style={{
            background: !canSubmit || submitting ? '#ccc' : 'var(--accent)',
            color: '#fff', padding: '14px 32px',
            borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: !canSubmit || submitting ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s', marginTop: 4,
          }}>
            {submitting ? (
              <><SpinnerGap size={18} weight="bold" className="spin" /> Processing your request…</>
            ) : (
              <><CheckCircle size={18} weight="fill" /> Confirm & Book Appointment</>
            )}
          </button>
          {!submitting && (
            <span style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center', marginTop: -8 }}>
              Takes less than 10 seconds
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
