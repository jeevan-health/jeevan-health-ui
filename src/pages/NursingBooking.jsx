import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { useToast } from '../components/Toast';
import {
  nursingCategories, nursingServices, nurseLevels, nurses, nursingPackages, STORAGE_KEYS,
} from '../data/nursingData';

const STEPS = [
  { id: 'service', label: 'nursing.step.service' },
  { id: 'nurse', label: 'nursing.step.nurse' },
  { id: 'patient', label: 'nursing.step.patient' },
  { id: 'schedule', label: 'nursing.step.schedule' },
  { id: 'confirm', label: 'nursing.step.confirm' },
];

const URGENCY_OPTIONS = [
  { id: 'standard', label: 'nursing.urgency.standard', desc: 'nursing.urgency.standard.desc', color: '#10B981' },
  { id: 'urgent', label: 'nursing.urgency.urgent', desc: 'nursing.urgency.urgent.desc', color: '#F59E0B' },
  { id: 'emergency', label: 'nursing.urgency.emergency', desc: 'nursing.urgency.emergency.desc', color: '#EF4444' },
];

const TIME_SLOTS = [
  { label: '6:00 AM - 8:00 AM', value: '6-8' },
  { label: '8:00 AM - 10:00 AM', value: '8-10' },
  { label: '10:00 AM - 12:00 PM', value: '10-12' },
  { label: '12:00 PM - 2:00 PM', value: '12-14' },
  { label: '2:00 PM - 4:00 PM', value: '14-16' },
  { label: '4:00 PM - 6:00 PM', value: '16-18' },
  { label: '6:00 PM - 8:00 PM', value: '18-20' },
  { label: '8:00 PM - 10:00 PM', value: '20-22' },
];

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '60 min', '2 hours', '4 hours', '8 hours', '12 hours', '24 hours'];

const whatsappNumber = '918978933399';

