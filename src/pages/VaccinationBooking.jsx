import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { useToast } from '../components/Toast';
import { vaccines } from '../data/vaccinationData';
import { sendBookingConfirmation, getWALink } from '../services/waService';

const STEPS = [
  { id: 'vaccine', label: 'vaccine' },
  { id: 'patient', label: 'patient.details' },
  { id: 'service', label: 'service' },
  { id: 'appointment', label: 'appointment' },
  { id: 'payment', label: 'payment' },
];

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

export default function VaccinationBooking() {
  const t = useT();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const preSelectedSlug = searchParams.get('vaccine');

  const [step, setStep] = useState(preSelectedSlug ? 1 : 0);
  const [data, setData] = useState({
    vaccine: vaccines.find(v => v.slug === preSelectedSlug) || null,
    patientName: '', patientDob: '', patientGender: '', patientMobile: '', patientHistory: '',
    serviceType: 'home',
    appointmentDate: '', appointmentSlot: '',
    paymentMethod: '',
  });
  const [confirmed, setConfirmed] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key, val) => {
    setData(d => ({ ...d, [key]: val }));
    setErrors(e => ({ ...e, [key]: null }));
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 0 && !data.vaccine) errs.vaccine = t('select.vaccine.error', 'Please select a vaccine');
    if (s === 1) {
      if (!data.patientName?.trim()) errs.patientName = t('name.required', 'Name is required');
      if (!data.patientDob) errs.patientDob = t('dob.required', 'Date of birth is required');
      if (!data.patientGender) errs.patientGender = t('gender.required', 'Gender is required');
      if (!/^[0-9]{10}$/.test(data.patientMobile)) errs.patientMobile = t('mobile.required', 'Valid 10-digit mobile is required');
    }
    if (s === 3) {
      if (!data.appointmentDate) errs.appointmentDate = t('select.date', 'Please select a date');
      if (!data.appointmentSlot) errs.appointmentSlot = t('select.slot', 'Please select a time slot');
    }
    if (s === 4 && !data.paymentMethod) errs.paymentMethod = t('select.payment', 'Please select a payment method');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(s => Math.min(s + 1, 5));
  };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleConfirm = () => {
    if (!validateStep(4)) return;
    setProcessing(true);
    setTimeout(() => {
      const booking = {
        id: 'VAC-' + Date.now().toString(36).toUpperCase(),
        ...data,
        vaccineName: data.vaccine?.name,
        vaccinePrice: data.vaccine?.price,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
      };
      const bookings = JSON.parse(localStorage.getItem('jh_vaccination_bookings') || '[]');
      bookings.push(booking);
      localStorage.setItem('jh_vaccination_bookings', JSON.stringify(bookings));
      const waMsg = sendBookingConfirmation(booking);
      setConfirmed({ ...booking, waMsg });
      toast(t('vaccination.booking.confirmed', 'Vaccination booked successfully!'), 'success');
      setProcessing(false);
    }, 1500);
  };

  if (confirmed) {
    return (
      <div className="page-section container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#166534', marginBottom: 4 }}>{t('booking.confirmed', 'Booking Confirmed!')}</h2>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>{t('booking.confirmed.desc', 'Your vaccination appointment has been scheduled successfully.')}</p>
        <div style={{ padding: 20, borderRadius: 14, border: '1px solid #dcfce7', background: '#f0fdf4', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('booking.id', 'Booking ID')}:</strong> {confirmed.id}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('vaccine')}:</strong> {confirmed.vaccineName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('patient', 'Patient')}:</strong> {confirmed.patientName}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('date', 'Date')}:</strong> {confirmed.appointmentDate}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('time', 'Time')}:</strong> {TIME_SLOTS.find(s => s.value === confirmed.appointmentSlot)?.label}</div>
          <div style={{ fontSize: 13, marginBottom: 8 }}><strong>{t('service', 'Service')}:</strong> {confirmed.serviceType === 'home' ? t('home.vaccination') : t('clinic.visit', 'Clinic Visit')}</div>
          <div style={{ fontSize: 13 }}><strong>{t('amount', 'Amount')}:</strong> ₹{confirmed.vaccinePrice}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={getWALink(confirmed.waMsg)} target="_blank" rel="noopener noreferrer" style={{ height: 44, padding: '0 24px', borderRadius: 8, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            💬 {t('send.whatsapp', 'Send WhatsApp Confirmation')}
          </a>
          <Link to="/vaccination/wallet" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #d0d5dd', color: '#0f172a', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>{t('view.wallet', '💳 View Wallet')}</Link>
          <Link to="/vaccination" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #d0d5dd', color: '#0f172a', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>{t('back.to.vaccination')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: 640 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('book.vaccination')}</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, textAlign: 'center' }}>{t('complete.booking', 'Complete your booking in a few easy steps')}</p>

      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, position: 'relative' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, margin: '0 auto 4px',
                background: i < step ? '#16a34a' : i === step ? '#2563eb' : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8' }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 9, color: i === step ? '#2563eb' : '#94a3b8', fontWeight: i === step ? 700 : 400 }}>{t(s.label)}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 40, height: 2, background: i < step ? '#16a34a' : '#e2e8f0', margin: '0 4px', marginBottom: 16 }} />}
          </div>
        ))}
      </div>

      <div style={{ padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
        {/* Step 0: Select Vaccine */}
        {step === 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('select.vaccine', 'Select Vaccine')}</h3>
            <div style={{ display: 'grid', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
              {vaccines.map(v => (
                <button key={v.id} onClick={() => { update('vaccine', v); next(); }}
                  style={{ padding: '12px 16px', borderRadius: 10, border: data.vaccine?.id === v.id ? '2px solid #2563eb' : '1px solid #e2e8f0', background: data.vaccine?.id === v.id ? '#EFF6FF' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>💉</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{v.disease} · {v.ageGroup}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>₹{v.price}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{v.doseCount} {t('dose').toLowerCase()}{v.doseCount > 1 ? 's' : ''}</div>
                  </div>
                </button>
              ))}
            </div>
            {errors.vaccine && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.vaccine}</p>}
          </div>
        )}

        {/* Step 1: Patient Details */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('patient.details')}</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('full.name', 'Full Name')} *</label>
                <input value={data.patientName} onChange={e => update('patientName', e.target.value)} placeholder="Patient's full name" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientName ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientName && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientName}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('date.of.birth', 'Date of Birth')} *</label>
                  <input type="date" value={data.patientDob} onChange={e => update('patientDob', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientDob ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientDob && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientDob}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('gender', 'Gender')} *</label>
                  <select value={data.patientGender} onChange={e => update('patientGender', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientGender ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.patientGender && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientGender}</p>}
                </div>
              </div>
              <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('mobile.number', 'Mobile Number')} *</label>
                <input type="tel" pattern="[0-9]{10}" value={data.patientMobile} onChange={e => update('patientMobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientMobile ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientMobile && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientMobile}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('medical.history', 'Medical History')} ({t('optional', 'optional')})</label>
                <textarea value={data.patientHistory} onChange={e => update('patientHistory', e.target.value)} rows={2} placeholder="Any allergies, chronic conditions, or medications..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Service Type */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('service.type', 'Service Type')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { id: 'home', icon: '🏠', title: t('home.vaccination'), desc: t('home.desc', 'Nurse visits your home. Free within city limits.'), price: t('free', 'Free') },
                { id: 'clinic', icon: '🏥', title: t('clinic.visit', 'Clinic Visit'), desc: t('clinic.desc', 'Visit our partner clinic near you.'), price: t('no.extra.charge', 'No extra charge') },
              ].map(svc => (
                <button key={svc.id} onClick={() => update('serviceType', svc.id)}
                  style={{ padding: 20, borderRadius: 12, border: data.serviceType === svc.id ? '2px solid #2563eb' : '1px solid #e2e8f0', background: data.serviceType === svc.id ? '#EFF6FF' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{svc.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{svc.title}</h4>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 6px', lineHeight: 1.4 }}>{svc.desc}</p>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#059669' }}>{svc.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Appointment */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('select.appointment', 'Select Appointment')}</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('preferred.date', 'Preferred Date')} *</label>
                <input type="date" value={data.appointmentDate} onChange={e => update('appointmentDate', e.target.value)} min={new Date().toISOString().slice(0, 10)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.appointmentDate ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.appointmentDate && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.appointmentDate}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('preferred.time', 'Preferred Time')} *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot.value} onClick={() => update('appointmentSlot', slot.value)}
                      style={{ padding: '10px 12px', borderRadius: 8, border: data.appointmentSlot === slot.value ? '2px solid #2563eb' : '1px solid #e2e8f0', background: data.appointmentSlot === slot.value ? '#EFF6FF' : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.appointmentSlot === slot.value ? 700 : 400, color: '#0f172a' }}>
                      {slot.label}
                    </button>
                  ))}
                </div>
                {errors.appointmentSlot && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.appointmentSlot}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('payment.method', 'Payment Method')}</h3>
            {/* Order Summary */}
            <div style={{ padding: 14, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{t('booking.summary', 'Booking Summary')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>{t('vaccine')}</span><span style={{ fontWeight: 600 }}>{data.vaccine?.name}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>{t('patient', 'Patient')}</span><span style={{ fontWeight: 600 }}>{data.patientName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>{t('service', 'Service')}</span><span style={{ fontWeight: 600 }}>{data.serviceType === 'home' ? t('home.vaccination') : t('clinic.visit', 'Clinic Visit')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: '#64748b' }}>{t('date', 'Date')}</span><span style={{ fontWeight: 600 }}>{data.appointmentDate}</span></div>
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span><span style={{ fontWeight: 800, color: '#059669' }}>₹{data.vaccine?.price}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { id: 'upi', icon: '📱', label: 'UPI', desc: t('upi.desc', 'Google Pay, PhonePe, Paytm') },
                { id: 'card', icon: '💳', label: t('card', 'Card'), desc: t('card.desc', 'Credit / Debit Card') },
                { id: 'netbanking', icon: '🏦', label: t('net.banking', 'Net Banking'), desc: t('netbanking.desc', 'All major banks') },
              ].map(m => (
                <button key={m.id} onClick={() => update('paymentMethod', m.id)}
                  style={{ padding: '12px 16px', borderRadius: 10, border: data.paymentMethod === m.id ? '2px solid #2563eb' : '1px solid #e2e8f0', background: data.paymentMethod === m.id ? '#EFF6FF' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            {errors.paymentMethod && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.paymentMethod}</p>}
          </div>
        )}

        {/* Step 5: Processing (handled by confirm button) */}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={prev} disabled={step === 0}
          style={{ height: 44, padding: '0 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: step === 0 ? '#f8f9fa' : '#fff', color: step === 0 ? '#ccc' : '#0f172a', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          ← {t('back', 'Back')}
        </button>
        {step < 4 ? (
          <button onClick={next}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {t('continue', 'Continue')} →
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={processing}
            style={{ height: 44, padding: '0 28px', borderRadius: 8, border: 'none', background: processing ? '#94a3b8' : '#FF3B30', color: '#fff', cursor: processing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            {processing ? t('processing', 'Processing...') : t('confirm.pay', 'Confirm & Pay') + ' ₹' + (data.vaccine?.price || 0)}
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .page-section { padding: 20px 12px !important; }
        }
      `}</style>
    </div>
  );
}

