import { useT } from '../i18n/LanguageProvider';
import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useDoctorsStore from '../stores/doctorsStore';
import useBookingsStore from '../stores/bookingsStore';

const input = { padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const label = { fontSize: 13, fontWeight: 600, color: '#1f2937', marginBottom: 4, display: 'block' };
const req = { color: '#dc2626', marginLeft: 2 };
const card = { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' };
const chip = (active) => ({ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (active ? '#1866C9' : '#d1d5db'), background: active ? '#eef2ff' : '#fff', color: active ? '#1866C9' : '#374151', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400 });

export default function BookAppointment() {
  const t = useT();
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const doctors = useDoctorsStore(s => s.doctors);
  const addBooking = useBookingsStore(s => s.addBooking);

  const doctor = useMemo(() => doctors.find(d => d.id === doctorId), [doctors, doctorId]);

  const [submitted, setSubmitted] = useState(false);
  const [f, setF] = useState({
    patientName: '', patientPhone: '', patientEmail: '', patientAge: '', patientGender: '',
    date: '', time: '', reason: '', mode: '', address: '',
  });

  const update = (k, v) => setF(p => ({ ...p, [k]: v }));

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  const timeSlots = useMemo(() => {
    if (!doctor?.availableTimeSlots || doctor.availableTimeSlots.length === 0) {
      return ['9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '2:00 PM – 4:00 PM', '4:00 PM – 6:00 PM'];
    }
    return doctor.availableTimeSlots;
  }, [doctor]);

  if (!doctor) {
    return (
      <div className="page-section">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{t('bookAppointment.doctorNotFound', 'Doctor not found')}</h2>
          <Link to="/consult-doctor" style={{ color: '#1866C9' }}>{t('bookAppointment.backToDoctors', '← Back to all doctors')}</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!f.patientName || !f.patientPhone || !f.date || !f.time) return;
    addBooking({
      patientName: f.patientName, patientPhone: f.patientPhone, patientEmail: f.patientEmail,
      patientAge: f.patientAge, patientGender: f.patientGender,
      date: f.date, time: f.time, reason: f.reason, mode: f.mode,
      address: f.address, doctor: doctor.name, doctorId: doctor.id,
      type: 'consultation',
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-section">
        <div className="container" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{t('bookAppointment.success.title', 'Appointment Booked!')}</h2>
          <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
            {t('bookAppointment.success.text', 'Your consultation with')} <strong>{doctor.name}</strong> {t('bookAppointment.success.hasBeenScheduled', 'has been scheduled for')} <strong>{f.date}</strong> {t('bookAppointment.success.at', 'at')} <strong>{f.time}</strong>.
            {t('bookAppointment.success.confirmation', 'You will receive a confirmation call/message shortly.')}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/consult-doctor" style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', color: '#374151', textDecoration: 'none', fontSize: 14, fontFamily: 'inherit' }}>{t('bookAppointment.success.bookAnother', 'Book Another')}</Link>
            <Link to="/" style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', textDecoration: 'none', fontSize: 14, fontFamily: 'inherit', fontWeight: 600 }}>{t('bookAppointment.success.goHome', 'Go Home')}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/consult-doctor" style={{ fontSize: 13, color: '#1866C9', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>{t('bookAppointment.backToDoctors', '← Back to all doctors')}</Link>

        {/* Doctor Summary */}
        <div style={{ ...card, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #1A7AD4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, flexShrink: 0 }}>{(doctor.name || '?')[0]}</div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>{doctor.name}</h2>
            <div style={{ fontSize: 12, color: '#64748b' }}>{(doctor.specializations || []).join(', ')} | {(doctor.qualifications || []).join(', ')} | {doctor.experience} {t('bookAppointment.years', 'yrs')}</div>
            <div style={{ fontSize: 12, color: '#1866C9', fontWeight: 600, marginTop: 2 }}>{t('bookAppointment.rupee', '₹')}{doctor.consultationFee || '—'}/{t('bookAppointment.consult', 'consult')}</div>
          </div>
        </div>

        {/* Booking Form */}
        <div style={card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>{t('bookAppointment.form.title', 'Book an Appointment')}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={label}>{t('bookAppointment.form.patientName', 'Patient Name')} <span style={req}>*</span></label>
                <input style={input} value={f.patientName} onChange={e => update('patientName', e.target.value)} placeholder={t('bookAppointment.form.patientNamePlaceholder', 'Full name')} required />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.patientPhone', 'Patient Phone')} <span style={req}>*</span></label>
                <input style={input} type="tel" value={f.patientPhone} onChange={e => update('patientPhone', e.target.value)} placeholder={t('bookAppointment.form.patientPhonePlaceholder', '10-digit mobile')} required />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div>
                <label style={label}>{t('bookAppointment.form.email', 'Email')}</label>
                <input style={input} type="email" value={f.patientEmail} onChange={e => update('patientEmail', e.target.value)} placeholder={t('bookAppointment.form.emailPlaceholder', 'email@example.com')} />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.age', 'Age')}</label>
                <input style={input} type="number" value={f.patientAge} onChange={e => update('patientAge', e.target.value)} placeholder={t('bookAppointment.form.agePlaceholder', 'Years')} />
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

            {/* Consultation Mode */}
            <div>
              <label style={label}>{t('bookAppointment.form.consultMode', 'Consultation Mode')}</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[t('bookAppointment.form.modeOnlineVideo', 'Online – Video'), t('bookAppointment.form.modeOnlineAudio', 'Online – Audio'), t('bookAppointment.form.modeOnlineChat', 'Online – Chat'), t('bookAppointment.form.modeHomeVisit', 'In-person Home Visit')].map(m => (
                  <button key={m} type="button" onClick={() => update('mode', f.mode === m ? '' : m)} style={chip(f.mode === m)}>{m}</button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={label}>{t('bookAppointment.form.preferredDate', 'Preferred Date')} <span style={req}>*</span></label>
                <input style={input} type="date" min={minDate} value={f.date} onChange={e => update('date', e.target.value)} required />
              </div>
              <div>
                <label style={label}>{t('bookAppointment.form.preferredTime', 'Preferred Time')} <span style={req}>*</span></label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {timeSlots.map(t => (
                    <button key={t} type="button" onClick={() => update('time', f.time === t ? '' : t)} style={chip(f.time === t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label style={label}>{t('bookAppointment.form.reason', 'Reason for Visit')}</label>
              <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.reason} onChange={e => update('reason', e.target.value)} placeholder={t('bookAppointment.form.reasonPlaceholder', 'Brief description of your health concern...')} />
            </div>

            {/* Address (for home visits) */}
            {f.mode === t('bookAppointment.form.modeHomeVisit', 'In-person Home Visit') && (
              <div>
                <label style={label}>{t('bookAppointment.form.address', 'Address for Home Visit')} <span style={req}>*</span></label>
                <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.address} onChange={e => update('address', e.target.value)} placeholder={t('bookAppointment.form.addressPlaceholder', 'Full address with landmark, city, pincode')} required />
              </div>
            )}

            <button type="submit" style={{ padding: '12px 32px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', fontSize: 14, fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', marginTop: 4 }}>
              {t('bookAppointment.form.confirm', 'Confirm Appointment')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
