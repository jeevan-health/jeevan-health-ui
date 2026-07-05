import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, SpinnerGap, Phone, WhatsappLogo, User, DeviceMobile, Envelope, ClipboardText, FileText, ChatText } from '@phosphor-icons/react';

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
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{
          background: 'linear-gradient(180deg, #0A5EB0 0%, #1a7ad4 100%)',
          borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 440,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ padding: '48px 36px 36px', background: '#fff', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', marginTop: 4 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '-72px auto 16px', boxShadow: '0 4px 16px rgba(46,125,50,0.2)',
            }}>
              <CheckCircle size={40} weight="fill" color="#2e7d32" />
            </div>
            <h2 style={{ color: 'var(--text-dark)', fontSize: 22, marginBottom: 6 }}>Booking Confirmed!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 16 }}>Our healthcare team will contact you shortly.</p>
            <div style={{
              background: 'linear-gradient(135deg, #e8f0fe, #d4e4f7)',
              borderRadius: 'var(--radius)', padding: '10px 16px',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: '#0A5EB0', fontWeight: 700, marginBottom: 16,
            }}>
              <CheckCircle size={16} weight="fill" /> Booking ID: {bookingId}
            </div>
            <p style={{ fontSize: 13, color: '#2e7d32', fontWeight: 600, marginBottom: 20 }}>
              Expected response time: 15–30 minutes
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <a href="tel:+919700104108" style={{
                background: 'linear-gradient(135deg, #0A5EB0, #1a7ad4)',
                color: '#fff', padding: '11px 22px', borderRadius: 'var(--radius)',
                fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                textDecoration: 'none', boxShadow: '0 3px 10px rgba(10,94,176,0.3)',
              }}>
                <Phone size={16} weight="fill" /> Call Now
              </a>
              <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{
                background: '#25d366', color: '#fff', padding: '11px 22px',
                borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                boxShadow: '0 3px 10px rgba(37,211,102,0.3)',
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
      </div>
    );
  }

  const canSubmit = name && phone.length === 10 && message;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        position: 'relative',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A5EB0 0%, #1a7ad4 50%, #2196F3 100%)',
          padding: '28px 36px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          position: 'relative',
        }}>
          <button onClick={() => navigate(-1)} style={{
            position: 'absolute', top: 14, right: 14, width: 32, height: 32,
            borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
          >
            <X size={18} weight="bold" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ClipboardText size={26} weight="fill" color="#fff" />
            </div>
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, margin: 0 }}>Book Appointment</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: '2px 0 0' }}>Fill in your details below</p>
            </div>
          </div>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: '24px 36px 32px' }} onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <User size={13} weight="fill" color="#0A5EB0" /> Your Name <span style={{ color: '#ff6b35' }}>*</span>
              </label>
              <input type="text" placeholder="Enter your name" required className="input"
                value={name} onChange={e => setName(e.target.value)}
                style={{ borderColor: '#d1d5db', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <DeviceMobile size={13} weight="fill" color="#0A5EB0" /> Phone <span style={{ color: '#ff6b35' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'stretch' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', padding: '0 10px',
                  background: '#f0f4f8', border: '1px solid #d1d5db',
                  borderRight: 'none', borderRadius: 'var(--radius) 0 0 var(--radius)',
                  fontSize: 13, fontWeight: 600, color: '#374151',
                }}>+91</span>
                <input type="tel" inputMode="numeric" placeholder="XXXXXXXXXX" required className="input"
                  value={phone} onChange={e => handlePhone(e.target.value)}
                  style={{ borderRadius: '0 var(--radius) var(--radius) 0', borderColor: phoneError ? '#dc2626' : '#d1d5db', fontSize: 14 }} />
              </div>
              {phoneError && (
                <span style={{ fontSize: 11, color: '#dc2626', marginTop: 3, display: 'block' }}>{phoneError}</span>
              )}
              {!phoneError && phone.length > 0 && phone.length === 10 && (
                <span style={{ fontSize: 11, color: '#2e7d32', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <CheckCircle size={11} weight="fill" /> Valid mobile number
                </span>
              )}
              <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 3, display: 'block' }}>
                We will send booking updates on this number.
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Envelope size={13} weight="fill" color="#0A5EB0" /> Email Address
            </label>
            <input type="email" placeholder="Enter your email" className="input"
              value={email} onChange={e => setEmail(e.target.value)}
              style={{ borderColor: '#d1d5db', fontSize: 14 }} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ClipboardText size={13} weight="fill" color="#0A5EB0" /> Select Service
            </label>
            <select className="input" value={service} onChange={e => setService(e.target.value)}
              style={{ borderColor: '#d1d5db', fontSize: 14, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'%3E%3Cpath d=\'M6 8L1 3h10z\' fill=\'%23666\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
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

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FileText size={13} weight="fill" color="#0A5EB0" /> Upload Prescription
            </label>
            {prescription ? (
              <div style={{
                border: '1px solid #d1d5db', borderRadius: 'var(--radius)',
                padding: '12px 14px', background: '#f9fafb',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>📎</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prescription.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={12} weight="fill" /> Uploaded successfully
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
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
                border: '1px dashed #d1d5db', borderRadius: 'var(--radius)',
                padding: '16px', textAlign: 'center', cursor: 'pointer',
                background: '#f9fafb', transition: 'all 0.2s',
                fontSize: 13, color: '#6b7280',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0A5EB0'; e.currentTarget.style.background = '#eef4ff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#f9fafb'; }}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFile} />
                <span style={{ display: 'block', marginBottom: 4, fontSize: 24 }}>📄</span>
                Click to upload prescription (PDF or image)
              </div>
            )}
            <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
              Your prescription is secure and used only for medical review.
            </span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChatText size={13} weight="fill" color="#0A5EB0" /> Your Message <span style={{ color: '#ff6b35' }}>*</span>
            </label>
            <textarea rows={4} placeholder="Describe your query or request..." required className="input"
              value={message} onChange={e => setMessage(e.target.value)}
              style={{ borderColor: '#d1d5db', fontSize: 14, resize: 'vertical' }}></textarea>
          </div>

          <button type="submit" disabled={!canSubmit || submitting} style={{
            background: !canSubmit || submitting ? '#d1d5db' : 'linear-gradient(135deg, #ff6b35, #e55a2b)',
            color: '#fff', padding: '14px 32px',
            borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: !canSubmit || submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', boxShadow: !canSubmit || submitting ? 'none' : '0 4px 14px rgba(255,107,53,0.35)',
          }}>
            {submitting ? (
              <><SpinnerGap size={18} weight="bold" className="spin" /> Processing your request…</>
            ) : (
              <><CheckCircle size={18} weight="fill" /> Confirm & Book Appointment</>
            )}
          </button>
          {!submitting && (
            <span style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 10 }}>
              Takes less than 10 seconds
            </span>
          )}
        </form>
      </div>
    </div>
  );
}
