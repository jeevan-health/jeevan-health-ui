import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminStore from '../stores/adminStore';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const addContact = useAdminStore(s => s.addContact);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    addContact(form);
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };
  return (
    <div className="page-section container" style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Contact Us</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>We're here to help you</p>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📞</div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Phone</h3>
          <a href="tel:+919700104108" style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>+91 97001 04108</a>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Mon-Sat, 6AM - 10PM</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Email</h3>
          <a href="mailto:care@jeevanhealthcare.com" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>care@jeevanhealthcare.com</a>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>We reply within 2 hours</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Send us a message</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" className="input" placeholder="Enter your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="input" placeholder="Enter your phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea className="input" rows={4} placeholder="How can we help you?" style={{ resize: 'vertical' }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">{sent ? '✓ Message Sent!' : 'Send Message'}</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 16, textAlign: 'center' }}>
        <p style={{ fontSize: 13, marginBottom: 8 }}>Prefer WhatsApp?</p>
        <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ background: '#25D366', border: 'none' }}>
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
