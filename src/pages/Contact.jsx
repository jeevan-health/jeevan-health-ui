import { Link } from 'react-router-dom';
import { Phone, Envelope, MapPin, Clock } from '@phosphor-icons/react';

export default function Contact() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Contact Us</h1>
        <p>
          Have a question or need to book a service? Reach out to us — we're here to help 24/7.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, margin: '40px 0' }}>
          <div className="service-card-mini" style={{ padding: 28 }}>
            <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 12 }}>
              <Phone size={28} weight="fill" />
            </div>
            <h3>Call / WhatsApp</h3>
            <p>
              <a href="tel:+919700104108" style={{ color: 'var(--medical-blue)', fontWeight: 700, fontSize: 20, display: 'block', marginTop: 8 }}>
                +91 97001 04108
              </a>
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Available 8 AM – 10 PM, 7 days a week</p>
          </div>

          <div className="service-card-mini" style={{ padding: 28 }}>
            <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 12 }}>
              <Envelope size={28} weight="fill" />
            </div>
            <h3>Email</h3>
            <p>
              <a href="mailto:care@jeevanhealthcare.com" style={{ color: 'var(--medical-blue)' }}>
                care@jeevanhealthcare.com
              </a>
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>We respond within 2-4 hours</p>
          </div>

          <div className="service-card-mini" style={{ padding: 28 }}>
            <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 12 }}>
              <MapPin size={28} weight="fill" />
            </div>
            <h3>Office Address</h3>
            <p style={{ fontSize: 14 }}>
              10-1-128/1/2/D, 1st Floor, Ali Manor Complex, Ambedkar Nagar, Masab Tank, Hyderabad, Telangana 500004.
            </p>
            <a href="https://share.google/NBt0kr9w42O8b824a" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: 'var(--royal-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} /> View on Google Maps
            </a>
          </div>

          <div className="service-card-mini" style={{ padding: 28 }}>
            <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 12 }}>
              <Clock size={28} weight="fill" />
            </div>
            <h3>Service Hours</h3>
            <p><strong>Consultations:</strong> 8 AM – 10 PM</p>
            <p><strong>Medicine Delivery:</strong> 24/7</p>
            <p><strong>Lab Sample Collection:</strong> 6 AM – 8 PM</p>
            <p><strong>Customer Support:</strong> 24/7</p>
          </div>
        </div>

        {/* Enquiry Form */}
        <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 'var(--radius-lg)', padding: 40, boxShadow: 'var(--shadow)' }}>
          <h2 style={{ color: 'var(--medical-blue)', marginBottom: 24, textAlign: 'center' }}>Send Us a Message</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Your Name" required style={inputStyle} />
            <input type="tel" placeholder="Phone Number" required style={inputStyle} />
            <input type="email" placeholder="Email Address" style={inputStyle} />
            <select style={inputStyle}>
              <option value="">Select Service</option>
              <option>Doctor Consultation</option>
              <option>Medicine Delivery</option>
              <option>Lab Test / Diagnostics</option>
              <option>Nursing Care</option>
              <option>Physiotherapy</option>
              <option>Vaccination</option>
              <option>Health Checkup Package</option>
              <option>Other</option>
            </select>
            <textarea rows={4} placeholder="Your Message" style={inputStyle}></textarea>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'center' }}>
              <Envelope size={18} weight="fill" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', border: '1px solid var(--border-light)',
  borderRadius: 8, fontSize: 15, fontFamily: 'inherit',
  boxSizing: 'border-box',
};
