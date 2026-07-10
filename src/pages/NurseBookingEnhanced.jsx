import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingCategories, nursingServices, nurseLevels, nurses, nursingPackages, STORAGE_KEYS } from '../data/nursingData';

const C = { primary: '#7C3AED', accent: '#EC4899', bg: '#F5F3FF' };

const STEPS = [
  { id: 'service', label: 'nurse.step.service', icon: '🩺' },
  { id: 'documents', label: 'nurse.step.documents', icon: '📄' },
  { id: 'patient', label: 'nurse.step.patient', icon: '👤' },
  { id: 'schedule', label: 'nurse.step.schedule', icon: '📅' },
  { id: 'payment', label: 'nurse.step.payment', icon: '💳' },
  { id: 'confirm', label: 'nurse.step.confirm', icon: '✅' },
];

const TIME_SLOTS = [
  { label: '6:00 AM - 8:00 AM', value: '6-8' }, { label: '8:00 AM - 10:00 AM', value: '8-10' },
  { label: '10:00 AM - 12:00 PM', value: '10-12' }, { label: '12:00 PM - 2:00 PM', value: '12-14' },
  { label: '2:00 PM - 4:00 PM', value: '14-16' }, { label: '4:00 PM - 6:00 PM', value: '16-18' },
  { label: '6:00 PM - 8:00 PM', value: '18-20' }, { label: '8:00 PM - 10:00 PM', value: '20-22' },
];

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '60 min', '2 hours', '4 hours', '8 hours', '12 hours', '24 hours'];

const URGENCY_OPTIONS = [
  { id: 'standard', label: 'nurse.standard', desc: 'nurse.standard.desc', color: '#10B981' },
  { id: 'urgent', label: 'nurse.urgent', desc: 'nurse.urgent.desc', color: '#F59E0B' },
  { id: 'emergency', label: 'nurse.emergency', desc: 'nurse.emergency.desc', color: '#EF4444' },
];

const PAYMENT_OPTIONS = [
  { id: 'online', label: 'nurse.pay.online', desc: 'Pay with UPI, Cards, Net Banking', icon: '💳' },
  { id: 'cash', label: 'nurse.pay.cash', desc: 'Pay cash to the nurse after service', icon: '💵' },
  { id: 'insurance', label: 'nurse.pay.insurance', desc: 'Submit insurance claim', icon: '🛡️' },
];

