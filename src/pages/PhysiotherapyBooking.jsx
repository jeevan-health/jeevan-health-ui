import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { useToast } from '../components/Toast';
import {
  physioCategories, therapists, physioPackages, painLevels,
  bodyParts, previousTreatments, painDurations, treatmentModes, STORAGE_KEYS,
} from '../data/physiotherapyData.js';

const STEPS = [
  { id: 'service', label: 'physio.step.service' },
  { id: 'mode', label: 'physio.step.mode' },
  { id: 'patient', label: 'physio.step.patient' },
  { id: 'assessment', label: 'physio.step.assessment' },
  { id: 'therapist', label: 'physio.step.therapist' },
  { id: 'package', label: 'physio.step.package' },
  { id: 'payment', label: 'physio.step.payment' },
];

const allConditions = [...new Set(physioCategories.flatMap(c => c.conditions))];

const iconMap = {
  'Back Pain': '🔙', 'Neck Pain': '🦒', 'Slip Disc': '🦴', 'Sciatica': '⚡',
  'Knee Pain': '🦵', 'Shoulder Pain': '💪', 'Arthritis': '🦴', 'Frozen Shoulder': '🧊',
  'Joint Stiffness': '🔩', 'Sports Injuries': '⚽', 'Knee Replacement': '🦵',
  'Hip Replacement': '🦿', 'Spine Surgery': '🦴', 'Fracture Surgery': '🩹',
  'Ligament Repair': '🔗', 'ACL Surgery': '🏃', 'Stroke Recovery': '🧠',
  'Paralysis Rehabilitation': '🛏️', "Parkinson's Disease": '🧩',
  'Spinal Cord Injury': '🦴', 'Multiple Sclerosis': '🧬', 'Balance Problems': '⚖️',
  'Athletes': '🏃', 'Gym Injuries': '🏋️', 'Muscle Tears': '💪',
  'Ligament Injuries': '🔗', 'Sports Recovery': '🏆', 'Weak Muscles': '💪',
  'Fall Prevention': '🛡️', 'Mobility Issues': '🚶', 'Age-related Pain': '👴',
  'Development Delay': '🧸', 'Cerebral Palsy': '🤝', 'Walking Problems': '🚶',
  'Posture Problems': '🧍', 'Muscle Weakness': '💪', 'Pregnancy Back Pain': '🤰',
  'Pelvic Pain': '🩺', 'Post Pregnancy Recovery': '👶', 'Diastasis Recti': '🤰',
  'Pelvic Floor Dysfunction': '🩺', 'Post ICU Recovery': '🏥', 'Lung Rehabilitation': '🫁',
  'Breathing Problems': '🌬️', 'Cardiac Surgery Recovery': '❤️', 'COPD': '🫁',
  'Elderly Care': '👴', 'Bedridden Patients': '🛏️', 'Post Surgery': '🏥',
  'Stroke Patients': '🧠',
};

const conditionIcons = (cond) => iconMap[cond] || '🩺';

const TIME_SLOTS = [
  { label: '9:00 AM - 10:00 AM', value: '9-10' },
  { label: '10:00 AM - 11:00 AM', value: '10-11' },
  { label: '11:00 AM - 12:00 PM', value: '11-12' },
  { label: '12:00 PM - 1:00 PM', value: '12-13' },
  { label: '2:00 PM - 3:00 PM', value: '14-15' },
  { label: '3:00 PM - 4:00 PM', value: '15-16' },
  { label: '4:00 PM - 5:00 PM', value: '16-17' },
  { label: '5:00 PM - 6:00 PM', value: '17-18' },
];

const PAYMENT_METHODS = [
  { id: 'upi', icon: '📱', label: 'physio.payment.upi', desc: 'physio.payment.upi.desc' },
  { id: 'card', icon: '💳', label: 'physio.payment.card', desc: 'physio.payment.card.desc' },
  { id: 'netbanking', icon: '🏦', label: 'physio.payment.netbanking', desc: 'physio.payment.netbanking.desc' },
  { id: 'cash', icon: '💵', label: 'physio.payment.cash', desc: 'physio.payment.cash.desc' },
];