export default function NursingBooking() {
  const t = useT();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSlug = searchParams.get('service');

  const [step, setStep] = useState(preSlug ? 1 : 0);
  const [catFilter, setCatFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [data, setData] = useState({
    service: nursingServices.find(s => s.slug === preSlug) || null,
    nurse: null,
    noPreference: false,
    patientName: '', patientPhone: '', patientEmail: '', patientAddress: '',
    patientAge: '', patientGender: '', medicalNotes: '',
    preferredDate: '', preferredTime: '', duration: '', urgency: 'standard',
    dateOption: 'today',
  });
  const [confirmed, setConfirmed] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setData(d => ({ ...d, [key]: val }));
    setErrors(e => ({ ...e, [key]: null }));
  };

  const filteredServices = catFilter === 'all'
    ? nursingServices
    : nursingServices.filter(s => s.category === catFilter);

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
    if (!nl) return 0;
    return Math.max(0, nl.hourlyRate - baseRate);
  };

  const surcharge = getNurseSurcharge();
  const totalAmount = data.service ? data.service.price + surcharge : 0;

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && !data.service) errs.service = t('nursing.booking.select.service.error', 'Please select a service');
    if (s === 1 && !data.nurse && !data.noPreference) errs.nurse = t('nursing.booking.select.nurse.error', 'Please select a nurse or choose auto-assign');
    if (s === 2) {
      if (!data.patientName?.trim()) errs.patientName = t('name.required', 'Name is required');
      if (!/^[0-9]{10}$/.test(data.patientPhone)) errs.patientPhone = t('mobile.required', 'Valid 10-digit mobile is required');
      if (!data.patientEmail?.includes('@')) errs.patientEmail = t('email.required', 'Valid email is required');
      if (!data.patientAddress?.trim()) errs.patientAddress = t('address.required', 'Address is required');
      if (!data.patientAge || data.patientAge < 1 || data.patientAge > 150) errs.patientAge = t('age.error', 'Valid age is required');
      if (!data.patientGender) errs.patientGender = t('gender.required', 'Gender is required');
    }
    if (s === 3) {
      if (!data.preferredDate) errs.preferredDate = t('select.date', 'Please select a date');
      if (!data.preferredTime) errs.preferredTime = t('select.slot', 'Please select a time slot');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 4));
  };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleConfirm = () => {
    if (!validateStep(3)) return;
    setProcessing(true);
    setTimeout(() => {
      const booking = {
        id: 'NUR-' + Date.now().toString(36).toUpperCase(),
        serviceName: data.service?.name || '',
        servicePrice: data.service?.price || 0,
        serviceDuration: data.service?.duration || '',
        nurseName: data.noPreference ? 'Auto-assigned' : (data.nurse?.name || ''),
        nurseLevel: data.nurse?.level || '',
        patientName: data.patientName,
        patientPhone: data.patientPhone,
        patientEmail: data.patientEmail,
        patientAddress: data.patientAddress,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        medicalNotes: data.medicalNotes || '',
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        duration: data.duration || data.service?.duration || '',
        urgency: data.urgency,
        totalAmount,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
      bookings.push(booking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      setConfirmed(booking);
      toast(t('nursing.booking.confirmed', 'Nursing booking confirmed!'), 'success');
      setProcessing(false);
    }, 1500);
  };

  const getWALink = (booking) => {
    const msg = t('nursing.booking.wa.message', 'Hello Jeevan Health! I have booked a nursing service. Booking ID: ') + booking.id +
      t('nursing.booking.wa.service', '%0AService: ') + booking.serviceName +
      t('nursing.booking.wa.nurse', '%0ANurse: ') + booking.nurseName +
      t('nursing.booking.wa.patient', '%0APatient: ') + booking.patientName +
      t('nursing.booking.wa.date', '%0ADate: ') + booking.preferredDate +
      t('nursing.booking.wa.time', '%0ATime: ') + booking.preferredTime +
      t('nursing.booking.wa.amount', '%0AAmount: \u20B9') + booking.totalAmount;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  const formatDate = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  const todayStr = formatDate(0);
  const tomorrowStr = formatDate(1);
  const dayAfterStr = formatDate(2);

  const dateOptions = [
    { label: t('nursing.booking.today', 'Today'), value: 'today', dateVal: todayStr },
    { label: t('nursing.booking.tomorrow', 'Tomorrow'), value: 'tomorrow', dateVal: tomorrowStr },
    { label: t('nursing.booking.dayafter', 'Day After'), value: 'dayafter', dateVal: dayAfterStr },
    { label: t('nursing.booking.custom', 'Custom Date'), value: 'custom', dateVal: '' },
  ];

  if (confirmed) {
    return (
      <div className="page-section container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>&#9989;</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>
          {t('nursing.booking.confirmed', 'Booking Confirmed!')}
        </h2>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>
          {t('nursing.booking.confirmed.desc', 'Your nursing service has been booked successfully.')}
        </p>
        <div style={{ padding: 20, borderRadius: 14, border: '1px solid #ede9fe', background: '#f5f3ff', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('booking.id', 'Booking ID')}:</strong> {confirmed.id}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('nursing.service', 'Service')}:</strong> {confirmed.serviceName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('nursing.nurse', 'Nurse')}:</strong> {confirmed.nurseName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('patient', 'Patient')}:</strong> {confirmed.patientName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('date', 'Date')}:</strong> {confirmed.preferredDate}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('time', 'Time')}:</strong> {confirmed.preferredTime}</div>
          <div style={{ borderTop: '1px solid #ede9fe', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{t('total', 'Total')}</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#7C3AED' }}>&#x20B9;{confirmed.totalAmount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={getWALink(confirmed)} target="_blank" rel="noopener noreferrer" style={{ height: 44, padding: '0 24px', borderRadius: 8, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            &#128172; {t('send.whatsapp', 'Send WhatsApp Confirmation')}
          </a>
          <Link to="/nursing-care" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #d0d5dd', color: '#0f172a', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
            {t('nursing.back', '\u2190 Back to Nursing Care')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{t('nursing.booking.title', 'Book Nursing Care')}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{t('nursing.booking.subtitle', 'Complete your booking in a few easy steps')}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, margin: '0 auto 3px',
                background: i < step ? '#7C3AED' : i === step ? '#7C3AED' : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8' }}>
                {i < step ? '\u2713' : i + 1}
              </div>
              <div style={{ fontSize: 8, color: i === step ? '#7C3AED' : '#94a3b8', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{t(s.label)}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 28, height: 2, background: i < step ? '#7C3AED' : '#e2e8f0', margin: '0 3px', marginBottom: 14 }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
        {/* Step 0: Service Selection */}
        {step === 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nursing.booking.select.service', 'Select a Service')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nursing.booking.select.service.desc', 'Choose the nursing care service you need')}</p>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              <button onClick={() => setCatFilter('all')}
                style={{ padding: '6px 14px', borderRadius: 16, border: catFilter === 'all' ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: catFilter === 'all' ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: catFilter === 'all' ? 700 : 400, color: catFilter === 'all' ? '#7C3AED' : '#334155' }}>
                {t('nursing.all', 'All')}
              </button>
              {nursingCategories.map(cat => (
                <button key={cat.id} onClick={() => setCatFilter(cat.slug)}
                  style={{ padding: '6px 14px', borderRadius: 16, border: catFilter === cat.slug ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: catFilter === cat.slug ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: catFilter === cat.slug ? 700 : 400, color: catFilter === cat.slug ? '#7C3AED' : '#334155', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
            {/* Service Cards Grid */}
            <div style={{ display: 'grid', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              {filteredServices.map(svc => {
                const selected = data.service?.id === svc.id;
                const cat = nursingCategories.find(c => c.slug === svc.category);
                return (
                  <button key={svc.id} onClick={() => { update('service', svc); setErrors(e => ({ ...e, service: null })) }}
                    style={{ padding: 14, borderRadius: 12, border: selected ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: selected ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                    {selected && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: '#7C3AED' }}>&#10003;</span>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{svc.name}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#7C3AED' }}>&#x20B9;{svc.price}</div>
                        {svc.originalPrice && <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>&#x20B9;{svc.originalPrice}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      {cat && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#fdf2f8', color: '#EC4899', fontWeight: 600 }}>{cat.icon} {cat.name}</span>}
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#f0fdf4', color: '#059669', fontWeight: 600 }}>{svc.duration}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{svc.description}</p>
                  </button>
                );
              })}
            </div>
            {data.service && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#f5f3ff', border: '1px solid #ddd6fe', fontSize: 13, fontWeight: 600, color: '#5B21B6' }}>
                {t('nursing.booking.selected', 'Selected')}: {data.service.name} &mdash; &#x20B9;{data.service.price}
              </div>
            )}
            {errors.service && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.service}</p>}
          </div>
        )}

        {/* Step 1: Nurse Selection */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nursing.booking.select.nurse', 'Choose Your Nurse')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nursing.booking.select.nurse.desc', 'Select a nurse or let us assign the best available')}</p>
            {/* Level Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              <button onClick={() => setLevelFilter('all')}
                style={{ padding: '5px 12px', borderRadius: 12, border: levelFilter === 'all' ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: levelFilter === 'all' ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 10, fontWeight: levelFilter === 'all' ? 700 : 400, color: levelFilter === 'all' ? '#7C3AED' : '#334155' }}>
                {t('nursing.all', 'All')}
              </button>
              {nurseLevels.map(lvl => (
                <button key={lvl.id} onClick={() => setLevelFilter(lvl.id)}
                  style={{ padding: '5px 12px', borderRadius: 12, border: levelFilter === lvl.id ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: levelFilter === lvl.id ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 10, fontWeight: levelFilter === lvl.id ? 700 : 400, color: levelFilter === lvl.id ? '#7C3AED' : '#334155' }}>
                  {lvl.name}
                </button>
              ))}
            </div>
            {/* Nurse Cards */}
            {filteredNurses.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 20 }}>{t('nursing.booking.no.nurses', 'No nurses available for this service. Please try a different service.')}</p>
            ) : (
              <div style={{ display: 'grid', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
                {filteredNurses.map(n => {
                  const selected = data.nurse?.id === n.id;
                  const lvl = nurseLevels.find(l => l.id === n.level);
                  return (
                    <button key={n.id} onClick={() => { update('nurse', n); update('noPreference', false) }}
                      style={{ padding: 14, borderRadius: 12, border: selected ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: selected ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                      {selected && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: '#7C3AED' }}>&#10003;</span>}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 32 }}>{n.image}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{n.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                            {n.qualifications} &middot; {n.experience} {t('nursing.booking.years.exp', 'years experience')}
                            {lvl && <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 6, background: lvl.color + '20', color: lvl.color, fontWeight: 600, fontSize: 10 }}>{lvl.name}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                            <span>&#11088; {n.rating} &middot; {n.sessions} {t('nursing.booking.sessions', 'sessions')}</span>
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.languages.join(', ')}</span>
                          </div>
                          {/* Availability Chips */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {n.availability.map((a, i) => (
                              <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#fef3c7', color: '#d97706', fontWeight: 500 }}>&#128197; {a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {/* No Preference Option */}
            <button onClick={() => { update('nurse', null); update('noPreference', true) }}
              style={{ width: '100%', marginTop: 10, padding: '12px 16px', borderRadius: 10, border: data.noPreference ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: data.noPreference ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: data.noPreference ? '#7C3AED' : '#0f172a' }}>{t('nursing.booking.auto.assign', 'No preference / Assign automatically')}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('nursing.booking.auto.assign.desc', 'We will assign the best available nurse for your service')}</div>
            </button>
            {errors.nurse && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.nurse}</p>}
          </div>
        )}

        {/* Step 2: Patient Information */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nursing.booking.patient.info', 'Patient Information')}</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('full.name', 'Full Name')} *</label>
                <input value={data.patientName} onChange={e => update('patientName', e.target.value)} placeholder={t('nursing.booking.name.placeholder', "Patient's full name")} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientName ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientName && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientName}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('mobile.number', 'Mobile Number')} *</label>
                  <input type="tel" value={data.patientPhone} onChange={e => update('patientPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientPhone ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
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
                <textarea value={data.patientAddress} onChange={e => update('patientAddress', e.target.value)} rows={2} placeholder={t('nursing.booking.address.placeholder', 'Full address with landmark, city, pincode')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAddress ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                {errors.patientAddress && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAddress}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nursing.age', 'Age')} *</label>
                  <input type="number" min={0} max={150} value={data.patientAge} onChange={e => update('patientAge', parseInt(e.target.value) || '')} placeholder="e.g. 35" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAge ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientAge && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAge}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('gender', 'Gender')} *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} onClick={() => update('patientGender', g)}
                        style={{ flex: 1, padding: '10px 8px', borderRadius: 8, border: data.patientGender === g ? '2px solid #7C3AED' : '1px solid #d0d5dd', background: data.patientGender === g ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.patientGender === g ? 700 : 400, color: data.patientGender === g ? '#7C3AED' : '#334155' }}>
                        {t(g, g.charAt(0).toUpperCase() + g.slice(1))}
                      </button>
                    ))}
                  </div>
                  {errors.patientGender && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientGender}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nursing.booking.medical.notes', 'Medical Notes')} ({t('optional', 'optional')})</label>
                <textarea value={data.medicalNotes} onChange={e => update('medicalNotes', e.target.value)} rows={2} placeholder={t('nursing.booking.medical.notes.placeholder', 'Any allergies, medications, or special instructions...')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nursing.booking.schedule', 'Schedule Your Visit')}</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              {/* Date Selection */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nursing.booking.date', 'Preferred Date')} *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {dateOptions.map(opt => (
                    <button key={opt.value} onClick={() => { update('dateOption', opt.value); update('preferredDate', opt.value === 'custom' ? '' : opt.dateVal) }}
                      style={{ padding: '8px 14px', borderRadius: 8, border: data.dateOption === opt.value ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: data.dateOption === opt.value ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.dateOption === opt.value ? 700 : 400, color: data.dateOption === opt.value ? '#7C3AED' : '#334155' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {data.dateOption === 'custom' && (
                  <input type="date" value={data.preferredDate} onChange={e => update('preferredDate', e.target.value)} min={todayStr} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.preferredDate ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                )}
                {errors.preferredDate && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredDate}</p>}
              </div>
              {/* Time Slot */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nursing.booking.time.slot', 'Preferred Time Slot')} *</label>
                {data.nurse && !data.noPreference && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8, padding: '8px 10px', borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a' }}>
                    <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600, width: '100%', marginBottom: 4 }}>{t('nursing.booking.nurse.availability', 'Nurse availability')}:</span>
                    {data.nurse.availability.map((a, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#fef3c7', color: '#d97706', fontWeight: 500 }}>{a}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot.value} onClick={() => update('preferredTime', slot.value)}
                      style={{ padding: '10px 12px', borderRadius: 8, border: data.preferredTime === slot.value ? '2px solid #7C3AED' : '1px solid #e2e8f0', background: data.preferredTime === slot.value ? '#f5f3ff' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.preferredTime === slot.value ? 700 : 400, color: '#0f172a' }}>
                      {slot.label}
                    </button>
                  ))}
                </div>
                {errors.preferredTime && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredTime}</p>}
              </div>
              {/* Duration */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nursing.booking.duration', 'Duration')}</label>
                <select value={data.duration} onChange={e => update('duration', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  {data.service?.duration && <option value={data.service.duration}>{data.service.duration} ({t('nursing.booking.recommended', 'Recommended')})</option>}
                  {DURATION_OPTIONS.filter(d => d !== data.service?.duration).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {/* Urgency */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nursing.booking.urgency', 'Urgency Level')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {URGENCY_OPTIONS.map(u => (
                    <button key={u.id} onClick={() => update('urgency', u.id)}
                      style={{ padding: '12px 8px', borderRadius: 10, border: data.urgency === u.id ? '2px solid ' + u.color : '1px solid #e2e8f0', background: data.urgency === u.id ? u.color + '10' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: data.urgency === u.id ? u.color : '#0f172a', marginBottom: 2 }}>{t(u.label)}</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>{t(u.desc)}</div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Address Confirmation */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nursing.booking.service.address', 'Service Address')}</label>
                <div style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 13, color: '#0f172a', lineHeight: 1.5 }}>
                  {data.patientAddress || t('nursing.booking.no.address', 'No address provided yet')}
                  <button onClick={() => setStep(2)} style={{ display: 'block', marginTop: 4, background: 'none', border: 'none', color: '#7C3AED', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, padding: 0 }}>
                    {t('edit', 'Edit')} &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nursing.booking.review', 'Review & Confirm')}</h3>
            {/* Summary */}
            <div style={{ padding: 16, borderRadius: 12, background: '#f5f3ff', border: '1px solid #ddd6fe', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#5B21B6', marginBottom: 10 }}>{t('nursing.booking.booking.summary', 'Booking Summary')}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('nursing.service', 'Service')}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data.service?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('nursing.booking.duration', 'Duration')}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data.duration || data.service?.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('nursing.nurse', 'Nurse')}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data.noPreference ? t('nursing.booking.auto.assigned', 'Auto-assigned') : data.nurse?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('patient', 'Patient')}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data.patientName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('date', 'Date')}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{data.preferredDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('time', 'Time')}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{TIME_SLOTS.find(s => s.value === data.preferredTime)?.label || data.preferredTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{t('nursing.booking.urgency', 'Urgency')}</span>
                  <span style={{ fontWeight: 600, color: URGENCY_OPTIONS.find(u => u.id === data.urgency)?.color || '#0f172a' }}>{t(URGENCY_OPTIONS.find(u => u.id === data.urgency)?.label || '')}</span>
                </div>
              </div>
              {/* Price Breakdown */}
              <div style={{ borderTop: '1px solid #ddd6fe', marginTop: 10, paddingTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>{t('nursing.booking.service.charge', 'Service Charge')}</span>
                  <span style={{ fontWeight: 600 }}>&#x20B9;{data.service?.price}</span>
                </div>
                {surcharge > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>{t('nursing.booking.nurse.surcharge', 'Nurse Level Surcharge')}</span>
                    <span style={{ fontWeight: 600 }}>+ &#x20B9;{surcharge}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, borderTop: '1px solid #ddd6fe', marginTop: 6, paddingTop: 6 }}>
                  <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span>
                  <span style={{ fontWeight: 800, color: '#7C3AED' }}>&#x20B9;{totalAmount}</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', margin: 0 }}>
              {t('nursing.booking.confirm.disclaimer', 'By confirming, you agree to our terms of service and cancellation policy.')}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={prev} disabled={step === 0}
          style={{ height: 44, padding: '0 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: step === 0 ? '#f8f9fa' : '#fff', color: step === 0 ? '#ccc' : '#0f172a', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          &larr; {t('back', 'Back')}
        </button>
        {step < 4 ? (
          <button onClick={next}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {t('continue', 'Continue')} &rarr;
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={processing}
            style={{ height: 44, padding: '0 28px', borderRadius: 8, border: 'none', background: processing ? '#94a3b8' : 'linear-gradient(135deg, #7C3AED, #EC4899)', color: '#fff', cursor: processing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            {processing ? t('processing', 'Processing...') : `${t('nursing.booking.confirm.booking', 'Confirm Booking')} \u20B9${totalAmount}`}
          </button>
        )}
      </div>
    </div>
  );
}