export default function NurseBookingEnhanced() {
  const t = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSlug = searchParams.get('service');
  const prePlan = searchParams.get('plan');

  const [step, setStep] = useState(preSlug || prePlan ? 1 : 0);
  const [catFilter, setCatFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const [data, setData] = useState({
    service: nursingServices.find(s => s.slug === preSlug) || null,
    nurse: null, noPreference: false,
    patientName: '', patientPhone: '', patientEmail: '', patientAddress: '',
    patientAge: '', patientGender: '', medicalNotes: '',
    preferredDate: '', preferredTime: '', duration: '', urgency: 'standard',
    dateOption: 'today',
    condition: '', hospitalName: '', doctorName: '', surgeryDetails: '', currentMedication: '',
    documents: [], paymentMethod: 'online',
    assessmentRequired: true, assessmentNotes: '',
    carePlanDuration: prePlan || '',
  });
  const [confirmed, setConfirmed] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const update = (key, val) => { setData(d => ({ ...d, [key]: val })); setErrors(e => ({ ...e, [key]: null })); };

  const filteredServices = catFilter === 'all' ? nursingServices : nursingServices.filter(s => s.category === catFilter);

  const filteredNurses = data.service
    ? nurses.filter(n => {
        const matchesSpecialty = n.specialties.includes(data.service.category);
        const matchesLevel = levelFilter === 'all' || n.level === levelFilter;
        return matchesSpecialty && matchesLevel;
      })
    : [];

  const baseRate = nurseLevels.find(l => l.id === 'staff-nurse')?.hourlyRate || 599;
  const getNurseSurcharge = () => {
    if (!data.nurse) return 0;
    const nl = nurseLevels.find(l => l.id === data.nurse.level);
    return nl ? Math.max(0, nl.hourlyRate - baseRate) : 0;
  };
  const surcharge = getNurseSurcharge();
  const totalAmount = data.service ? data.service.price + surcharge : 0;

  const formatDate = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
  const todayStr = formatDate(0);

  const dateOptions = [
    { label: t('nurse.today', 'Today'), value: 'today', dateVal: formatDate(0) },
    { label: t('nurse.tomorrow', 'Tomorrow'), value: 'tomorrow', dateVal: formatDate(1) },
    { label: t('nurse.dayafter', 'Day After'), value: 'dayafter', dateVal: formatDate(2) },
    { label: t('nurse.custom', 'Custom Date'), value: 'custom', dateVal: '' },
  ];

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && !data.service) errs.service = t('nurse.err.service', 'Please select a service');
    if (s === 1 && !data.nurse && !data.noPreference) errs.nurse = t('nurse.err.nurse', 'Please select a nurse or choose auto-assign');
    if (s === 2) {
      if (!data.patientName?.trim()) errs.patientName = t('nurse.err.name', 'Name is required');
      if (!/^[0-9]{10}$/.test(data.patientPhone)) errs.patientPhone = t('nurse.err.phone', 'Valid 10-digit mobile is required');
      if (!data.patientEmail?.includes('@')) errs.patientEmail = t('nurse.err.email', 'Valid email is required');
      if (!data.patientAddress?.trim()) errs.patientAddress = t('nurse.err.address', 'Address is required');
      if (!data.patientAge || data.patientAge < 1 || data.patientAge > 150) errs.patientAge = t('nurse.err.age', 'Valid age is required');
      if (!data.patientGender) errs.patientGender = t('nurse.err.gender', 'Gender is required');
    }
    if (s === 3) {
      if (!data.preferredDate) errs.preferredDate = t('nurse.err.date', 'Please select a date');
      if (!data.preferredTime) errs.preferredTime = t('nurse.err.time', 'Please select a time slot');
    }
    if (s === 4) {
      if (!data.paymentMethod) errs.paymentMethod = t('nurse.err.payment', 'Please select a payment method');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 5)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleDocUpload = () => {
    setUploadingDoc(true);
    setTimeout(() => {
      const docs = [...data.documents, { id: Date.now(), name: `${t('nurse.document', 'Document')} ${data.documents.length + 1}`, type: 'prescription', uploadedAt: new Date().toISOString() }];
      update('documents', docs);
      setUploadingDoc(false);
    }, 1000);
  };

  const handleConfirm = () => {
    if (!validateStep(4)) return;
    setProcessing(true);
    setTimeout(() => {
      const booking = {
        id: 'NUR-' + Date.now().toString(36).toUpperCase(),
        serviceName: data.service?.name || '',
        servicePrice: data.service?.price || 0,
        serviceDuration: data.service?.duration || '',
        nurseName: data.noPreference ? 'Auto-assigned' : (data.nurse?.name || ''),
        nurseLevel: data.nurse?.level || '',
        patientName: data.patientName, patientPhone: data.patientPhone, patientEmail: data.patientEmail,
        patientAddress: data.patientAddress, patientAge: data.patientAge, patientGender: data.patientGender,
        medicalNotes: data.medicalNotes || '',
        condition: data.condition || '', hospitalName: data.hospitalName || '', doctorName: data.doctorName || '',
        surgeryDetails: data.surgeryDetails || '', currentMedication: data.currentMedication || '',
        documents: data.documents, paymentMethod: data.paymentMethod,
        assessmentRequired: data.assessmentRequired, assessmentNotes: data.assessmentNotes || '',
        carePlanDuration: data.carePlanDuration || '',
        preferredDate: data.preferredDate, preferredTime: data.preferredTime,
        duration: data.duration || data.service?.duration || '',
        urgency: data.urgency, totalAmount, status: 'Pending Assessment',
        createdAt: new Date().toISOString(),
      };
      const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
      bookings.push(booking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      // Save as CRM lead
      const leads = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
      leads.push({ ...booking, leadId: 'LD-' + Date.now().toString(36).toUpperCase(), stage: 'call-centre', source: 'website-booking' });
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      setConfirmed(booking);
      setProcessing(false);
    }, 1500);
  };

  const getWALink = (booking) => {
    const msg = `Hello Jeevan Health! I have booked a nursing service.%0ABooking ID: ${booking.id}%0AService: ${booking.serviceName}%0ANurse: ${booking.nurseName}%0APatient: ${booking.patientName}%0ADate: ${booking.preferredDate}%0ATime: ${booking.preferredTime}%0AAmount: ₹${booking.totalAmount}`;
    return `https://wa.me/919700104108?text=${encodeURIComponent(msg)}`;
  };

  if (confirmed) {
    return (
      <div className="page-section container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.primary, marginBottom: 4 }}>{t('nurse.booking.confirmed', 'Booking Confirmed!')}</h2>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>{t('nurse.booking.confirmed.desc', 'Your booking has been received. Our care manager will call you within 30 minutes for assessment.')}</p>
        <div style={{ padding: 16, borderRadius: 12, border: '1px solid #ede9fe', background: '#f5f3ff', marginBottom: 16, textAlign: 'left', fontSize: 12 }}>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.booking.id', 'Booking ID')}:</strong> {confirmed.id}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.service', 'Service')}:</strong> {confirmed.serviceName}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.nurse', 'Nurse')}:</strong> {confirmed.nurseName}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('patient', 'Patient')}:</strong> {confirmed.patientName}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('date', 'Date')}:</strong> {confirmed.preferredDate}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('time', 'Time')}:</strong> {confirmed.preferredTime}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.status', 'Status')}:</strong> <span style={{ padding: '2px 8px', borderRadius: 4, background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 600 }}>{confirmed.status}</span></div>
          <div style={{ borderTop: '1px solid #ede9fe', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: C.primary }}>₹{confirmed.totalAmount}</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a' }}>
          📞 {t('nurse.booking.assessment', 'Our care manager will call you for a detailed assessment before assigning a nurse.')}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={getWALink(confirmed)} target="_blank" rel="noopener noreferrer" style={{ height: 44, padding: '0 24px', borderRadius: 8, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            💬 {t('nurse.sendWhatsApp', 'Send WhatsApp Confirmation')}
          </a>
          <Link to="/nurse-at-home" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #d0d5dd', color: '#0f172a', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
            ← {t('nurse.back', 'Back to Nurse at Home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{t('nurse.booking.title', 'Book Nurse at Home')}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{t('nurse.booking.subtitle', 'Complete your booking in 5 easy steps')}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, margin: '0 auto 3px',
                background: i < step ? C.primary : i === step ? C.primary : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8' }}>
                {i < step ? '✓' : s.icon}
              </div>
              <div style={{ fontSize: 8, color: i === step ? C.primary : '#94a3b8', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{t(s.label)}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 24, height: 2, background: i < step ? C.primary : '#e2e8f0', marginBottom: 14 }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
        {/* Step 0: Service Selection */}
        {step === 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nurse.select.service', 'Select a Service')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.select.service.desc', 'Choose the nursing care service you need')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              <button onClick={() => setCatFilter('all')}
                style={{ padding: '6px 14px', borderRadius: 16, border: catFilter === 'all' ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: catFilter === 'all' ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: catFilter === 'all' ? 700 : 400, color: catFilter === 'all' ? C.primary : '#334155' }}>
                {t('all', 'All')}
              </button>
              {nursingCategories.map(cat => (
                <button key={cat.id} onClick={() => setCatFilter(cat.slug)}
                  style={{ padding: '6px 14px', borderRadius: 16, border: catFilter === cat.slug ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: catFilter === cat.slug ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              {filteredServices.map(svc => {
                const selected = data.service?.id === svc.id;
                const cat = nursingCategories.find(c => c.slug === svc.category);
                return (
                  <button key={svc.id} onClick={() => { update('service', svc); setErrors(e => ({ ...e, service: null })) }}
                    style={{ padding: 14, borderRadius: 12, border: selected ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: selected ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                    {selected && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: C.primary }}>✓</span>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{svc.name}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>₹{svc.price}</div>
                        {svc.originalPrice && <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>₹{svc.originalPrice}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      {cat && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#fdf2f8', color: '#EC4899', fontWeight: 600 }}>{cat.icon} {cat.name}</span>}
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#f0fdf4', color: '#059669', fontWeight: 600 }}>{svc.duration}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{svc.description}</p>
                  </button>
                );
              })}
            </div>
            {errors.service && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.service}</p>}
          </div>
        )}

        {/* Step 1: Medical Documents Upload */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nurse.documents.title', 'Upload Medical Documents')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.documents.subtitle', 'Upload prescription, discharge summary, or medical reports (optional)')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { icon: '📄', label: t('nurse.doc.prescription', 'Upload Prescription'), color: '#3B82F6' },
                { icon: '📋', label: t('nurse.doc.discharge', 'Upload Discharge Summary'), color: '#8B5CF6' },
                { icon: '📊', label: t('nurse.doc.reports', 'Upload Medical Reports'), color: '#F59E0B' },
                { icon: '📝', label: t('nurse.doc.advice', 'Upload Doctor Advice'), color: '#EC4899' },
              ].map(doc => (
                <button key={doc.label} onClick={handleDocUpload} disabled={uploadingDoc}
                  style={{ padding: 16, borderRadius: 10, border: `1px solid ${doc.color}30`, background: `${doc.color}06`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{doc.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: doc.color }}>{doc.label}</div>
                </button>
              ))}
            </div>
            {uploadingDoc && <p style={{ fontSize: 12, color: C.primary, textAlign: 'center' }}>{t('nurse.uploading', 'Uploading...')}</p>}
            {data.documents.length > 0 && (
              <div style={{ padding: 10, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 4 }}>✓ {data.documents.length} {t('nurse.documents.uploaded', 'document(s) uploaded')}</div>
                {data.documents.map(d => <div key={d.id} style={{ fontSize: 11, color: '#475569', padding: '2px 0' }}>📄 {d.name}</div>)}
              </div>
            )}
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nurse.medical.details', 'Medical Details')}</h4>
              <div style={{ display: 'grid', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.condition', 'Disease / Condition')}</label>
                  <input value={data.condition} onChange={e => update('condition', e.target.value)} placeholder="e.g. Diabetes, Post-Heart Surgery" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.hospital', 'Hospital Name')}</label>
                    <input value={data.hospitalName} onChange={e => update('hospitalName', e.target.value)} placeholder="Hospital name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.doctor', 'Doctor Name')}</label>
                    <input value={data.doctorName} onChange={e => update('doctorName', e.target.value)} placeholder="Doctor's name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.surgery', 'Surgery Details')}</label>
                  <input value={data.surgeryDetails} onChange={e => update('surgeryDetails', e.target.value)} placeholder="Surgery type, date, hospital" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.medication', 'Current Medication')}</label>
                  <textarea value={data.currentMedication} onChange={e => update('currentMedication', e.target.value)} rows={2} placeholder="List current medications and dosages" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Patient Information */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nurse.patient.info', 'Patient Information')}</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('full.name', 'Full Name')} *</label>
                <input value={data.patientName} onChange={e => update('patientName', e.target.value)} placeholder={t('nurse.name.placeholder', "Patient's full name")} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientName ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientName && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientName}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('mobile.number', 'Mobile Number')} *</label>
                  <input type="tel" value={data.patientPhone} onChange={e => update('patientPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientPhone ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientPhone && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientPhone}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('email', 'Email')} *</label>
                  <input type="email" value={data.patientEmail} onChange={e => update('patientEmail', e.target.value)} placeholder="email@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientEmail ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientEmail && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientEmail}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('address', 'Address')} *</label>
                <textarea value={data.patientAddress} onChange={e => update('patientAddress', e.target.value)} rows={2} placeholder={t('nurse.address.placeholder', 'Full address with landmark, city, pincode')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAddress ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                {errors.patientAddress && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAddress}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('age', 'Age')} *</label>
                  <input type="number" min={0} max={150} value={data.patientAge} onChange={e => update('patientAge', parseInt(e.target.value) || '')} placeholder="e.g. 35" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAge ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientAge && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAge}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('gender', 'Gender')} *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} onClick={() => update('patientGender', g)}
                        style={{ flex: 1, padding: '10px 8px', borderRadius: 8, border: data.patientGender === g ? `2px solid ${C.primary}` : '1px solid #d0d5dd', background: data.patientGender === g ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.patientGender === g ? 700 : 400, color: data.patientGender === g ? C.primary : '#334155' }}>
                        {t(g, g.charAt(0).toUpperCase() + g.slice(1))}
                      </button>
                    ))}
                  </div>
                  {errors.patientGender && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientGender}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nurse.schedule.title', 'Schedule Your Visit')}</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nurse.date', 'Preferred Date')} *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {dateOptions.map(opt => (
                    <button key={opt.value} onClick={() => { update('dateOption', opt.value); update('preferredDate', opt.value === 'custom' ? '' : opt.dateVal) }}
                      style={{ padding: '8px 14px', borderRadius: 8, border: data.dateOption === opt.value ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.dateOption === opt.value ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.dateOption === opt.value ? 700 : 400, color: data.dateOption === opt.value ? C.primary : '#334155' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {data.dateOption === 'custom' && (
                  <input type="date" value={data.preferredDate} onChange={e => update('preferredDate', e.target.value)} min={todayStr} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.preferredDate ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                )}
                {errors.preferredDate && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredDate}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nurse.time', 'Preferred Time Slot')} *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot.value} onClick={() => update('preferredTime', slot.value)}
                      style={{ padding: '10px 12px', borderRadius: 8, border: data.preferredTime === slot.value ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.preferredTime === slot.value ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.preferredTime === slot.value ? 700 : 400, color: '#0f172a' }}>
                      {slot.label}
                    </button>
                  ))}
                </div>
                {errors.preferredTime && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredTime}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.duration', 'Duration')}</label>
                <select value={data.duration} onChange={e => update('duration', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  {data.service?.duration && <option value={data.service.duration}>{data.service.duration} ({t('nurse.recommended', 'Recommended')})</option>}
                  {DURATION_OPTIONS.filter(d => d !== data.service?.duration).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nurse.urgency', 'Urgency Level')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {URGENCY_OPTIONS.map(u => (
                    <button key={u.id} onClick={() => update('urgency', u.id)}
                      style={{ padding: '12px 8px', borderRadius: 10, border: data.urgency === u.id ? `2px solid ${u.color}` : '1px solid #e2e8f0', background: data.urgency === u.id ? `${u.color}10` : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: data.urgency === u.id ? u.color : '#0f172a', marginBottom: 2 }}>{t(u.label)}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{t(u.desc)}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#92400e', cursor: 'pointer' }}>
                  <input type="checkbox" checked={data.assessmentRequired} onChange={e => update('assessmentRequired', e.target.checked)} style={{ accentColor: C.primary }} />
                  {t('nurse.assessment.required', 'I need a care assessment call before service')}
                </label>
                {data.assessmentRequired && (
                  <textarea value={data.assessmentNotes} onChange={e => update('assessmentNotes', e.target.value)} rows={2}
                    placeholder={t('nurse.assessment.notes', 'Any specific requirements for the assessment call...')}
                    style={{ width: '100%', marginTop: 8, padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nurse.payment.title', 'Payment Method')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.payment.subtitle', 'Choose how you would like to pay')}</p>
            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              {PAYMENT_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => update('paymentMethod', opt.id)}
                  style={{ padding: 16, borderRadius: 10, border: data.paymentMethod === opt.id ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.paymentMethod === opt.id ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t(opt.label)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{opt.desc}</div>
                  </div>
                  {data.paymentMethod === opt.id && <span style={{ marginLeft: 'auto', fontSize: 20, color: C.primary }}>✓</span>}
                </button>
              ))}
            </div>
            {errors.paymentMethod && <p style={{ fontSize: 11, color: '#dc2626', marginBottom: 8 }}>{errors.paymentMethod}</p>}
            <div style={{ padding: 14, borderRadius: 10, background: C.bg, border: `1px solid ${C.primary}20` }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nurse.price.summary', 'Price Summary')}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: '#64748b' }}>{t('nurse.service.charge', 'Service Charge')}</span>
                <span style={{ fontWeight: 600 }}>₹{data.service?.price}</span>
              </div>
              {surcharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>{t('nurse.nurse.surcharge', 'Nurse Level Surcharge')}</span>
                  <span style={{ fontWeight: 600 }}>+ ₹{surcharge}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, borderTop: '1px solid #d0d5dd', marginTop: 6, paddingTop: 6 }}>
                <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span>
                <span style={{ fontWeight: 800, color: C.primary }}>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nurse.review.title', 'Review & Confirm')}</h3>
            <div style={{ padding: 16, borderRadius: 12, background: C.bg, border: `1px solid ${C.primary}20`, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 10 }}>{t('nurse.review.summary', 'Booking Summary')}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                <Row label={t('nurse.service', 'Service')} value={data.service?.name} />
                <Row label={t('nurse.duration', 'Duration')} value={data.duration || data.service?.duration} />
                <Row label={t('nurse.nurse', 'Nurse')} value={data.noPreference ? 'Auto-assigned' : data.nurse?.name} />
                <Row label={t('patient', 'Patient')} value={data.patientName} />
                <Row label={t('date', 'Date')} value={data.preferredDate} />
                <Row label={t('time', 'Time')} value={TIME_SLOTS.find(s => s.value === data.preferredTime)?.label || data.preferredTime} />
                <Row label={t('nurse.payment', 'Payment')} value={PAYMENT_OPTIONS.find(o => o.id === data.paymentMethod)?.icon + ' ' + t(PAYMENT_OPTIONS.find(o => o.id === data.paymentMethod)?.label || '')} />
                <Row label={t('nurse.assessment.call', 'Assessment Call')} value={data.assessmentRequired ? 'Yes' : 'No'} />
              </div>
              <div style={{ borderTop: `1px solid ${C.primary}20`, marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
                <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span>
                <span style={{ fontWeight: 800, color: C.primary }}>₹{totalAmount}</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', margin: 0 }}>
              {t('nurse.disclaimer', 'By confirming, you agree to our terms of service and cancellation policy. A care manager will contact you for assessment.')}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={prev} disabled={step === 0}
          style={{ height: 44, padding: '0 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: step === 0 ? '#f8f9fa' : '#fff', color: step === 0 ? '#ccc' : '#0f172a', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          ← {t('back', 'Back')}
        </button>
        {step < 5 ? (
          <button onClick={next}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {t('continue', 'Continue')} →
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={processing}
            style={{ height: 44, padding: '0 28px', borderRadius: 8, border: 'none', background: processing ? '#94a3b8' : `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: '#fff', cursor: processing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {processing ? t('processing', 'Processing...') : `${t('nurse.confirm.booking', 'Confirm Booking')} ₹${totalAmount}`}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#0f172a' }}>{value || '-'}</span>
    </div>
  );
}
