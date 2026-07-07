import React from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
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
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label>Your Name</label>
            <input type="text" className="input" placeholder="Enter your name" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="input" placeholder="Enter your phone" />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea className="input" rows={4} placeholder="How can we help you?" style={{ resize: 'vertical' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Send Message</button>
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
