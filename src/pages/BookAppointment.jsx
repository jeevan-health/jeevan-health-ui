import { useT } from '../i18n/LanguageProvider';
import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as doctorService from '../services/doctorService';
import useAuthStore from '../stores/authStore';

const input = { padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const label = { fontSize: 13, fontWeight: 600, color: '#1f2937', marginBottom: 4, display: 'block' };
const req = { color: '#dc2626', marginLeft: 2 };
const card = { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' };
const chip = (active) => ({
  padding: '8px 14px', borderRadius: 8, minHeight: 40,
  border: '1px solid ' + (active ? '#1866C9' : '#d1d5db'),
  background: active ? '#eef2ff' : '#fff', color: active ? '#1866C9' : '#374151',
  cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400,
});

const DEFAULT_SLOTS = ['9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM'];

const MODE_OPTIONS = [
  { value: 'video', label: 'Online – Video' },
  { value: 'audio', label: 'Online – Audio' },
  { value: 'chat', label: 'Online – Chat' },
  { value: 'clinic', label: 'In-clinic' },
  { value: 'home', label: 'Home Visit' },
];

function mapDoctor(d) {
  if (!d) return null;
  let avail = {};
  try {
    avail = typeof d.availability === 'string' ? JSON.parse(d.availability) : (d.availability || {});
  } catch {
    avail = {};
  }
  return {
    id: d.id,
    name: d.name,
    specializations: [d.specialty || 'General'].filter(Boolean),
    qualifications: d.qualifications || [],
    experience: d.experience || 0,
    consultationFee: Number(d.fees) || 0,
    availableTimeSlots: avail.slots || avail.timeSlots || DEFAULT_SLOTS,
    image: d.image || '',
  };
}

export default function BookAppointment() {
  const t = useT();
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const [f, setF] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientAge: '',
    patientGender: '',
    date: '',
    time: '',
    reason: '',
    mode: 'video',
    address: '',
  });

  const update = (k, v) => setF(p => ({ ...p, [k]: v }));

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const { data } = await doctorService.getDoctor(doctorId);
        if (!cancelled) setDoctor(mapDoctor(data));
      } catch {
        if (!cancelled) {
          setDoctor(null);
          setLoadError(t('bookAppointment.doctorNotFound', 'Doctor not found'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [doctorId, t]);

  useEffect(() => {
    if (user) {
      setF(p => ({
        ...p,
        patientName: p.patientName || user.name || '',
        patientPhone: p.patientPhone || user.phone || '',
        patientEmail: p.patientEmail || user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!f.date || !doctorId || !isAuthenticated) {
      setBookedSlots([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await doctorService.getBookedSlots(doctorId, f.date);
        if (!cancelled) setBookedSlots(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setBookedSlots([]);
      }
    })();
    return () => { cancelled = true; };
  }, [f.date, doctorId, isAuthenticated]);

  const timeSlots = useMemo(() => {
    const base = doctor?.availableTimeSlots?.length ? doctor.availableTimeSlots : DEFAULT_SLOTS;
    return base;
  }, [doctor]);

  const availableSlots = useMemo(
    () => timeSlots.filter(slot => !bookedSlots.includes(slot)),
    [timeSlots, bookedSlots]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.patientName || !f.date || !f.time || !f.mode) {
      setError(t('bookAppointment.error.required', 'Please fill in all required fields.'));
      return;
    }
    if (!isAuthenticated) {
      navigate('/signup', { state: { from: `/book-appointment/${doctorId}` } });
      return;
    }
    if (f.mode === 'home' && !f.address.trim()) {
      setError(t('bookAppointment.error.address', 'Address is required for home visits.'));
      return;
    }

    setSubmitting(true);
    try {
      await doctorService.bookAppointment({
        doctorId: parseInt(doctorId, 10),
        appointmentDate: f.date,
        timeSlot: f.time,
        type: f.mode,
        patientName: f.patientName,
        patientAge: f.patientAge ? parseInt(f.patientAge, 10) : null,
        symptoms: f.reason || '',
        notes: [
          f.patientPhone && `Phone: ${f.patientPhone}`,
          f.patientEmail && `Email: ${f.patientEmail}`,
          f.patientGender && `Gender: ${f.patientGender}`,
          f.mode === 'home' && f.address && `Address: ${f.address}`,
        ].filter(Boolean).join(' | '),
      });
      setSubmitted(true);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || t('bookAppointment.error.failed', 'Failed to book appointment. Please try again.');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ color: '#64748b' }}>{t('bookAppointment.loading', 'Loading doctor…')}</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="page-section">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{loadError || t('bookAppointment.doctorNotFound', 'Doctor not found')}</h2>
          <Link to="/consult-doctor" style={{ color: '#1866C9' }}>{t('bookAppointment.backToDoctors', '← Back to all doctors')}</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="page-section">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{t('bookAppointment.success.title', 'Appointment Booked!')}</h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
            {t('bookAppointment.success.text', 'Your consultation with')} <strong>{doctor.name}</strong> {t('bookAppointment.success.hasBeenScheduled', 'has been scheduled for')} <strong>{f.date}</strong> {t('bookAppointment.success.at', 'at')} <strong>{f.time}</strong>.
            {t('bookAppointment.success.confirmation', ' You will receive a confirmation call/message shortly.')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/my-bookings" style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>{t('bookAppointment.success.viewBookings', 'View My Bookings')}</Link>
            <Link to="/consult-doctor" style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', color: '#374151', textDecoration: 'none', fontSize: 14 }}>{t('bookAppointment.success.bookAnother', 'Book Another')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/consult-doctor" style={{ fontSize: 13, color: '#1866C9', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>{t('bookAppointment.backToDoctors', '← Back to all doctors')}</Link>

        <div style={{ ...card, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>{(doctor.name || '?')[0]}</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>{doctor.name}</h2>
            <div style={{ fontSize: 12, color: '#64748b' }}>{(doctor.specializations || []).join(', ')} | {(doctor.qualifications || []).join(', ')} | {doctor.experience} {t('bookAppointment.years', 'yrs')}</div>
            <div style={{ fontSize: 12, color: '#1866C9', fontWeight: 600, marginTop: 2 }}>{t('bookAppointment.rupee', '₹')}{doctor.consultationFee || '—'}/{t('bookAppointment.consult', 'consult')}</div>
          </div>
        </div>

        {!isAuthenticated && (
          <div style={{ ...card, marginBottom: 16, background: '#fffbeb', borderColor: '#fcd34d' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#92400e' }}>
              {t('bookAppointment.loginRequired', 'You need to sign in to confirm your appointment.')}{' '}
              <Link to="/signup" state={{ from: `/book-appointment/${doctorId}` }} style={{ color: '#1866C9', fontWeight: 600 }}>{t('bookAppointment.signIn', 'Sign in')}</Link>
            </p>
          </div>
        )}

        <div style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>{t('bookAppointment.form.title', 'Book an Appointment')}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <div className="book-appt-grid-2" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={label}>{t('bookAppointment.form.patientName', 'Patient Name')} <span style={req}>*</span></label>
                <input style={input} value={f.patientName} onChange={e => update('patientName', e.target.value)} placeholder={t('bookAppointment.form.patientNamePlaceholder', 'Full name')} required />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.patientPhone', 'Patient Phone')}</label>
                <input style={input} type="tel" value={f.patientPhone} onChange={e => update('patientPhone', e.target.value)} placeholder={t('bookAppointment.form.patientPhonePlaceholder', '10-digit mobile')} />
              </div>
            </div>
            <div className="book-appt-grid-3" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div>
                <label style={label}>{t('bookAppointment.form.email', 'Email')}</label>
                <input style={input} type="email" value={f.patientEmail} onChange={e => update('patientEmail', e.target.value)} placeholder={t('bookAppointment.form.emailPlaceholder', 'email@example.com')} />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.age', 'Age')}</label>
                <input style={input} type="number" value={f.patientAge} onChange={e => update('patientAge', e.target.value)} placeholder={t('bookAppointment.form.agePlaceholder', 'Years')} min={0} max={120} />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.gender', 'Gender')}</label>
                <select style={input} value={f.patientGender} onChange={e => update('patientGender', e.target.value)}>
                  <option value="">{t('bookAppointment.form.genderSelect', 'Select')}</option>
                  <option value="Male">{t('bookAppointment.form.genderMale', 'Male')}</option>
                  <option value="Female">{t('bookAppointment.form.genderFemale', 'Female')}</option>
                  <option value="Other">{t('bookAppointment.form.genderOther', 'Other')}</option>
                </select>
              </div>
            </div>

            <div>
              <label style={label}>{t('bookAppointment.form.consultMode', 'Consultation Mode')} <span style={req}>*</span></label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {MODE_OPTIONS.map(m => (
                  <button key={m.value} type="button" onClick={() => update('mode', m.value)} style={chip(f.mode === m.value)}>
                    {t(`bookAppointment.form.mode.${m.value}`, m.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="book-appt-grid-2" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={label}>{t('bookAppointment.form.preferredDate', 'Preferred Date')} <span style={req}>*</span></label>
                <input style={input} type="date" min={minDate} value={f.date} onChange={e => { update('date', e.target.value); update('time', ''); }} required />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.preferredTime', 'Preferred Time')} <span style={req}>*</span></label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {availableSlots.length === 0 && (
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{t('bookAppointment.noSlots', 'No slots available for this date')}</span>
                  )}
                  {availableSlots.map(slot => (
                    <button key={slot} type="button" onClick={() => update('time', f.time === slot ? '' : slot)} style={chip(f.time === slot)}>{slot}</button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label style={label}>{t('bookAppointment.form.reason', 'Reason for Visit')}</label>
              <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.reason} onChange={e => update('reason', e.target.value)} placeholder={t('bookAppointment.form.reasonPlaceholder', 'Brief description of your health concern...')} />
            </div>

            {f.mode === 'home' && (
              <div>
                <label style={label}>{t('bookAppointment.form.address', 'Address for Home Visit')} <span style={req}>*</span></label>
                <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.address} onChange={e => update('address', e.target.value)} placeholder={t('bookAppointment.form.addressPlaceholder', 'Full address with landmark, city, pincode')} required />
              </div>
            )}

            {error && <p style={{ margin: 0, fontSize: 13, color: '#dc2626' }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 32px', borderRadius: 8, border: 'none', minHeight: 48,
                background: submitting ? '#64748b' : '#0f172a', color: '#fff',
                fontSize: 14, fontFamily: 'inherit', fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', marginTop: 4,
              }}
            >
              {submitting ? t('bookAppointment.form.submitting', 'Booking…') : t('bookAppointment.form.confirm', 'Confirm Appointment')}
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) {
          .book-appt-grid-2, .book-appt-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