export default function PhysiotherapyBooking() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    conditions: [],
    mode: '',
    patientName: '', patientAge: '', patientGender: '', patientMobile: '', patientLocation: '',
    preferredDate: '', preferredTime: '', medicalCondition: '',
    prescriptionFile: null, reportsFile: null, xrayFile: null,
    painLocation: '', painLevel: 5, painDuration: '', painUnit: 'Days', previousTreatments: [],
    therapist: null,
    package: null,
    payPerSession: false,
    paymentMethod: '',
  });
  const [confirmed, setConfirmed] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setData(d => ({ ...d, [key]: val }));
    setErrors(e => ({ ...e, [key]: null }));
  };

  const recommendedTherapists = data.mode
    ? therapists.filter(t => t.mode.includes(data.mode))
    : [];

  useEffect(() => {
    if (recommendedTherapists.length > 0 && !data.therapist) {
      const best = recommendedTherapists.reduce((a, b) => (a.rating > b.rating ? a : b));
      update('therapist', best);
    }
  }, [data.mode]);

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && data.conditions.length === 0) errs.conditions = t('physio.select.condition.error', 'Please select at least one condition');
    if (s === 1 && !data.mode) errs.mode = t('physio.select.mode.error', 'Please select a treatment mode');
    if (s === 2) {
      if (!data.patientName?.trim()) errs.patientName = t('name.required', 'Name is required');
      if (!data.patientAge || data.patientAge < 1) errs.patientAge = t('physio.age.error', 'Valid age is required');
      if (!data.patientGender) errs.patientGender = t('gender.required', 'Gender is required');
      if (!/^[0-9]{10}$/.test(data.patientMobile)) errs.patientMobile = t('mobile.required', 'Valid 10-digit mobile is required');
      if (!data.patientLocation?.trim()) errs.patientLocation = t('physio.location.required', 'Location is required');
      if (!data.preferredDate) errs.preferredDate = t('select.date', 'Please select a date');
      if (!data.preferredTime) errs.preferredTime = t('select.slot', 'Please select a time slot');
    }
    if (s === 6 && !data.paymentMethod) errs.paymentMethod = t('select.payment', 'Please select a payment method');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 6));
  };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const totalAmount = data.payPerSession ? 599 : (data.package?.price || 0);
  const whatsappNumber = '918978933399';

  const handleConfirm = () => {
    if (!validateStep(6)) return;
    setProcessing(true);
    setTimeout(() => {
      const booking = {
        id: 'JPH-' + Date.now().toString(36).toUpperCase(),
        ...data,
        therapistName: data.therapist?.name || '',
        packageName: data.payPerSession ? 'Pay Per Session' : (data.package?.name || ''),
        sessions: data.payPerSession ? 1 : (data.package?.sessions || 0),
        totalAmount,
        modeLabel: treatmentModes.find(m => m.id === data.mode)?.label || data.mode,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
      };
      const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
      bookings.push(booking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      setConfirmed(booking);
      toast(t('physio.booking.confirmed', 'Physiotherapy booking confirmed!'), 'success');
      setProcessing(false);
    }, 1500);
  };

  const getWALink = (booking) => {
    const msg = t('physio.wa.message', 'Hello Jeevan Health! I have booked a physiotherapy session. Booking ID: ') + booking.id +
      t('physio.wa.patient', '%0APatient: ') + booking.patientName +
      t('physio.wa.therapist', '%0A Therapist: ') + booking.therapistName +
      t('physio.wa.date', '%0ADate: ') + booking.preferredDate +
      t('physio.wa.time', '%0ATime: ') + booking.preferredTime +
      t('physio.wa.amount', '%0AAmount: ₹') + booking.totalAmount;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  if (confirmed) {
    return (
      <div className="page-section container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0D9488', marginBottom: 4 }}>{t('physio.booking.confirmed', 'Booking Confirmed!')}</h2>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>{t('physio.booking.confirmed.desc', 'Your physiotherapy session has been scheduled successfully.')}</p>
        <div style={{ padding: 20, borderRadius: 14, border: '1px solid #ccfbf1', background: '#f0fdfa', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('booking.id', 'Booking ID')}:</strong> {confirmed.id}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('patient', 'Patient')}:</strong> {confirmed.patientName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('physio.therapist', 'Therapist')}:</strong> {confirmed.therapistName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('physio.package', 'Package')}:</strong> {confirmed.packageName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('date', 'Date')}:</strong> {confirmed.preferredDate}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('time', 'Time')}:</strong> {confirmed.preferredTime}</div>
          <div style={{ borderTop: '1px solid #ccfbf1', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{t('total', 'Total')}</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#0D9488' }}>₹{confirmed.totalAmount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={getWALink(confirmed)} target="_blank" rel="noopener noreferrer" style={{ height: 44, padding: '0 24px', borderRadius: 8, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            💬 {t('send.whatsapp', 'Send WhatsApp Confirmation')}
          </a>
          <Link to="/physiotherapy" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #d0d5dd', color: '#0f172a', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>{t('back.to.physio', '← Back to Physiotherapy')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      {/* Gradient Header */}
      <div style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)', margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{t('physio.book.title', 'Book Physiotherapy')}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{t('physio.book.subtitle', 'Complete your booking in a few easy steps')}</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, margin: '0 auto 3px',
                background: i < step ? '#0D9488' : i === step ? '#0D9488' : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 8, color: i === step ? '#0D9488' : '#94a3b8', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{t(s.label)}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 28, height: 2, background: i < step ? '#0D9488' : '#e2e8f0', margin: '0 3px', marginBottom: 14 }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
        {/* Step 0: Service Selection - Conditions */}
        {step === 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('physio.select.condition', 'What brings you here?')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('physio.select.condition.desc', 'Select all conditions that apply to you')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allConditions.map(cond => {
                const selected = data.conditions.includes(cond);
                return (
                  <button key={cond} onClick={() => {
                    const next = selected ? data.conditions.filter(c => c !== cond) : [...data.conditions, cond];
                    update('conditions', next);
                  }} style={{ padding: '8px 14px', borderRadius: 20, border: selected ? '2px solid #0D9488' : '1px solid #e2e8f0', background: selected ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: selected ? 700 : 400, color: selected ? '#0D9488' : '#334155', display: 'inline-flex', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}>
                    <span>{conditionIcons(cond)}</span> {cond}
                  </button>
                );
              })}
            </div>
            {errors.conditions && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.conditions}</p>}
          </div>
        )}

        {/* Step 1: Treatment Mode */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('physio.select.mode', 'Preferred Treatment Mode')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {treatmentModes.map(mode => (
                <button key={mode.id} onClick={() => update('mode', mode.id)}
                  style={{ padding: 20, borderRadius: 12, border: data.mode === mode.id ? '2px solid #0D9488' : '1px solid #e2e8f0', background: data.mode === mode.id ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{mode.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{mode.label}</h4>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{mode.desc}</p>
                </button>
              ))}
            </div>
            {errors.mode && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.mode}</p>}
          </div>
        )}

        {/* Step 2: Patient Information */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('physio.patient.info', 'Patient Information')}</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('full.name', 'Full Name')} *</label>
                <input value={data.patientName} onChange={e => update('patientName', e.target.value)} placeholder="Patient's full name" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientName ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientName && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientName}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.age.years', 'Age (Years)')} *</label>
                  <input type="number" min={0} max={150} value={data.patientAge} onChange={e => update('patientAge', parseInt(e.target.value) || '')} placeholder="e.g. 35" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAge ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientAge && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAge}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('gender', 'Gender')} *</label>
                  <select value={data.patientGender} onChange={e => update('patientGender', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientGender ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">{t('select', 'Select')}</option>
                    <option value="male">{t('male', 'Male')}</option>
                    <option value="female">{t('female', 'Female')}</option>
                    <option value="other">{t('other', 'Other')}</option>
                  </select>
                  {errors.patientGender && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientGender}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('mobile.number', 'Mobile Number')} *</label>
                <input type="tel" value={data.patientMobile} onChange={e => update('patientMobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientMobile ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientMobile && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientMobile}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.location', 'Location')} *</label>
                <input value={data.patientLocation} onChange={e => update('patientLocation', e.target.value)} placeholder="Your area / locality" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientLocation ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientLocation && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientLocation}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('preferred.date', 'Preferred Date')} *</label>
                  <input type="date" value={data.preferredDate} onChange={e => update('preferredDate', e.target.value)} min={new Date().toISOString().slice(0, 10)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.preferredDate ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.preferredDate && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredDate}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('preferred.time', 'Preferred Time')} *</label>
                  <select value={data.preferredTime} onChange={e => update('preferredTime', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.preferredTime ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">{t('select', 'Select')}</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                  {errors.preferredTime && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredTime}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.medical.condition', 'Medical Condition / Notes')} ({t('optional', 'optional')})</label>
                <textarea value={data.medicalCondition} onChange={e => update('medicalCondition', e.target.value)} rows={2} placeholder="Describe your condition, allergies, or any medical history..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('physio.upload.documents', 'Upload Documents')} ({t('optional', 'optional')})</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { key: 'prescriptionFile', label: t('physio.upload.prescription', 'Prescription') },
                    { key: 'reportsFile', label: t('physio.upload.reports', 'Reports') },
                    { key: 'xrayFile', label: t('physio.upload.xray', 'X-Ray / MRI') },
                  ].map(f => (
                    <label key={f.key} style={{ padding: '8px 14px', borderRadius: 8, border: '1px dashed #d0d5dd', background: '#f8fafc', cursor: 'pointer', fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                      📎 {f.label}
                      <input type="file" hidden onChange={e => {
                        const file = e.target.files[0];
                        if (file) update(f.key, file.name);
                      }} />
                      {data[f.key] && <span style={{ color: '#0D9488', fontWeight: 600, marginLeft: 4 }}>✓</span>}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: AI Assessment */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('physio.ai.assessment', 'AI-Assisted Pain Assessment')}</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('physio.pain.location', 'Pain Location')}</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {bodyParts.map(part => (
                    <button key={part.value} onClick={() => update('painLocation', part.value)}
                      style={{ padding: '10px 16px', borderRadius: 10, border: data.painLocation === part.value ? '2px solid #0D9488' : '1px solid #e2e8f0', background: data.painLocation === part.value ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: data.painLocation === part.value ? 700 : 400, color: '#334155' }}>
                      <span style={{ fontSize: 18 }}>{part.icon}</span> {part.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('physio.pain.level', 'Pain Level')}</label>
                <div style={{ padding: '0 4px' }}>
                  <input type="range" min={0} max={10} value={data.painLevel} onChange={e => update('painLevel', parseInt(e.target.value))} style={{ width: '100%', accentColor: '#0D9488' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    <span>0 - {t('physio.pain.none', 'No Pain')}</span>
                    <span style={{ fontWeight: 700, color: '#0D9488', fontSize: 14 }}>{data.painLevel}/10</span>
                    <span>10 - {t('physio.pain.worst', 'Worst')}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#0D9488', fontWeight: 600, marginTop: 2 }}>{painLevels[data.painLevel]?.label}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.pain.duration', 'Pain Duration')}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="number" min={0} value={data.painDuration} onChange={e => update('painDuration', e.target.value)} placeholder="0" style={{ width: 80, padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                    <select value={data.painUnit} onChange={e => update('painUnit', e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                      {painDurations.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.previous.treatment', 'Previous Treatment')}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {previousTreatments.map(pt => {
                      const sel = data.previousTreatments.includes(pt);
                      const isNone = pt === 'None';
                      return (
                        <button key={pt} onClick={() => {
                          if (isNone) { update('previousTreatments', ['None']); return; }
                          const next = data.previousTreatments.filter(p => p !== 'None');
                          const n = sel ? next.filter(p => p !== pt) : [...next, pt];
                          update('previousTreatments', n.length === 0 ? ['None'] : n);
                        }} style={{ padding: '5px 12px', borderRadius: 14, border: sel ? '2px solid #0D9488' : '1px solid #e2e8f0', background: sel ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: sel ? 700 : 400, color: sel ? '#0D9488' : '#334155' }}>
                          {pt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Therapist Matching */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('physio.select.therapist', 'Choose Your Therapist')}</h3>
            {recommendedTherapists.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 24 }}>{t('physio.no.therapists', 'No therapists available for this mode. Please go back and select a different mode.')}</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {recommendedTherapists.map(th => (
                  <button key={th.id} onClick={() => update('therapist', th)}
                    style={{ padding: 16, borderRadius: 12, border: data.therapist?.id === th.id ? '2px solid #0D9488' : '1px solid #e2e8f0', background: data.therapist?.id === th.id ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                    {data.therapist?.id === th.id && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 18, color: '#0D9488' }}>✓</span>}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 32 }}>{th.image}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{th.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{th.qualifications} · {th.experience} {t('physio.years.exp', 'years experience')}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                          {th.specialties.map(sp => (
                            <span key={sp} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: '#f0fdfa', color: '#0D9488', fontWeight: 600 }}>{sp}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#64748b' }}>
                          <span>⭐ {th.rating} · {th.sessions} {t('physio.sessions', 'sessions')}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                          {th.availability.map((a, i) => (
                            <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#dbeafe', color: '#2563eb', fontWeight: 500 }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Package Selection */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('physio.select.package', 'Select a Package')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('physio.package.or.payper', 'Choose a package or pay per session')}</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {physioPackages.map(pkg => (
                <button key={pkg.id} onClick={() => { update('package', pkg); update('payPerSession', false); }}
                  style={{ padding: 16, borderRadius: 12, border: data.package?.id === pkg.id && !data.payPerSession ? '2px solid #0D9488' : '1px solid #e2e8f0', background: data.package?.id === pkg.id && !data.payPerSession ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                  {pkg.popular && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, padding: '2px 10px', borderRadius: 10, background: '#0D9488', color: '#fff', fontWeight: 700 }}>{t('physio.popular', 'Popular')}</span>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{pkg.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                        {pkg.isMonthly ? t('physio.monthly', 'Monthly Plan') : `${pkg.sessions} ${t('physio.sessions.lower', 'sessions')}`}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#475569', lineHeight: 1.7 }}>
                        {pkg.includes.map((inc, ii) => <li key={ii}>{inc}</li>)}
                      </ul>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#0D9488' }}>₹{pkg.price}</div>
                      {pkg.originalPrice && <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>₹{pkg.originalPrice}</div>}
                      {pkg.originalPrice && <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 600 }}>{Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% {t('physio.off', 'OFF')}</div>}
                    </div>
                  </div>
                </button>
              ))}
              {/* Pay Per Session */}
              <button onClick={() => { update('package', null); update('payPerSession', true); }}
                style={{ padding: 16, borderRadius: 12, border: data.payPerSession ? '2px solid #0D9488' : '1px solid #e2e8f0', background: data.payPerSession ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{t('physio.pay.per.session', 'Pay Per Session')}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0D9488' }}>₹599<span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}> /{t('physio.session', 'session')}</span></div>
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Payment & Confirmation */}
        {step === 6 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('payment.method', 'Payment Method')}</h3>
            {/* Order Summary */}
            <div style={{ padding: 14, borderRadius: 10, background: '#f0fdfa', border: '1px solid #ccfbf1', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{t('booking.summary', 'Booking Summary')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('physio.conditions', 'Conditions')}</span><span style={{ fontWeight: 600 }}>{data.conditions.join(', ')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('physio.mode', 'Mode')}</span><span style={{ fontWeight: 600 }}>{treatmentModes.find(m => m.id === data.mode)?.label}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('patient', 'Patient')}</span><span style={{ fontWeight: 600 }}>{data.patientName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('physio.therapist', 'Therapist')}</span><span style={{ fontWeight: 600 }}>{data.therapist?.name}</span></div>
              {!data.payPerSession && data.package && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('physio.package', 'Package')}</span><span style={{ fontWeight: 600 }}>{data.package.name}</span></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('date', 'Date')}</span><span style={{ fontWeight: 600 }}>{data.preferredDate}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}><span style={{ color: '#64748b' }}>{t('time', 'Time')}</span><span style={{ fontWeight: 600 }}>{data.preferredTime}</span></div>
              <div style={{ borderTop: '1px solid #ccfbf1', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span><span style={{ fontWeight: 800, color: '#0D9488', fontSize: 18 }}>₹{totalAmount}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => update('paymentMethod', m.id)}
                  style={{ padding: '12px 16px', borderRadius: 10, border: data.paymentMethod === m.id ? '2px solid #0D9488' : '1px solid #e2e8f0', background: data.paymentMethod === m.id ? '#f0fdfa' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{t(m.label)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{t(m.desc)}</div>
                  </div>
                </button>
              ))}
            </div>
            {errors.paymentMethod && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.paymentMethod}</p>}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={prev} disabled={step === 0}
          style={{ height: 44, padding: '0 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: step === 0 ? '#f8f9fa' : '#fff', color: step === 0 ? '#ccc' : '#0f172a', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          ← {t('back', 'Back')}
        </button>
        {step < 6 ? (
          <button onClick={next}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#0D9488', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {t('continue', 'Continue')} →
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={processing}
            style={{ height: 44, padding: '0 28px', borderRadius: 8, border: 'none', background: processing ? '#94a3b8' : '#0D9488', color: '#fff', cursor: processing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            {processing ? t('processing', 'Processing...') : `${t('confirm.pay', 'Confirm & Pay')} ₹${totalAmount}`}
          </button>
        )}
      </div>
    </div>
  );
}
