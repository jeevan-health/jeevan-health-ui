import { useState } from 'react';
import { Link } from 'react-router-dom';
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
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px', lineHeight: 1.6 }}>Thank you for your interest in partnering with Jeevan HealthCare at Home.</p>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>Our team will review your application and get back to you shortly.</p>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>📞 Support: +919700104108 &nbsp;|&nbsp; 📧 care@jeevanhealthcare.com</div>
          <Link to="/" style={{ ...btnPrimary, display: 'inline-block', textDecoration: 'none' }}>Go to Home</Link>
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
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Healthcare Professional Onboarding</h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Jeevan HealthCare at Home</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: step >= s.num ? '#0f172a' : '#e5e7eb', color: step >= s.num ? '#fff' : '#9ca3af', transition: 'all 0.2s' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: step === s.num ? '#0f172a' : '#9ca3af', fontWeight: step === s.num ? 600 : 400, marginLeft: 6, whiteSpace: 'nowrap' }}>{s.label}</div>
              {i < STEPS.length - 1 && <div style={{ width: 40, height: 2, background: step > s.num ? '#0f172a' : '#e5e7eb', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        <div style={card}>
          {/* Section 1: Welcome */}
          {step === 1 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Section 1 of 6</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>🩺 Join India's Largest Home Healthcare Network!</h2>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>Thank you for your interest in partnering with Jeevan HealthCare at Home.</p>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>This form collects your professional details, work preferences, and availability to onboard you as a Healthcare Professional for:</p>
              <div style={{ display: 'grid', gap: 4, fontSize: 13, color: '#374151', marginBottom: 12 }}>
                {['Nursing Care', 'Caregiving Services', 'Physiotherapy at Home', 'Lab/Diagnostic Support', 'Elder & Post-operative Care', 'Sample Collection / Technician Support'].map(t => <div key={t}>✅ {t}</div>)}
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: 10, padding: 16, fontSize: 13, color: '#374151', marginBottom: 16 }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>📋 Services We Offer:</strong>
                <div>🧑‍⚕️ Home Visits</div>
                <div>🏥 In-Clinic Support</div>
                <div>🏢 Corporate Health Camps</div>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '0 0 4px' }}>🔐 Your information will be kept strictly confidential.</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 4px' }}><strong>Documents Required:</strong> Qualification Certificate, Registration Certificate (if applicable), Bank Details (Cancelled Cheque or Passbook copy)</p>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>⏱️ Form Completion Time: 5–7 Minutes</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>📞 Support: +919700104108 &nbsp;|&nbsp; 📧 care@jeevanhealthcare.com</p>
            </div>
          )}

          {/* Section 2: Basic Information */}
          {step === 2 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Section 2 of 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Basic Information</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Full Name <span style={req}>*</span></label>
                  <input style={input} value={f.name} onChange={e => update('name', e.target.value)} placeholder="Enter your full name" />
                </div>
                <div>
                  <label style={label}>Gender <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                      <button key={g} onClick={() => update('gender', g)} style={chip(f.gender === g)}>{g}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>Date of Birth <span style={req}>*</span></label>
                    <input style={input} type="date" value={f.dob} onChange={e => update('dob', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>Mobile Number <span style={req}>*</span></label>
                    <input style={input} type="tel" value={f.mobile} onChange={e => update('mobile', e.target.value)} placeholder="10-digit mobile number" />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>Alternate Contact Number</label>
                    <input style={input} type="tel" value={f.altPhone} onChange={e => update('altPhone', e.target.value)} placeholder="" />
                  </div>
                  <div>
                    <label style={label}>Email ID <span style={req}>*</span></label>
                    <input style={input} type="email" value={f.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" />
                  </div>
                </div>
                <div>
                  <label style={label}>Current Residential Address: <span style={req}>*</span></label>
                  <textarea style={{ ...input, resize: 'vertical', minHeight: 60 }} value={f.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div>
                    <label style={label}>City: <span style={req}>*</span></label>
                    <input style={input} value={f.city} onChange={e => update('city', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>State: <span style={req}>*</span></label>
                    <input style={input} value={f.state} onChange={e => update('state', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>PIN Code: <span style={req}>*</span></label>
                    <input style={input} value={f.pincode} onChange={e => update('pincode', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Educational & Professional Qualifications */}
          {step === 3 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Section 3 of 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>🎓 Educational & Professional Qualifications</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Your Professional Role / Designation: <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                    {ROLES.map(r => (
                      <button key={r} onClick={() => update('role', f.role === r ? '' : r)} style={chip(f.role === r)}>{r}</button>
                    ))}
                  </div>
                  <input style={input} value={f.roleOther} onChange={e => update('roleOther', e.target.value)} placeholder="Others (please specify)" />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>Highest Qualification: <span style={req}>*</span></label>
                    <input style={input} value={f.qualification} onChange={e => update('qualification', e.target.value)} placeholder="e.g. BSc Nursing" />
                  </div>
                  <div>
                    <label style={label}>Course Name</label>
                    <input style={input} value={f.course} onChange={e => update('course', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>University/Board</label>
                    <input style={input} value={f.university} onChange={e => update('university', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>Year of Passing</label>
                    <input style={input} type="date" value={f.yearPassing} onChange={e => update('yearPassing', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={label}>Upload Degree/Certificate (link or file name)</label>
                  <input style={input} value={f.certificate} onChange={e => update('certificate', e.target.value)} placeholder="Paste link or file name" />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>Professional Registration Council: <span style={req}>*</span></label>
                    <select style={input} value={f.council} onChange={e => update('council', e.target.value)}>
                      <option value="">Select Council</option>
                      {['Telangana', 'Andhrapradhesh', 'Delhi Paramedical', 'Nursing Council', 'Others'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {f.council === 'Others' && <input style={{ ...input, marginTop: 6 }} value={f.councilOther} onChange={e => update('councilOther', e.target.value)} placeholder="Specify council" />}
                  </div>
                  <div>
                    <label style={label}>Registration Number <span style={req}>*</span></label>
                    <input style={input} value={f.regNumber} onChange={e => update('regNumber', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={label}>Upload Degree/Certificate (link or file name) <span style={req}>*</span></label>
                  <input style={input} value={f.certificate2} onChange={e => update('certificate2', e.target.value)} placeholder="Paste link or file name" />
                </div>
                <div>
                  <label style={label}>Years of Work Experience: <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {['0-1 year', '1-3 years', '3-5 years', '5+ years'].map(e => (
                      <button key={e} onClick={() => update('experience', e)} style={chip(f.experience === e)}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Previous Workplaces / Employers</label>
                  <textarea style={{ ...input, resize: 'vertical', minHeight: 50 }} value={f.workplaces} onChange={e => update('workplaces', e.target.value)} placeholder="Mention hospital/clinic/lab names and roles held" />
                </div>
                <div>
                  <label style={label}>Do you have experience in home care services? <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {['Yes', 'No'].map(o => (
                      <button key={o} onClick={() => update('homeCare', o)} style={chip(f.homeCare === o)}>{o}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Upload Work Experience Certificate(s):</label>
                  <input style={input} value={f.experienceCert} onChange={e => update('experienceCert', e.target.value)} placeholder="Link or file name" />
                </div>
                <div>
                  <label style={label}>Languages You Can Speak Comfortably: <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {LANGUAGES.map(l => (
                      <button key={l} onClick={() => toggleArray('languages', l)} style={chip(f.languages.includes(l))}>{l}</button>
                    ))}
                    <input style={{ ...input, width: 120, padding: '6px 10px' }} value={f.languages.filter(l => !LANGUAGES.includes(l)).join(', ')} onChange={e => update('languages', [...LANGUAGES, ...e.target.value.split(',').map(x => x.trim()).filter(Boolean)])} placeholder="Other (comma)" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Service Preferences */}
          {step === 4 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Section 4 of 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>🛠️ Service Preferences & Availability</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Which services can you confidently provide? <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {SERVICES.map(s => (
                      <button key={s} onClick={() => toggleArray('services', s)} style={chip(f.services.includes(s))}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Type of Engagement Preferred: <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {ENGAGEMENTS.map(e => (
                      <button key={e} onClick={() => update('engagement', e)} style={chip(f.engagement === e)}>{e}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Preferred Shift Timing: <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {SHIFTS.map(s => (
                      <button key={s} onClick={() => update('shift', s)} style={chip(f.shift === s)}>{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Preferred Work Location / Areas You Can Cover:</label>
                  <input style={input} value={f.workAreas} onChange={e => update('workAreas', e.target.value)} placeholder="Enter nearby areas" />
                </div>
                <div>
                  <label style={label}>Preferred Work Location PIN Code:</label>
                  <input style={input} value={f.workPincodes} onChange={e => update('workPincodes', e.target.value)} placeholder="PIN codes you are comfortable covering" />
                </div>
              </div>
            </div>
          )}

          {/* Section 5: Bank Details */}
          {step === 5 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Section 5 of 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>🏦 Bank Details (Mandatory for Service Payments)</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Account Holder Name (as per bank): <span style={req}>*</span></label>
                  <input style={input} value={f.accHolder} onChange={e => update('accHolder', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>Bank Name: <span style={req}>*</span></label>
                    <input style={input} value={f.bankName} onChange={e => update('bankName', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>Branch & IFSC Code: <span style={req}>*</span></label>
                    <input style={input} value={f.ifsc} onChange={e => update('ifsc', e.target.value)} placeholder="IFSC code" />
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>Account Number: <span style={req}>*</span></label>
                    <input style={input} value={f.accNumber} onChange={e => update('accNumber', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>Type of Account: <span style={req}>*</span></label>
                    <div style={radioGroup}>
                      {ACCOUNT_TYPES.map(t => (
                        <button key={t} onClick={() => update('accType', t)} style={chip(f.accType === t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={label}>Upload Cancelled Cheque or Bank Passbook (First Page) <span style={req}>*</span></label>
                  <input style={input} value={f.chequeUpload} onChange={e => update('chequeUpload', e.target.value)} placeholder="Link or file name" />
                </div>
                <div>
                  <label style={label}>Valid Photo ID Type: <span style={req}>*</span></label>
                  <div style={radioGroup}>
                    {ID_TYPES.map(t => (
                      <button key={t} onClick={() => update('idType', t)} style={chip(f.idType === t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <label style={label}>ID Number <span style={req}>*</span></label>
                    <input style={input} value={f.idNumber} onChange={e => update('idNumber', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>Upload ID <span style={req}>*</span></label>
                    <input style={input} value={f.idUpload} onChange={e => update('idUpload', e.target.value)} placeholder="Link or file name" />
                  </div>
                </div>
                <div>
                  <label style={label}>Upload Recent Passport Size Photo <span style={req}>*</span></label>
                  <input style={input} value={f.photo} onChange={e => update('photo', e.target.value)} placeholder="Link or file name" />
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Declaration */}
          {step === 6 && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Section 6 of 6</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Declaration & Consent</h2>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, marginBottom: 16, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                I hereby declare that the information provided above is accurate and true to the best of my knowledge. I agree to follow the professional ethics and service guidelines of Jeevan HealthCare at Home.
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                  <input type="checkbox" checked={f.agree} onChange={e => update('agree', e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  I agree <span style={req}>*</span>
                </label>
              </div>
              <div>
                <label style={label}>Digital Signature (Type Full Name) <span style={req}>*</span></label>
                <input style={input} value={f.signature} onChange={e => update('signature', e.target.value)} placeholder="Type your full name as digital signature" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
          <button style={btnOutline} onClick={() => setStep(s => s - 1)} disabled={step <= 1}>← Previous</button>
          <div style={{ fontSize: 13, color: '#64748b', alignSelf: 'center' }}>Step {step} of 6</div>
          {step < 6 ? (
            <button style={{ ...btnPrimary, opacity: canNext() ? 1 : 0.5 }} onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()}>Next →</button>
          ) : (
            <button style={{ ...btnPrimary, opacity: f.agree && f.signature ? 1 : 0.5 }} onClick={handleSubmit} disabled={!f.agree || !f.signature}>Submit Application</button>
          )}
        </div>
      </div>
    </div>
  );
}