import { Phone, Envelope, MapPin, Clock, PaperPlaneTilt } from '@phosphor-icons/react';

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0A5EB0 0%, #1a7ad4 100%)',
        padding: '60px 20px 48px', textAlign: 'center', color: '#fff',
      }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 10 }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
            Have a question or need to book a service? Reach out to us — we're here to help 24/7.
          </p>
        </div>
      </div>

      <section className="page-section">
        <div className="container">

          {/* Contact Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
            <div className="info-card" style={{ padding: 28 }}>
              <div className="icon" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                }}>
                  <Phone size={22} weight="fill" />
                </span>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Call / WhatsApp</h3>
              <a href="tel:+919700104108" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 20, display: 'block', margin: '8px 0' }}>
                +91 97001 04108
              </a>
              <p style={{ fontSize: 13, color: 'var(--text-light)' }}>Available 8 AM – 10 PM, 7 days a week</p>
            </div>

            <div className="info-card" style={{ padding: 28 }}>
              <div className="icon" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                }}>
                  <Envelope size={22} weight="fill" />
                </span>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Email</h3>
              <a href="mailto:care@jeevanhealthcare.com" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 15, display: 'block', margin: '8px 0', wordBreak: 'break-all' }}>
                care@jeevanhealthcare.com
              </a>
              <p style={{ fontSize: 13, color: 'var(--text-light)' }}>We respond within 2-4 hours</p>
            </div>

            <div className="info-card" style={{ padding: 28 }}>
              <div className="icon" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                }}>
                  <MapPin size={22} weight="fill" />
                </span>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Office Address</h3>
              <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.6, margin: '8px 0' }}>
                10-1-128/1/2/D, 1st Floor, Ali Manor Complex, Ambedkar Nagar, Masab Tank, Hyderabad, Telangana 500004.
              </p>
              <a href="https://share.google/NBt0kr9w42O8b824a" target="_blank" rel="noopener noreferrer" style={{
                fontSize: 13, color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <MapPin size={14} weight="fill" /> View on Google Maps
              </a>
            </div>

            <div className="info-card" style={{ padding: 28 }}>
              <div className="icon" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                }}>
                  <Clock size={22} weight="fill" />
                </span>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Service Hours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Consultations', time: '8 AM – 10 PM' },
                  { label: 'Medicine Delivery', time: '24/7' },
                  { label: 'Lab Sample Collection', time: '6 AM – 8 PM' },
                  { label: 'Customer Support', time: '24/7' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-light)' }}>{s.label}</span>
                    <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            maxWidth: 640, margin: '0 auto', background: '#fff',
            borderRadius: 'var(--radius-lg)', padding: '36px 40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid var(--border)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ color: 'var(--primary)', fontSize: 22, marginBottom: 6 }}>Send Us a Message</h2>
              <p style={{ fontSize: 14, color: 'var(--text-light)' }}>We'll get back to you within 2-4 hours</p>
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={e => e.preventDefault()}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label>Your Name <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input type="text" placeholder="Enter your name" required className="input" />
                </div>
                <div>
                  <label>Phone Number <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input type="tel" placeholder="Enter phone number" required className="input" />
                </div>
              </div>
              <div>
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" className="input" />
              </div>
              <div>
                <label>Select Service</label>
                <select className="input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\'%3E%3Cpath d=\'M6 8L1 3h10z\' fill=\'%23888\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
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
                <label>Your Message <span style={{ color: 'var(--accent)' }}>*</span></label>
                <textarea rows={4} placeholder="Describe your query or request..." required className="input" style={{ resize: 'vertical' }}></textarea>
              </div>
              <button type="submit" style={{
                background: 'var(--accent)', color: '#fff', padding: '14px 32px',
                borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                border: 'none', cursor: 'pointer', transition: 'background 0.2s',
                alignSelf: 'flex-start', marginTop: 4,
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#e55a2b'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              >
                <PaperPlaneTilt size={18} weight="fill" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
