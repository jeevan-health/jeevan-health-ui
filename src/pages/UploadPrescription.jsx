import React, { useState, useRef } from 'react';
import { useT } from '../i18n/LanguageProvider';
import { Link } from 'react-router-dom';

const ACCEPTED = 'image/jpeg,image/png,application/pdf';
const MAX_SIZE = 10 * 1024 * 1024;

export default function UploadPrescription() {
  const t = useT();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef();

  function validateFile(f) {
    if (!f) return t('uploadPrescription.validate.noFile', 'No file selected');
    if (!ACCEPTED.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|pdf)$/i)) return t('uploadPrescription.validate.unsupportedFormat', 'Unsupported format. Use JPG, JPEG, PNG, or PDF.');
    if (f.size > MAX_SIZE) return t('uploadPrescription.validate.fileTooLarge', 'File exceeds 10 MB limit.');
    return '';
  }

  function handleFile(f) {
    const err = validateFile(f);
    if (err) { alert(err); return; }
    setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) { alert(t('uploadPrescription.alert.noFile', 'Please upload your prescription first.')); return; }
    if (!form.name.trim() || !form.phone.trim()) { alert(t('uploadPrescription.alert.noDetails', 'Please fill in your name and phone number.')); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setStep('success'); }, 1500);
  }

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        {step === 'upload' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700 }}>{t('uploadPrescription.heading', '📄 Upload Prescription')}</h1>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {t('uploadPrescription.subtitle', 'Need help finding the right tests? Upload your doctor\'s prescription, and our healthcare experts will review it and recommend the appropriate tests.')}
              </p>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#22C55E' : '#d0d5dd'}`, borderRadius: 12, padding: 40, textAlign: 'center',
                background: dragOver ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 24,
              }}
            >
              <input ref={inputRef} type="file" accept={ACCEPTED} hidden onChange={e => e.target.files.length && handleFile(e.target.files[0])} />
              <div style={{ fontSize: 40, marginBottom: 8 }}>{file ? '📄' : '📤'}</div>
              {file ? (
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{file.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}><span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{t('uploadPrescription.dropzone.chooseFile', 'Choose File')}</span> {t('uploadPrescription.dropzone.orDrag', 'or Drag & Drop Here')}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('uploadPrescription.dropzone.formats', 'JPG, JPEG, PNG, PDF — Max 10 MB')}</p>
                </>
              )}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{t('uploadPrescription.patientDetails', 'Patient Details')}</h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{t('uploadPrescription.patientDetailsSub', 'Please provide your details so our Health Advisor can contact you.')}</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('uploadPrescription.form.fullName', 'Full Name')} <span style={{ color: '#e53935' }}>*</span></label>
                  <input type="text" className="input" placeholder={t('uploadPrescription.form.fullNamePlaceholder', 'Your full name')} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('uploadPrescription.form.mobile', 'Mobile Number')} <span style={{ color: '#e53935' }}>*</span></label>
                  <input type="tel" className="input" placeholder={t('uploadPrescription.form.mobilePlaceholder', 'Enter your 10-digit phone number')} required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} />
                </div>
                <div className="form-group">
                  <label>{t('uploadPrescription.form.email', 'Email Address')} <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('uploadPrescription.form.optional', '(Optional)')}</span></label>
                  <input type="email" className="input" placeholder={t('uploadPrescription.form.emailPlaceholder', 'your@email.com')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>{t('uploadPrescription.form.message', 'Message')} <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('uploadPrescription.form.optional', '(Optional)')}</span></label>
                  <textarea className="input" rows={3} placeholder={t('uploadPrescription.form.messagePlaceholder', 'Please call me regarding the prescribed tests.')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8 }} disabled={submitting}>
                  {submitting ? t('uploadPrescription.form.uploading', 'Uploading...') : t('uploadPrescription.form.submit', '📤 Upload Prescription')}
                </button>
              </form>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{t('uploadPrescription.success.title', 'Thank You!')}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
              {t('uploadPrescription.success.text', 'Your prescription has been uploaded successfully.')}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-body)', marginBottom: 16, lineHeight: 1.7 }}>
              {t('uploadPrescription.success.reviewText', 'Our Health Advisor will review your prescription and contact you shortly to:')}
            </p>
            <ul style={{ textAlign: 'left', fontSize: 13, lineHeight: 2, marginBottom: 24, paddingLeft: 20 }}>
              <li>{t('uploadPrescription.success.list1', 'Recommend the appropriate diagnostic tests')}</li>
              <li>{t('uploadPrescription.success.list2', 'Explain any required test preparation')}</li>
              <li>{t('uploadPrescription.success.list3', 'Share pricing and available offers')}</li>
              <li>{t('uploadPrescription.success.list4', 'Help you schedule a home sample collection or laboratory visit at your preferred date and time')}</li>
            </ul>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              {t('uploadPrescription.success.thankYou', 'Thank you for choosing')} <span style={{ color: 'var(--primary)' }}>{t('uploadPrescription.success.brand', 'Jeevan HealthCare at Home')}</span>. {t('uploadPrescription.success.lookForward', 'We look forward to assisting you.')}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-outline">{t('uploadPrescription.success.returnHome', 'Return to Home')}</Link>
              <Link to="/diagnostics" className="btn btn-primary">{t('uploadPrescription.success.bookService', 'Book Another Service')}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
