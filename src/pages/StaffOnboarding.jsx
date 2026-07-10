import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useStaffStore from '../stores/staffStore';

const input = { padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff', transition: 'border-color 0.15s' };
const label = { fontSize: 13, fontWeight: 600, color: '#1f2937', marginBottom: 4, display: 'block' };
const req = { color: '#dc2626', marginLeft: 2 };
const card = { background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', maxWidth: 720, margin: '0 auto' };
const btnPrimary = { padding: '12px 32px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', fontWeight: 600 };
const btnOutline = { padding: '12px 32px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', color: '#374151' };
const radioGroup = { display: 'flex', gap: 4, flexWrap: 'wrap' };
const chip = (active) => ({ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (active ? '#0f172a' : '#d1d5db'), background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#374151', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: active ? 600 : 400 });

const ROLES = ['Registered Nurse (GNM / BSc Nursing)', 'Physiotherapist (BPT / MPT)', 'Lab/Diagnostic Sample Collection', 'Caregiver', 'Baby Care Giver', 'Diet & Nutritionist', 'Respiratory Therapist', 'Stoma Therapist', 'Vac Therapist', 'Occupational Therapist', 'Autism Therapist'];
const SERVICES = ['Nursing Care (IV, IM, Catheter, Ryles Tube, Wound Dressing)', 'Elder / Palliative Care', 'Post-surgical/Bedridden Care', 'In-person Home Visit', 'Physiotherapy at Home', 'General Caregiving (Elder/Disabled/Child)', 'Sample Collection for Lab Tests', 'In-clinic Assistance', 'Health Camps / Corporate Events', 'Healthcare Assistant'];
const ENGAGEMENTS = ['Full-Time', 'Part-Time', 'On-Call Basis', 'Freelance/Per Visit'];
const SHIFTS = ['Morning (6AM–2PM)', 'Afternoon (12pm–4pm)', 'Afternoon (2PM–10PM)', 'Night (8pm–10pm)', 'Night (10PM–6AM)', '24-Hour Stay', '24-Hour Shift', 'Flexible / On Request'];
const LANGUAGES = ['Telugu', 'Hindi', 'English', 'Tamil', 'Kannada'];
const ACCOUNT_TYPES = ['Savings', 'Current', 'Salary'];
const ID_TYPES = ['Aadhaar', 'PAN', 'Voter ID', 'DL'];

const STEPS = [
  { num: 1, label: 'Welcome' },
  { num: 2, label: 'Basic Info' },
  { num: 3, label: 'Qualifications' },
  { num: 4, label: 'Preferences' },
  { num: 5, label: 'Bank Details' },
  { num: 6, label: 'Declaration' },
];

export default function StaffOnboarding() {
  const t = useT();
  const addEntry = useStaffStore(s => s.addEntry);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [f, setF] = useState({
    name: '', gender: '', dob: '', mobile: '', altPhone: '', email: '',
    address: '', city: '', state: '', pincode: '',
    role: '', roleOther: '', qualification: '', course: '', university: '', yearPassing: '', certificate: '',
    council: '', councilOther: '', regNumber: '', certificate2: '',
    experience: '', workplaces: '', homeCare: '', experienceCert: '', languages: [],
    services: [], engagement: '', shift: '', workAreas: '', workPincodes: '',
    accHolder: '', bankName: '', ifsc: '', accNumber: '', accType: '',
    chequeUpload: '', idType: '', idNumber: '', idUpload: '', photo: '',
    agree: false, signature: '',
  });

  const update = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleArray = (k, v) => setF(p => ({ ...p, [k]: p[k].includes(v) ? p[k].filter(x => x !== v) : [...p[k], v] }));

  const canNext = () => {
    if (step === 2) return f.name && f.gender && f.dob && f.mobile && f.email && f.city && f.state && f.pincode;
    if (step === 3) return f.role && f.qualification && f.regNumber && f.certificate2 && f.experience && f.homeCare && f.languages.length > 0;
    if (step === 4) return f.services.length > 0 && f.engagement && f.shift;
    if (step === 5) return f.accHolder && f.bankName && f.ifsc && f.accNumber && f.accType && f.idNumber && f.idUpload && f.photo;
    return true;
  };

  const handleSubmit = () => {
    addEntry(f);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 16 }}>
        <div style={{ ...card, textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{t('staff.submitted.title', 'Application Submitted!')}</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px', lineHeight: 1.6 }}>{t('staff.submitted.thankYou', 'Thank you for your interest in partnering with Jeevan HealthCare at Home.')}</p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>{t('staff.submitted.review', 'Our team will review your application and get back to you shortly.')}</p>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>{t('staff.submitted.support', '📞 Support: +919700104108  |  📧 care@jeevanhealthcare.com')}</div>
          <Link to="/" style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none' }}>{t('staff.submitted.goHome', 'Go to Home')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '24px 16px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🏥</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{t('staff.header.title', 'Healthcare Professional Onboarding')}</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{t('staff.header.subtitle', 'Jeevan HealthCare at Home')}</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step >= s.num ? '#0f172a' : '#e5e7eb', color: step >= s.num ? '#fff' : '#9ca3af', transition: 'all 0.2s' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: step === s.num ? '#0f172a' : '#9ca3af', fontWeight: step === s.num ? 600 : 400, marginLeft: 6, whiteSpace: 'nowrap' }}>{t(`staff.step.${s.num}.${s.label.toLowerCase().replace(/\s+/g, '_')}`, s.label)}</div>
              {i < STEPS.length - 1 && <div style={{ width: 40, height: 2, background: step > s.num ? '#0f172a' : '#e5e7eb', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        <div style={card}>
          {/* Section 1: Welcome */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('staff.section', 'Section')} 1 {t('staff.of', 'of')} 6</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{t('staff.welcome.title', "🩺 Join India's Largest Home Healthcare Network!")}</h2>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>{t('staff.welcome.line1', 'Thank you for your interest in partnering with Jeevan HealthCare at Home.')}</p>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>{t('staff.welcome.line2', 'This form collects your professional details, work preferences, and availability to onboard you as a Healthcare Professional for:')}</p>
              <div style={{ display: 'grid', gap: 4, fontSize: 13, color: '#374151', marginBottom: 12 }}>
                {[
                  t('staff.welcome.item1', 'Nursing Care'),
                  t('staff.welcome.item2', 'Caregiving Services'),
                  t('staff.welcome.item3', 'Physiotherapy at Home'),
                  t('staff.welcome.item4', 'Lab/Diagnostic Support'),
                  t('staff.welcome.item5', 'Elder & Post-operative Care'),
                  t('staff.welcome.item6', 'Sample Collection / Technician Support'),
                ].map(txt => <div key={txt}>✅ {txt}</div>)}
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, fontSize: 13, color: '#374151', marginBottom: 16 }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>{t('staff.welcome.servicesOffered', '📋 Services We Offer:')}</strong>
                <div>{t('staff.welcome.service1', '🧑‍⚕️ Home Visits')}</div>
                <div>{t('staff.welcome.service2', '🏥 In-Clinic Support')}</div>
                <div>{t('staff.welcome.service3', '🏢 Corporate Health Camps')}</div>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '0 0 4px' }}>{t('staff.welcome.confidential', '🔐 Your information will be kept strictly confidential.')}</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}><strong>{t('staff.welcome.docsRequired', 'Documents Required:')}</strong> {t('staff.welcome.docsList', 'Qualification Certificate, Registration Certificate (if applicable), Bank Details (Cancelled Cheque or Passbook copy)')}</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('staff.welcome.completionTime', '⏱️ Form Completion Time: 5–7 Minutes')}</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{t('staff.welcome.support', '📞 Support: +919700104108  |  📧 care@jeevanhealthcare.com')}</p>
            </div>
          )}

          {/* Section 2: Basic Information */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('staff.section', 'Section')} 2 {t('staff.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('staff.basicInfo.title', 'Basic Information')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('staff.basicInfo.fullName', 'Full Name')} <span style={req}>*</span></label>
                  <input style={input} value={f.name} onChange={e => update('name', e.target.value)} placeholder={t('staff.basicInfo.fullNamePlaceholder', 'Enter your full name')} />
                </div>
                <div>
                  <label style={label}>{t('staff.basicInfo.gender', 'Gender')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map(gVal => {
                      const gLabel = gVal === 'Male' ? t('staff.basicInfo.genderMale', 'Male') : gVal === 'Female' ? t('staff.basicInfo.genderFemale', 'Female') : gVal === 'Other' ? t('staff.basicInfo.genderOther', 'Other') : t('staff.basicInfo.genderPreferNot', 'Prefer not to say');
                      return <button key={gVal} onClick={() => update('gender', gVal)} style={chip(f.gender === gVal)}>{gLabel}</button>;
                    })}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.basicInfo.dob', 'Date of Birth')} <span style={req}>*</span></label>
                    <input style={input} type="date" value={f.dob} onChange={e => update('dob', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.basicInfo.mobile', 'Mobile Number')} <span style={req}>*</span></label>
                    <input style={input} type="tel" value={f.mobile} onChange={e => update('mobile', e.target.value)} placeholder={t('staff.basicInfo.mobilePlaceholder', '10-digit mobile number')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.basicInfo.altPhone', 'Alternate Contact Number')}</label>
                    <input style={input} type="tel" value={f.altPhone} onChange={e => update('altPhone', e.target.value)} placeholder="" />
                  </div>
                  <div>
                    <label style={label}>{t('staff.basicInfo.email', 'Email ID')} <span style={req}>*</span></label>
                    <input style={input} type="email" value={f.email} onChange={e => update('email', e.target.value)} placeholder={t('staff.basicInfo.emailPlaceholder', 'email@example.com')} />
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.basicInfo.address', 'Current Residential Address:')} <span style={req}>*</span></label>
                  <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.basicInfo.city', 'City:')} <span style={req}>*</span></label>
                    <input style={input} value={f.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.basicInfo.state', 'State:')} <span style={req}>*</span></label>
                    <input style={input} value={f.state} onChange={e => update('state', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.basicInfo.pincode', 'PIN Code:')} <span style={req}>*</span></label>
                    <input style={input} value={f.pincode} onChange={e => update('pincode', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Educational & Professional Qualifications */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('staff.section', 'Section')} 3 {t('staff.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('staff.qualifications.title', '🎓 Educational & Professional Qualifications')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('staff.qualifications.role', 'Your Professional Role / Designation:')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                    {ROLES.map((r, i) => (
                      <button key={r} onClick={() => update('role', f.role === r ? '' : r)} style={chip(f.role === r)}>{t(`staff.qualifications.role_${i}`, r)}</button>
                    ))}
                  </div>
                  <input style={input} value={f.roleOther} onChange={e => update('roleOther', e.target.value)} placeholder={t('staff.qualifications.roleOtherPlaceholder', 'Others (please specify)')} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.qualifications.highestQual', 'Highest Qualification:')} <span style={req}>*</span></label>
                    <input style={input} value={f.qualification} onChange={e => update('qualification', e.target.value)} placeholder={t('staff.qualifications.highestQualPlaceholder', 'e.g. BSc Nursing')} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.qualifications.courseName', 'Course Name')}</label>
                    <input style={input} value={f.course} onChange={e => update('course', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.qualifications.university', 'University/Board')}</label>
                    <input style={input} value={f.university} onChange={e => update('university', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.qualifications.yearPassing', 'Year of Passing')}</label>
                    <input style={input} type="date" value={f.yearPassing} onChange={e => update('yearPassing', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.uploadDegree', 'Upload Degree/Certificate (link or file name)')}</label>
                  <input style={input} value={f.certificate} onChange={e => update('certificate', e.target.value)} placeholder={t('staff.qualifications.uploadPlaceholder', 'Paste link or file name')} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.qualifications.council', 'Professional Registration Council:')} <span style={req}>*</span></label>
                    <select style={input} value={f.council} onChange={e => update('council', e.target.value)}>
                      <option value="">{t('staff.qualifications.selectCouncil', 'Select Council')}</option>
                      {['Telangana', 'Andhrapradhesh', 'Delhi Paramedical', 'Nursing Council', 'Others'].map(c => <option key={c} value={c}>{t(`staff.qualifications.council_${c.toLowerCase().replace(/\s+/g, '_')}`, c)}</option>)}
                    </select>
                    {f.council === 'Others' && <input style={{ ...input, marginTop: 6 }} value={f.councilOther} onChange={e => update('councilOther', e.target.value)} placeholder={t('staff.qualifications.specifyCouncil', 'Specify council')} />}
                  </div>
                  <div>
                    <label style={label}>{t('staff.qualifications.regNumber', 'Registration Number')} <span style={req}>*</span></label>
                    <input style={input} value={f.regNumber} onChange={e => update('regNumber', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.uploadDegreeReq', 'Upload Degree/Certificate (link or file name)')} <span style={req}>*</span></label>
                  <input style={input} value={f.certificate2} onChange={e => update('certificate2', e.target.value)} placeholder={t('staff.qualifications.uploadPlaceholder', 'Paste link or file name')} />
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.experience', 'Years of Work Experience:')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {['0-1 year', '1-3 years', '3-5 years', '5+ years'].map((e, i) => (
                      <button key={e} onClick={() => update('experience', e)} style={chip(f.experience === e)}>{t(`staff.qualifications.exp_${i}`, e)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.previousWorkplaces', 'Previous Workplaces / Employers')}</label>
                  <textarea style={{ ...input, resize: 'vertical', minHeight: 50 }} value={f.workplaces} onChange={e => update('workplaces', e.target.value)} placeholder={t('staff.qualifications.workplacesPlaceholder', 'Mention hospital/clinic/lab names and roles held')} />
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.homeCare', 'Do you have experience in home care services?')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {[t('staff.qualifications.yes', 'Yes'), t('staff.qualifications.no', 'No')].map((o, i) => {
                      const val = i === 0 ? 'Yes' : 'No';
                      return (
                        <button key={val} onClick={() => update('homeCare', val)} style={chip(f.homeCare === val)}>{o}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.experienceCert', 'Upload Work Experience Certificate(s):')}</label>
                  <input style={input} value={f.experienceCert} onChange={e => update('experienceCert', e.target.value)} placeholder={t('staff.qualifications.uploadPlaceholder', 'Link or file name')} />
                </div>
                <div>
                  <label style={label}>{t('staff.qualifications.languages', 'Languages You Can Speak Comfortably:')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {LANGUAGES.map(l => (
                      <button key={l} onClick={() => toggleArray('languages', l)} style={chip(f.languages.includes(l))}>{t(`staff.qualifications.lang_${l.toLowerCase()}`, l)}</button>
                    ))}
                    <input style={{ ...input, width: 120, padding: '6px 10px' }} value={f.languages.filter(l => !LANGUAGES.includes(l)).join(', ')} onChange={e => update('languages', [...LANGUAGES, ...e.target.value.split(',').map(x => x.trim()).filter(Boolean)])} placeholder={t('staff.qualifications.langOther', 'Other (comma)')} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Service Preferences */}
          {step === 4 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('staff.section', 'Section')} 4 {t('staff.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('staff.preferences.title', '🛠️ Service Preferences & Availability')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('staff.preferences.servicesLabel', 'Which services can you confidently provide?')} <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {SERVICES.map((s, i) => (
                      <button key={s} onClick={() => toggleArray('services', s)} style={chip(f.services.includes(s))}>{t(`staff.preferences.service_${i}`, s)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.preferences.engagement', 'Type of Engagement Preferred:')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {ENGAGEMENTS.map((e, i) => (
                      <button key={e} onClick={() => update('engagement', e)} style={chip(f.engagement === e)}>{t(`staff.preferences.engagement_${i}`, e)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.preferences.shift', 'Preferred Shift Timing:')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {SHIFTS.map((s, i) => (
                      <button key={s} onClick={() => update('shift', s)} style={chip(f.shift === s)}>{t(`staff.preferences.shift_${i}`, s)}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.preferences.workAreas', 'Preferred Work Location / Areas You Can Cover:')}</label>
                  <input style={input} value={f.workAreas} onChange={e => update('workAreas', e.target.value)} placeholder={t('staff.preferences.workAreasPlaceholder', 'Enter nearby areas')} />
                </div>
                <div>
                  <label style={label}>{t('staff.preferences.workPincodes', 'Preferred Work Location PIN Code:')}</label>
                  <input style={input} value={f.workPincodes} onChange={e => update('workPincodes', e.target.value)} placeholder={t('staff.preferences.workPincodesPlaceholder', 'PIN codes you are comfortable covering')} />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Bank Details */}
          {step === 5 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('staff.section', 'Section')} 5 {t('staff.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('staff.bankDetails.title', '🏦 Bank Details (Mandatory for Service Payments)')}</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>{t('staff.bankDetails.accHolder', 'Account Holder Name (as per bank):')} <span style={req}>*</span></label>
                  <input style={input} value={f.accHolder} onChange={e => update('accHolder', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.bankDetails.bankName', 'Bank Name:')} <span style={req}>*</span></label>
                    <input style={input} value={f.bankName} onChange={e => update('bankName', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.bankDetails.ifsc', 'Branch & IFSC Code:')} <span style={req}>*</span></label>
                    <input style={input} value={f.ifsc} onChange={e => update('ifsc', e.target.value)} placeholder={t('staff.bankDetails.ifscPlaceholder', 'IFSC code')} />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.bankDetails.accNumber', 'Account Number:')} <span style={req}>*</span></label>
                    <input style={input} value={f.accNumber} onChange={e => update('accNumber', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.bankDetails.accType', 'Type of Account:')} <span style={req}>*</span></label>
                    <div style={radioGroup}>
                      {ACCOUNT_TYPES.map((acct, i) => (
                        <button key={acct} onClick={() => update('accType', acct)} style={chip(f.accType === acct)}>{t(`staff.bankDetails.acct_${i}`, acct)}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.bankDetails.chequeUpload', 'Upload Cancelled Cheque or Bank Passbook (First Page)')} <span style={req}>*</span></label>
                  <input style={input} value={f.chequeUpload} onChange={e => update('chequeUpload', e.target.value)} placeholder={t('staff.bankDetails.uploadPlaceholder', 'Link or file name')} />
                </div>
                <div>
                  <label style={label}>{t('staff.bankDetails.idType', 'Valid Photo ID Type:')} <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {ID_TYPES.map((idtype, i) => (
                      <button key={idtype} onClick={() => update('idType', idtype)} style={chip(f.idType === idtype)}>{t(`staff.bankDetails.idType_${i}`, idtype)}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>{t('staff.bankDetails.idNumber', 'ID Number')} <span style={req}>*</span></label>
                    <input style={input} value={f.idNumber} onChange={e => update('idNumber', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>{t('staff.bankDetails.idUpload', 'Upload ID')} <span style={req}>*</span></label>
                    <input style={input} value={f.idUpload} onChange={e => update('idUpload', e.target.value)} placeholder={t('staff.bankDetails.uploadPlaceholder', 'Link or file name')} />
                  </div>
                </div>
                <div>
                  <label style={label}>{t('staff.bankDetails.photo', 'Upload Recent Passport Size Photo')} <span style={req}>*</span></label>
                  <input style={input} value={f.photo} onChange={e => update('photo', e.target.value)} placeholder={t('staff.bankDetails.uploadPlaceholder', 'Link or file name')} />
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Declaration */}
          {step === 6 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('staff.section', 'Section')} 6 {t('staff.of', 'of')} 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>{t('staff.declaration.title', 'Declaration & Consent')}</h2>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, marginBottom: 16, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                {t('staff.declaration.text', 'I hereby declare that the information provided above is accurate and true to the best of my knowledge. I agree to follow the professional ethics and service guidelines of Jeevan HealthCare at Home.')}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                  <input type="checkbox" checked={f.agree} onChange={e => update('agree', e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  {t('staff.declaration.iAgree', 'I agree')} <span style={req}>*</span>
                </label>
              </div>
              <div>
                <label style={label}>{t('staff.declaration.signature', 'Digital Signature (Type Full Name)')} <span style={req}>*</span></label>
                <input style={input} value={f.signature} onChange={e => update('signature', e.target.value)} placeholder={t('staff.declaration.signaturePlaceholder', 'Type your full name as digital signature')} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          <button style={btnOutline} onClick={() => setStep(s => s - 1)} disabled={step <= 1}>{t('staff.nav.previous', '← Previous')}</button>
          <div style={{ fontSize: 13, color: '#64748b', alignSelf: 'center' }}>{t('staff.nav.step', 'Step')} {step} {t('staff.of', 'of')} 6</div>
          {step < 6 ? (
            <button style={{ ...btnPrimary, opacity: canNext() ? 1 : 0.5 }} onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}>{t('staff.nav.next', 'Next →')}</button>
          ) : (
            <button style={{ ...btnPrimary, opacity: f.agree && f.signature ? 1 : 0.5 }} onClick={handleSubmit} disabled={!f.agree || !f.signature}>{t('staff.nav.submit', 'Submit Application')}</button>
          )}
        </div>
      </div>
    </div>
  );
}
