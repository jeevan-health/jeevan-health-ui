import { useT } from '../i18n/LanguageProvider';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDoctorOnboardingStore from '../stores/doctorOnboardingStore';

const input = { padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const label = { fontSize: 13, fontWeight: 600, color: '#1f2937', marginBottom: 4, display: 'block' };
const req = { color: '#dc2626', marginLeft: 2 };
const card = { background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', maxWidth: 720, margin: '0 auto' };
const btnPrimary = { padding: '12px 32px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', fontWeight: 600 };
const btnOutline = { padding: '12px 32px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', color: '#374151' };
const chip = (active) => ({ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (active ? '#0f172a' : '#d1d5db'), background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#374151', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400 });

const SPECIALTIES = ['General Physician', 'Diabetologist', 'Cardiologist', 'Pediatrician', 'Neurologist', 'Psychiatrist', 'Orthopedic', 'Pulmonologist'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOTS = ['Morning (8am–12pm)', 'Afternoon (12pm–4pm)', 'Evening (4pm–8pm)', 'Night (8pm–10pm)', 'Emergency 24x7'];
const MODES = ['Online – Video', 'Online – Audio', 'Online – Chat', 'In-person Home Visit'];
const COUNCILS = ['TSMC', 'MCI', 'Other State Council'];

const STEPS = [
  { num: 1, label: 'Welcome' },
  { num: 2, label: 'Basic Info' },
  { num: 3, label: 'Professional' },
  { num: 4, label: 'Availability' },
  { num: 5, label: 'Charges' },
  { num: 6, label: 'Declaration' },
];

export default function DoctorOnboarding() {
  const t = useT();
  const addEntry = useDoctorOnboardingStore(s => s.addEntry);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [f, setF] = useState({
    name: '', gender: '', dob: '', mobile: '', altPhone: '', email: '', address: '',
    qualification: '', specialization: '', specOther: '', experience: '',
    regNumber: '', council: '', degreeUpload: '', regUpload: '',
    modes: [], days: [], slots: [], homeVisits: '', homeAreas: '',
    onlineFee: '', clinicFee: '', homeFee: '',
    accHolder: '', bankName: '', accNumber: '', ifsc: '', chequeUpload: '',
    agree: false, signature: '',
  });

  const update = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggle = (k, v) => setF(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));

  const canNext = () => {
    if (step === 2) return f.name && f.gender && f.dob && f.mobile && f.email;
    if (step === 3) return f.qualification && f.specialization && f.experience && f.regNumber && f.council && f.degreeUpload && f.regUpload;
    if (step === 4) return f.modes.length > 0 && f.days.length > 0 && f.slots.length > 0;
    if (step === 5) return f.onlineFee && f.accHolder && f.bankName && f.accNumber && f.ifsc && f.chequeUpload;
    return true;
  };

  const handleSubmit = () => { addEntry(f); setSubmitted(true); };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 16 }}>
        <div style={{ ...card, textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{t('doctorOnboarding.success.title', 'Application Submitted!')}</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px', lineHeight: 1.6 }}>{t('doctorOnboarding.success.text1', 'Thank you for registering with Jeevan HealthCare at Home.')}</p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>{t('doctorOnboarding.success.text2', 'Our team will review your credentials and contact you shortly.')}</p>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>{t('doctorOnboarding.success.support', '📞 Support: +91 9700104108')} &nbsp;|&nbsp; 📧 care@jeevanhealthcare.com</div>
          <Link to="/" style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none' }}>{t('doctorOnboarding.success.goHome', 'Go to Home')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🩺</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{t('doctorOnboarding.heading', 'Doctor Onboarding Form')}</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{t('doctorOnboarding.subtitle', 'Jeevan HealthCare at Home')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step >= s.num ? '#0f172a' : '#e5e7eb', color: step >= s.num ? '#fff' : '#9ca3af' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: step === s.num ? '#0f172a' : '#9ca3af', fontWeight: step === s.num ? 600 : 400, marginLeft: 6, whiteSpace: 'nowrap' }}>{s.label}</div>
              {i < STEPS.length - 1 && <div style={{ width: 40, height: 2, background: step > s.num ? '#0f172a' : '#e5e7eb', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        <div style={card}>
          {/* Section 1: Welcome */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('doctorOnboarding.section', 'Section')} 1 {t('doctorOnboarding.of', 'of')} 6</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{t('doctorOnboarding.welcome.title', '🩺 Jeevan HealthCare at Home – Doctor Onboarding Form')}</h2>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>{t('doctorOnboarding.welcome.text1', 'Thank you for your interest in partnering with Jeevan HealthCare at Home.')}</p>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>{t('doctorOnboarding.welcome.text2', 'This form collects your professional details, consultation preferences, and availability to onboard you as a General Physician or Specialist for:')}</p>
              <div style={{ fontSize: 13, color: '#374151', marginBottom: 12, lineHeight: 1.8 }}>
                <div>{t('doctorOnboarding.welcome.online', '🖥️ Online Consultations')}</div>
                <div>{t('doctorOnboarding.welcome.clinic', '🏥 In-Clinic Consultations')}</div>
                <div>{t('doctorOnboarding.welcome.homeVisit', '🚑 Home Visits')}</div>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, fontSize: 13, color: '#374151', marginBottom: 16 }}>
                <strong>{t('doctorOnboarding.welcome.docsRequired', '✅ Documents Required for Upload:')}</strong>
                <div style={{ marginTop: 6 }}>{t('doctorOnboarding.welcome.degree', '• 📄 Medical Degree Certificate')}</div>
                <div>{t('doctorOnboarding.welcome.registration', '• 🩺 Registration Certificate (MCI/TSMC)')}</div>
                <div>{t('doctorOnboarding.welcome.bankDetails', '• 🏦 Bank Details (for payouts)')}</div>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '0 0 4px' }}>{t('doctorOnboarding.welcome.confidential', '🔐 Your information will remain strictly confidential.')}</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('doctorOnboarding.welcome.completionTime', '⏱️ Form Completion Time: 5–7 minutes')}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{t('doctorOnboarding.welcome.support', '📞 Support: +91 9700104108')} &nbsp;|&nbsp; 📧 care@jeevanhealthcare.com</p>
            </div>
          )}

          {/* Section 2: Basic Information */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('doctorOnboarding.section', 'Section')} 2 {t('doctorOnboarding.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('doctorOnboarding.basicInfo.title', 'Basic Information')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('doctorOnboarding.basicInfo.fullName', 'Full Name')} <span style={req}>*</span></label>
                  <input style={input} value={f.name} onChange={e => update('name', e.target.value)} placeholder={t('doctorOnboarding.basicInfo.fullNamePlaceholder', 'Dr. — Full name')} />
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.basicInfo.gender', 'Gender')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {[t('doctorOnboarding.basicInfo.genderMale', 'Male'), t('doctorOnboarding.basicInfo.genderFemale', 'Female'), t('doctorOnboarding.basicInfo.genderOther', 'Other'), t('doctorOnboarding.basicInfo.genderPreferNot', 'Prefer not to say')].map(g => (
                      <button key={g} onClick={() => update('gender', g)} style={chip(f.gender === g)}>{g}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('doctorOnboarding.basicInfo.dob', 'Date of Birth')} <span style={req}>*</span></label>
                    <input style={input} type="date" value={f.dob} onChange={e => update('dob', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.basicInfo.mobile', 'Mobile Number')} <span style={req}>*</span></label>
                    <input style={input} type="tel" value={f.mobile} onChange={e => update('mobile', e.target.value)} placeholder={t('doctorOnboarding.basicInfo.mobilePlaceholder', '10-digit mobile')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('doctorOnboarding.basicInfo.altPhone', 'Alternate Contact Number')}</label>
                    <input style={input} type="tel" value={f.altPhone} onChange={e => update('altPhone', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.basicInfo.email', 'Email ID')} <span style={req}>*</span></label>
                    <input style={input} type="email" value={f.email} onChange={e => update('email', e.target.value)} placeholder={t('doctorOnboarding.basicInfo.emailPlaceholder', 'email@example.com')} />
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.basicInfo.address', 'Address')}</label>
                  <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.address} onChange={e => update('address', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Professional Details */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('doctorOnboarding.section', 'Section')} 3 {t('doctorOnboarding.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('doctorOnboarding.professional.title', 'Professional Details')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('doctorOnboarding.professional.qualification', 'Medical Qualification (e.g., MBBS, MD, DNB)')} <span style={req}>*</span></label>
                  <input style={input} value={f.qualification} onChange={e => update('qualification', e.target.value)} placeholder={t('doctorOnboarding.professional.qualificationPlaceholder', 'e.g. MBBS, MD General Medicine')} />
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.professional.specialization', 'Specialization')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                    {SPECIALTIES.map(s => (
                      <button key={s} onClick={() => update('specialization', f.specialization === s ? '' : s)} style={chip(f.specialization === s)}>{s}</button>
                    ))}
                  </div>
                  <input style={input} value={f.specOther} onChange={e => update('specOther', e.target.value)} placeholder={t('doctorOnboarding.professional.specOtherPlaceholder', 'Others (please specify)')} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('doctorOnboarding.professional.experience', 'Years of Experience')} <span style={req}>*</span></label>
                    <input style={input} type="number" value={f.experience} onChange={e => update('experience', e.target.value)} placeholder={t('doctorOnboarding.professional.experiencePlaceholder', 'Years')} />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.professional.regNumber', 'Medical Reg. Number')} <span style={req}>*</span></label>
                    <input style={input} value={f.regNumber} onChange={e => update('regNumber', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.professional.council', 'Registration Council')} <span style={req}>*</span></label>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {COUNCILS.map(c => (
                        <button key={c} onClick={() => update('council', f.council === c ? '' : c)} style={chip(f.council === c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.professional.degreeUpload', 'Upload Degree/Certificate')} <span style={req}>*</span></label>
                  <input style={input} value={f.degreeUpload} onChange={e => update('degreeUpload', e.target.value)} placeholder={t('doctorOnboarding.professional.uploadPlaceholder', 'Paste link or file name')} />
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.professional.regUpload', 'Upload Registration Certificate')} <span style={req}>*</span></label>
                  <input style={input} value={f.regUpload} onChange={e => update('regUpload', e.target.value)} placeholder={t('doctorOnboarding.professional.uploadPlaceholder', 'Paste link or file name')} />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Availability & Consultation Mode */}
          {step === 4 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('doctorOnboarding.section', 'Section')} 4 {t('doctorOnboarding.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('doctorOnboarding.availability.title', 'Availability & Consultation Mode')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('doctorOnboarding.availability.modes', 'Preferred Consultation Modes')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {MODES.map(m => (
                      <button key={m} onClick={() => toggle('modes', m)} style={chip(f.modes.includes(m))}>{m}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.availability.days', 'Available Days')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {DAYS.map(d => (
                      <button key={d} onClick={() => toggle('days', d)} style={chip(f.days.includes(d))}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.availability.slots', 'Available Time Slots')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {SLOTS.map(s => (
                      <button key={s} onClick={() => toggle('slots', s)} style={chip(f.slots.includes(s))}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.availability.homeVisits', 'Willing to do Home Visits?')}</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[t('doctorOnboarding.availability.yes', 'Yes'), t('doctorOnboarding.availability.no', 'No')].map(o => (
                      <button key={o} onClick={() => update('homeVisits', o)} style={chip(f.homeVisits === o)}>{o}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.availability.homeAreas', 'Preferred Areas for Home Visit')}</label>
                  <input style={input} value={f.homeAreas} onChange={e => update('homeAreas', e.target.value)} placeholder={t('doctorOnboarding.availability.homeAreasPlaceholder', 'e.g. ECIL, Begumpet, Gachibowli')} />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Charges & Bank Details */}
          {step === 5 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('doctorOnboarding.section', 'Section')} 5 {t('doctorOnboarding.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('doctorOnboarding.charges.title', 'Charges & Bank Details')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.onlineFee', 'Online Consultation Fee (₹)')} <span style={req}>*</span></label>
                    <input style={input} type="number" value={f.onlineFee} onChange={e => update('onlineFee', e.target.value)} placeholder="₹" />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.clinicFee', 'In-Clinic Fee (₹)')}</label>
                    <input style={input} type="number" value={f.clinicFee} onChange={e => update('clinicFee', e.target.value)} placeholder="₹" />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.homeFee', 'Home Visit Fee (₹)')}</label>
                    <input style={input} type="number" value={f.homeFee} onChange={e => update('homeFee', e.target.value)} placeholder="₹" />
                  </div>
                </div>
                <div>
                  <label style={label}>{t('doctorOnboarding.charges.accHolder', 'Bank Account Holder Name')} <span style={req}>*</span></label>
                  <input style={input} value={f.accHolder} onChange={e => update('accHolder', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.bankName', 'Bank Name')} <span style={req}>*</span></label>
                    <input style={input} value={f.bankName} onChange={e => update('bankName', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.accNumber', 'Account Number')} <span style={req}>*</span></label>
                    <input style={input} value={f.accNumber} onChange={e => update('accNumber', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.ifsc', 'IFSC Code')} <span style={req}>*</span></label>
                    <input style={input} value={f.ifsc} onChange={e => update('ifsc', e.target.value)} placeholder={t('doctorOnboarding.charges.ifscPlaceholder', 'IFSC code')} />
                  </div>
                  <div>
                    <label style={label}>{t('doctorOnboarding.charges.chequeUpload', 'Upload Cancelled Cheque / Passbook')} <span style={req}>*</span></label>
                    <input style={input} value={f.chequeUpload} onChange={e => update('chequeUpload', e.target.value)} placeholder={t('doctorOnboarding.charges.uploadPlaceholder', 'Link or file name')} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Declaration */}
          {step === 6 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('doctorOnboarding.section', 'Section')} 6 {t('doctorOnboarding.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('doctorOnboarding.declaration.title', 'Declaration & Consent')}</h2>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, marginBottom: 16, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                {t('doctorOnboarding.declaration.text', 'I hereby declare that the information provided above is true and I agree to offer online/home consultation services for Jeevan HealthCare at Home.')}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                  <input type="checkbox" checked={f.agree} onChange={e => update('agree', e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  {t('doctorOnboarding.declaration.agree', 'I agree')} <span style={req}>*</span>
                </label>
              </div>
              <div>
                <label style={label}>{t('doctorOnboarding.declaration.signature', 'Digital Signature (Type Full Name)')} <span style={req}>*</span></label>
                <input style={input} value={f.signature} onChange={e => update('signature', e.target.value)} placeholder={t('doctorOnboarding.declaration.signaturePlaceholder', 'Type your full name as digital signature')} />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          <button style={btnOutline} onClick={() => setStep(s => s - 1)} disabled={step <= 1}>{t('doctorOnboarding.previous', '← Previous')}</button>
          <div style={{ fontSize: 13, color: '#64748b', alignSelf: 'center' }}>{t('doctorOnboarding.step', 'Step')} {step} {t('doctorOnboarding.of', 'of')} 6</div>
          {step < 6 ? (
            <button style={{ ...btnPrimary, opacity: canNext() ? 1 : 0.5 }} onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}>{t('doctorOnboarding.next', 'Next →')}</button>
          ) : (
            <button style={{ ...btnPrimary, opacity: f.agree && f.signature ? 1 : 0.5 }} onClick={handleSubmit} disabled={!f.agree || !f.signature}>{t('doctorOnboarding.submit', 'Submit Application')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
