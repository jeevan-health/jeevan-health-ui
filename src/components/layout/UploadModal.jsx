import React, { useState, useRef } from 'react';
import useUploadModal from '../../stores/uploadModalStore';
import { useT } from '../../i18n/LanguageProvider';

const ACCEPTED = 'image/jpeg,image/png,application/pdf';
const MAX_SIZE = 10 * 1024 * 1024;

export default function UploadModal() {
  const t = useT();
  const { open, setOpen } = useUploadModal();
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef();

  if (!open) return null;

  const validateFile = (f) => {
    if (!f) return t('uploadModal.noFile', 'No file selected');
    if (!ACCEPTED.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|pdf)$/i)) return t('uploadModal.unsupportedFormat', 'Unsupported format.');
    if (f.size > MAX_SIZE) return t('uploadModal.fileTooLarge', 'File exceeds 10 MB.');
    return '';
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) { alert(err); return; }
    setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) { alert(t('uploadModal.alertUploadFirst', 'Upload your prescription first.')); return; }
    if (!form.name.trim() || !form.phone.trim()) { alert(t('uploadModal.alertFillDetails', 'Fill in name and phone.')); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setStep('success'); }, 1200);
  };

  const close = () => { setOpen(false); setTimeout(() => { setStep('upload'); setFile(null); setForm({ name: '', phone: '', message: '' }); }, 300); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={close} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 16, maxWidth: 480, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <button onClick={close} style={{ position: 'absolute', top: 12, right: 12, background: '#f5f6fa', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, fontFamily: 'inherit' }}>✕</button>

        {step === 'upload' && (
          <div style={{ padding: 24 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📄</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{t('uploadModal.heading', 'Upload Prescription')}</h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{t('uploadModal.subtext', "Upload your doctor's prescription and we'll recommend the right tests.")}</p>
            </div>
            <div onClick={() => inputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); }}
              style={{ border: `2px dashed ${dragOver ? '#22C55E' : '#d0d5dd'}`, borderRadius: 12, padding: 28, textAlign: 'center', background: dragOver ? '#f0fdf4' : '#fafafa', cursor: 'pointer', marginBottom: 16 }}>
              <input ref={inputRef} type="file" accept={ACCEPTED} hidden onChange={e => e.target.files.length && handleFile(e.target.files[0])} />
              <div style={{ fontSize: 32, marginBottom: 6 }}>{file ? '📄' : '📤'}</div>
              {file ? (
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{file.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}><span style={{ color: 'var(--primary)' }}>{t('uploadModal.chooseFile', 'Choose File')}</span> {t('uploadModal.orDragDrop', 'or drag & drop')}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('uploadModal.acceptedFormats', 'JPG, JPEG, PNG, PDF — Max 10 MB')}</p>
                </>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('uploadModal.fullName', 'Full Name')} <span style={{ color: '#e53935' }}>*</span></label>
                <input type="text" className="input" placeholder={t('uploadModal.namePlaceholder', 'Your name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>{t('uploadModal.mobileNumber', 'Mobile Number')} <span style={{ color: '#e53935' }}>*</span></label>
                <input type="tel" className="input" placeholder={t('uploadModal.phonePlaceholder', '10-digit phone number')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} required />
              </div>
              <div className="form-group">
                <label>{t('uploadModal.message', 'Message')} <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>({t('uploadModal.optional', 'Optional')})</span></label>
                <textarea className="input" rows={2} placeholder={t('uploadModal.messagePlaceholder', 'Any specific concerns...')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting} style={{ marginTop: 4 }}>
                {submitting ? t('uploadModal.uploading', 'Uploading...') : t('uploadModal.uploadBtn', '📤 Upload Prescription')}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{t('uploadModal.thankYou', 'Thank You!')}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              {t('uploadModal.uploadSuccess', 'Your prescription has been uploaded successfully.')}
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 20, textAlign: 'left', padding: '0 8px' }}>
              {t('uploadModal.advisorMsg', 'Our Health Advisor will review it and contact you shortly to recommend the appropriate tests and help schedule your home sample collection.')}
            </p>
            <button onClick={close} className="btn btn-primary btn-block">{t('uploadModal.done', 'Done')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
