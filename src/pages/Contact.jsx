import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, PaperPlaneTilt } from '@phosphor-icons/react';

export default function Contact() {
  const navigate = useNavigate();

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
          <h2 style={{ color: 'var(--primary)', fontSize: 22, marginBottom: 6 }}>Send Us a Message</h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>We'll get back to you within 2-4 hours</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => e.preventDefault()}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>
                Your Name <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input type="text" placeholder="Enter your name" required className="input" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>
                Phone Number <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input type="tel" placeholder="Enter phone number" required className="input" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>Email Address</label>
            <input type="email" placeholder="Enter your email" className="input" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>Select Service</label>
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
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>Upload Prescription</label>
            <div style={{
              border: '1px dashed var(--border)', borderRadius: 'var(--radius)',
              padding: '16px', textAlign: 'center', cursor: 'pointer',
              background: 'var(--bg-light)', transition: 'border-color 0.2s',
              fontSize: 13, color: 'var(--text-light)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onClick={() => document.getElementById('prescription-upload').click()}
            >
              <input id="prescription-upload" type="file" accept="image/*,.pdf" style={{ display: 'none' }} />
              <span style={{ display: 'block', marginBottom: 4, fontSize: 20 }}>📄</span>
              Click to upload prescription (PDF or image)
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'block' }}>
              Your Message <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea rows={4} placeholder="Describe your query or request..." required className="input" style={{ resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" style={{
            background: 'var(--accent)', color: '#fff', padding: '13px 32px',
            borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: 'none', cursor: 'pointer', transition: 'background 0.2s',
            marginTop: 4,
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#e55a2b'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <PaperPlaneTilt size={18} weight="fill" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
