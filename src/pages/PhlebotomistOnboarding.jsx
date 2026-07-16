/**
 * Public phlebotomist hiring form — mirrors client Google Form:
 * "Now Hiring: Phlebotomists for Camps & Home Sample Collection Services"
 * Route: /onboarding-phlebotomist
 * Mobile-first (candidates apply from phones).
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as staffApplicationService from '../services/staffApplicationService';

const input = {
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  fontSize: 16, // avoid iOS zoom
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fff',
  minHeight: 44,
};
const label = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1f2937',
  marginBottom: 6,
  display: 'block',
  lineHeight: 1.3,
};
const req = { color: '#dc2626', marginLeft: 2 };
const card = {
  background: '#fff',
  borderRadius: 16,
  padding: 16,
  border: '1px solid #e5e7eb',
  maxWidth: 720,
  margin: '0 auto',
  boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
};
const btnPrimary = {
  padding: '12px 20px',
  borderRadius: 10,
  border: 'none',
  background: '#0d9488',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 15,
  fontFamily: 'inherit',
  fontWeight: 700,
  minHeight: 48,
};
const btnOutline = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#374151',
  fontWeight: 600,
  minHeight: 48,
};
const chip = (active) => ({
  padding: '10px 14px',
  borderRadius: 10,
  border: `1.5px solid ${active ? '#0d9488' : '#d1d5db'}`,
  background: active ? '#0d9488' : '#fff',
  color: active ? '#fff' : '#374151',
  cursor: 'pointer',
  fontSize: 14,
  fontFamily: 'inherit',
  fontWeight: active ? 700 : 500,
  minHeight: 42,
});

const STEPS = [
  { num: 1, label: 'Welcome' },
  { num: 2, label: 'Personal' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Skills' },
  { num: 5, label: 'Address' },
  { num: 6, label: 'Review' },
];

const JOB_OPTIONS = ['Home Sample Collection', 'Sitting Job', 'Camps'];
const EDU_OPTIONS = ['MLT', 'DMLT', 'BMLT'];

const emptyForm = () => ({
  fullName: '',
  dob: '',
  age: '',
  gender: '',
  maritalStatus: '',
  phone: '',
  email: '',
  aadhaar: '',
  aadhaarFile: null,
  education: '',
  certificateFile: null,
  paramedicalRegNo: '',
  paramedicalCertFile: null,
  workExperience: '',
  resumeFile: null,
  vacutainerMethod: '',
  preferredJobs: [],
  preferredLocation: '',
  preferredPincode: '',
  drivingLicense: '',
  ownsTwoWheeler: '',
  vehicleRegNo: '',
  references: '',
  presentHouse: '',
  presentStreet: '',
  presentArea: '',
  presentDistrict: '',
  presentState: '',
  presentPincode: '',
  sameAsPresent: false,
  permanentHouse: '',
  permanentStreet: '',
  permanentArea: '',
  permanentDistrict: '',
  permanentState: '',
  permanentPincode: '',
  feedback: '',
  agree: false,
});

async function fileToMeta(file) {
  if (!file) return null;
  const max = 1.5 * 1024 * 1024;
  const base = { name: file.name, size: file.size, type: file.type || 'application/octet-stream' };
  if (file.size > max) {
    return { ...base, dataUrl: null, note: 'File too large for browser storage — re-upload via admin if needed' };
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ ...base, dataUrl: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ageFromDob(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 0 && age <= 120 ? String(age) : '';
}

function FileField({ labelText, required, value, onChange, accept = '.pdf,.jpg,.jpeg,.png' }) {
  return (
    <div>
      <label style={label}>{labelText}{required ? <span style={req}>*</span> : null}</label>
      <input
        type="file"
        accept={accept}
        style={{ ...input, padding: 10, fontSize: 14 }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) { onChange(null); return; }
          if (file.size > 10 * 1024 * 1024) {
            alert('Max file size is 10 MB');
            e.target.value = '';
            return;
          }
          const meta = await fileToMeta(file);
          onChange(meta);
        }}
      />
      {value?.name && (
        <div style={{ fontSize: 12, color: '#0d9488', marginTop: 6, wordBreak: 'break-all', lineHeight: 1.35 }}>
          ✓ {value.name} ({Math.round((value.size || 0) / 1024)} KB)
          {value.note ? ` — ${value.note}` : ''}
        </div>
      )}
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>PDF, JPG, PNG · Max 10 MB</div>
    </div>
  );
}

export default function PhlebotomistOnboarding() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [entryId, setEntryId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [f, setF] = useState(emptyForm);

  const update = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleJob = (job) => setF((p) => ({
    ...p,
    preferredJobs: p.preferredJobs.includes(job)
      ? p.preferredJobs.filter((j) => j !== job)
      : [...p.preferredJobs, job],
  }));

  useEffect(() => {
    if (!f.dob) return;
    const a = ageFromDob(f.dob);
    if (a) setF((p) => (p.age === a ? p : { ...p, age: a }));
  }, [f.dob]);

  useEffect(() => {
    if (!f.sameAsPresent) return;
    setF((p) => ({
      ...p,
      permanentHouse: p.presentHouse,
      permanentStreet: p.presentStreet,
      permanentArea: p.presentArea,
      permanentDistrict: p.presentDistrict,
      permanentState: p.presentState,
      permanentPincode: p.presentPincode,
    }));
  }, [
    f.sameAsPresent, f.presentHouse, f.presentStreet, f.presentArea,
    f.presentDistrict, f.presentState, f.presentPincode,
  ]);

  const canNext = () => {
    if (step === 2) {
      return f.fullName && f.dob && f.age && f.gender && f.maritalStatus
        && f.phone?.replace(/\D/g, '').length >= 10 && f.email?.includes('@');
    }
    if (step === 3) {
      return f.aadhaar?.replace(/\s/g, '').length >= 12 && f.education && f.workExperience?.trim();
    }
    if (step === 4) {
      return f.vacutainerMethod && f.preferredJobs.length > 0
        && f.preferredLocation?.trim() && f.preferredPincode?.trim()
        && f.drivingLicense?.trim() && f.ownsTwoWheeler && f.references?.trim();
    }
    if (step === 5) {
      const presentOk = f.presentHouse && f.presentStreet && f.presentArea
        && f.presentDistrict && f.presentState && f.presentPincode;
      const permOk = f.permanentHouse && f.permanentStreet && f.permanentArea
        && f.permanentDistrict && f.permanentState && f.permanentPincode;
      return presentOk && permOk;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');
    if (!f.agree) {
      setError('Please confirm the declaration to submit.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        applicationType: 'phlebotomist',
        fullName: f.fullName.trim(),
        name: f.fullName.trim(),
        dob: f.dob,
        age: f.age,
        gender: f.gender,
        maritalStatus: f.maritalStatus,
        phone: f.phone.replace(/\D/g, '').slice(0, 15),
        mobile: f.phone.replace(/\D/g, '').slice(0, 15),
        email: f.email.trim().toLowerCase(),
        aadhaar: f.aadhaar.replace(/\s/g, ''),
        aadhaarFile: f.aadhaarFile,
        education: f.education,
        qualification: f.education,
        certificateFile: f.certificateFile,
        paramedicalRegNo: f.paramedicalRegNo,
        regNumber: f.paramedicalRegNo,
        paramedicalCertFile: f.paramedicalCertFile,
        workExperience: f.workExperience,
        experience: f.workExperience,
        resumeFile: f.resumeFile,
        vacutainerMethod: f.vacutainerMethod,
        preferredJobs: f.preferredJobs,
        services: f.preferredJobs,
        preferredLocation: f.preferredLocation,
        workAreas: f.preferredLocation,
        preferredPincode: f.preferredPincode,
        workPincodes: f.preferredPincode,
        drivingLicense: f.drivingLicense,
        ownsTwoWheeler: f.ownsTwoWheeler,
        vehicleRegNo: f.vehicleRegNo,
        references: f.references,
        presentAddress: {
          house: f.presentHouse,
          street: f.presentStreet,
          area: f.presentArea,
          district: f.presentDistrict,
          state: f.presentState,
          pincode: f.presentPincode,
        },
        permanentAddress: {
          house: f.permanentHouse,
          street: f.permanentStreet,
          area: f.permanentArea,
          district: f.permanentDistrict,
          state: f.permanentState,
          pincode: f.permanentPincode,
        },
        address: [f.presentHouse, f.presentStreet, f.presentArea, f.presentDistrict, f.presentState, f.presentPincode].filter(Boolean).join(', '),
        city: f.presentArea || f.presentDistrict,
        state: f.presentState,
        pincode: f.presentPincode,
        feedback: f.feedback,
      };
      const { data } = await staffApplicationService.submitPhlebotomistApplication(payload);
      setEntryId(data.id || data.application?.id || '');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        err?.response?.data?.error
        || err?.response?.data?.message
        || err?.message
        || 'Could not submit application. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    setError('');
    if (step === 1 || canNext()) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Please fill all required fields on this step.');
    }
  };

  const goPrev = () => {
    setError('');
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0fdfa',
        padding: 16,
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      }}
      >
        <div style={{ ...card, textAlign: 'center', padding: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 8px', lineHeight: 1.6 }}>
            Thank you for applying as a Phlebotomist with Jeevan HealthCare at Home.
          </p>
          <p style={{ fontSize: 14, color: '#0d9488', fontWeight: 700, margin: '0 0 16px', wordBreak: 'break-all' }}>
            Reference: {entryId}
          </p>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
            Our team will review your application and contact you on your phone / email.
          </p>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20, lineHeight: 1.5 }}>
            📞 +91 97001 04108
            <br />
            📧 care@jeevanhealthcare.com
          </div>
          <Link to="/" style={{ ...btnPrimary, display: 'block', textDecoration: 'none', textAlign: 'center' }}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(180deg, #f0fdfa 0%, #f9fafb 40%)',
      padding: '12px 12px 0',
      paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
      boxSizing: 'border-box',
    }}
    >
      <style>{`
        @media (min-width: 640px) {
          .phlebo-hire-grid-2 { grid-template-columns: 1fr 1fr !important; }
          .phlebo-hire-card { padding: 28px !important; }
          .phlebo-hire-steps-desktop { display: flex !important; }
          .phlebo-hire-steps-mobile { display: none !important; }
        }
        @media (max-width: 639px) {
          .phlebo-hire-steps-desktop { display: none !important; }
          .phlebo-hire-steps-mobile { display: block !important; }
        }
      `}
      </style>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 4 }}>💉</div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.25 }}>
            Now Hiring: Phlebotomists
          </h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            Camps &amp; Home Sample Collection · Jeevan HealthCare
          </p>
        </div>

        {/* Mobile progress: bar + current step */}
        <div className="phlebo-hire-steps-mobile" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              {STEPS[step - 1]?.label}
            </span>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              Step {step} of {STEPS.length}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: '#0d9488',
              borderRadius: 999,
              transition: 'width 0.25s ease',
            }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 2 }}>
            {STEPS.map((s) => (
              <div
                key={s.num}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: step >= s.num ? '#0d9488' : '#e5e7eb',
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop step labels */}
        <div
          className="phlebo-hire-steps-desktop"
          style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 24, flexWrap: 'wrap' }}
        >
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700,
                background: step >= s.num ? '#0d9488' : '#e5e7eb',
                color: step >= s.num ? '#fff' : '#9ca3af',
              }}
              >
                {s.num}
              </div>
              <div style={{
                fontSize: 10, color: step === s.num ? '#0f172a' : '#9ca3af',
                fontWeight: step === s.num ? 600 : 400, marginLeft: 4, whiteSpace: 'nowrap',
              }}
              >
                {s.label}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 20, height: 2, background: step > s.num ? '#0d9488' : '#e5e7eb', margin: '0 6px' }} />
              )}
            </div>
          ))}
        </div>

        <div className="phlebo-hire-card" style={card}>
          {error && (
            <div style={{
              background: '#fef2f2', color: '#b91c1c', padding: 12, borderRadius: 10,
              fontSize: 13, marginBottom: 14, lineHeight: 1.4,
            }}
            >
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                Join Our Healthcare Team
              </h2>
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65, margin: '0 0 12px' }}>
                We&apos;re looking for skilled and reliable Phlebotomists to support medical camps and home sample collections.
              </p>
              <div style={{ fontSize: 13, color: '#374151', marginBottom: 16 }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Responsibilities include:</strong>
                {[
                  'Performing venipuncture and specimen collection',
                  'Traveling to patient locations and camps',
                  'Ensuring patient comfort and safety',
                  'Following hygiene and infection control protocols',
                  'Handling and transporting samples securely and on time',
                ].map((t) => (
                  <div key={t} style={{ padding: '6px 0', lineHeight: 1.4, display: 'flex', gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>✅</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f0fdfa', borderRadius: 10, padding: 14, fontSize: 13, color: '#0f766e', marginBottom: 8, lineHeight: 1.45 }}>
                📄 Keep ready: Aadhaar, education certificates, paramedical registration (if any), resume, driving license.
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>⏱️ About 5–8 minutes · * Required fields</p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 16px' }}>Personal details</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Full Name <span style={req}>*</span></label>
                  <input style={input} value={f.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="As per Aadhaar" autoComplete="name" />
                </div>
                <div className="phlebo-hire-grid-2" style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr' }}>
                  <div>
                    <label style={label}>Date of Birth <span style={req}>*</span></label>
                    <input style={input} type="date" value={f.dob} onChange={(e) => update('dob', e.target.value)} />
                  </div>
                  <div>
                    <label style={label}>Age <span style={req}>*</span></label>
                    <input style={input} type="number" min={18} max={70} value={f.age} onChange={(e) => update('age', e.target.value)} placeholder="Auto from DOB" inputMode="numeric" />
                  </div>
                </div>
                <div>
                  <label style={label}>Gender <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Male', 'Female'].map((g) => (
                      <button key={g} type="button" onClick={() => update('gender', g)} style={{ ...chip(f.gender === g), flex: '1 1 40%' }}>{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Marital Status <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Married', 'UN Married'].map((m) => (
                      <button key={m} type="button" onClick={() => update('maritalStatus', m)} style={{ ...chip(f.maritalStatus === m), flex: '1 1 40%' }}>{m}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Phone Number <span style={req}>*</span></label>
                  <input style={input} type="tel" inputMode="tel" value={f.phone} onChange={(e) => update('phone', e.target.value)} placeholder="10-digit mobile" autoComplete="tel" />
                </div>
                <div>
                  <label style={label}>E-Mail ID <span style={req}>*</span></label>
                  <input style={input} type="email" inputMode="email" value={f.email} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" autoComplete="email" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 16px' }}>Identity &amp; qualifications</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Aadhar Card Number <span style={req}>*</span></label>
                  <input
                    style={input}
                    inputMode="numeric"
                    value={f.aadhaar}
                    onChange={(e) => update('aadhaar', e.target.value.replace(/[^\d\s]/g, '').slice(0, 14))}
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
                <FileField labelText="Upload Aadhar Card" value={f.aadhaarFile} onChange={(v) => update('aadhaarFile', v)} />
                <div>
                  <label style={label}>Education Qualification <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {EDU_OPTIONS.map((e) => (
                      <button key={e} type="button" onClick={() => update('education', e)} style={{ ...chip(f.education === e), flex: '1 1 28%' }}>{e}</button>
                    ))}
                  </div>
                </div>
                <FileField labelText="Upload Certificates" value={f.certificateFile} onChange={(v) => update('certificateFile', v)} />
                <div>
                  <label style={label}>Paramedical Board Certificate Registration Number</label>
                  <input style={input} value={f.paramedicalRegNo} onChange={(e) => update('paramedicalRegNo', e.target.value)} placeholder="If applicable" />
                </div>
                <FileField labelText="Upload Paramedical Registration Certificate" value={f.paramedicalCertFile} onChange={(v) => update('paramedicalCertFile', v)} />
                <div>
                  <label style={label}>Work Experience <span style={req}>*</span></label>
                  <textarea
                    style={{ ...input, minHeight: 88, resize: 'vertical' }}
                    value={f.workExperience}
                    onChange={(e) => update('workExperience', e.target.value)}
                    placeholder="Years of experience, labs/hospitals worked, home collection if any"
                  />
                </div>
                <FileField labelText="Upload Resume or CV" value={f.resumeFile} onChange={(v) => update('resumeFile', v)} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 16px' }}>Skills &amp; job preference</h2>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={label}>Do you collect a sample by Vacutainer method? <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Yes', 'No'].map((v) => (
                      <button key={v} type="button" onClick={() => update('vacutainerMethod', v)} style={{ ...chip(f.vacutainerMethod === v), flex: 1 }}>{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Preferred Job <span style={req}>*</span></label>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>Select all that apply</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {JOB_OPTIONS.map((j) => (
                      <button key={j} type="button" onClick={() => toggleJob(j)} style={{ ...chip(f.preferredJobs.includes(j)), width: '100%', textAlign: 'left' }}>{j}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Preferred Job Location (Area) <span style={req}>*</span></label>
                  <input style={input} value={f.preferredLocation} onChange={(e) => update('preferredLocation', e.target.value)} placeholder="e.g. Madhapur, Kukatpally" />
                </div>
                <div>
                  <label style={label}>PIN Code <span style={req}>*</span></label>
                  <input style={input} inputMode="numeric" value={f.preferredPincode} onChange={(e) => update('preferredPincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Work area PIN" />
                </div>
                <div>
                  <label style={label}>Driving License Number <span style={req}>*</span></label>
                  <input style={input} value={f.drivingLicense} onChange={(e) => update('drivingLicense', e.target.value)} autoComplete="off" />
                </div>
                <div>
                  <label style={label}>Do you own a 2 wheeler <span style={req}>*</span></label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Yes', 'No'].map((v) => (
                      <button key={v} type="button" onClick={() => update('ownsTwoWheeler', v)} style={{ ...chip(f.ownsTwoWheeler === v), flex: 1 }}>{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={label}>Vehicle Registration Number</label>
                  <input style={input} value={f.vehicleRegNo} onChange={(e) => update('vehicleRegNo', e.target.value)} placeholder="If you own a 2-wheeler" />
                </div>
                <div>
                  <label style={label}>Reference 2 Members Name and Number <span style={req}>*</span></label>
                  <textarea
                    style={{ ...input, minHeight: 88, resize: 'vertical' }}
                    value={f.references}
                    onChange={(e) => update('references', e.target.value)}
                    placeholder={'1. Name — Phone\n2. Name — Phone'}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 16px' }}>Address for communication</h2>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0d9488', margin: '0 0 10px' }}>Present address</h3>
              <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={label}>House/Flat Number <span style={req}>*</span></label>
                  <input style={input} value={f.presentHouse} onChange={(e) => update('presentHouse', e.target.value)} />
                </div>
                <div>
                  <label style={label}>Street Number <span style={req}>*</span></label>
                  <input style={input} value={f.presentStreet} onChange={(e) => update('presentStreet', e.target.value)} />
                </div>
                <div>
                  <label style={label}>Area (Mandal or Ward) <span style={req}>*</span></label>
                  <input style={input} value={f.presentArea} onChange={(e) => update('presentArea', e.target.value)} />
                </div>
                <div>
                  <label style={label}>District <span style={req}>*</span></label>
                  <input style={input} value={f.presentDistrict} onChange={(e) => update('presentDistrict', e.target.value)} />
                </div>
                <div>
                  <label style={label}>State <span style={req}>*</span></label>
                  <input style={input} value={f.presentState} onChange={(e) => update('presentState', e.target.value)} />
                </div>
                <div>
                  <label style={label}>PIN Code <span style={req}>*</span></label>
                  <input style={input} inputMode="numeric" value={f.presentPincode} onChange={(e) => update('presentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                </div>
              </div>

              <div style={{
                display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12,
                padding: 12, background: '#f8fafc', borderRadius: 10,
              }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0d9488', margin: 0 }}>Permanent address</h3>
                <label style={{ fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minHeight: 44 }}>
                  <input
                    type="checkbox"
                    checked={f.sameAsPresent}
                    onChange={(e) => update('sameAsPresent', e.target.checked)}
                    style={{ width: 20, height: 20, flexShrink: 0 }}
                  />
                  Same as present address
                </label>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={label}>House/Flat Number <span style={req}>*</span></label>
                  <input style={input} value={f.permanentHouse} onChange={(e) => update('permanentHouse', e.target.value)} disabled={f.sameAsPresent} />
                </div>
                <div>
                  <label style={label}>Street Number <span style={req}>*</span></label>
                  <input style={input} value={f.permanentStreet} onChange={(e) => update('permanentStreet', e.target.value)} disabled={f.sameAsPresent} />
                </div>
                <div>
                  <label style={label}>Area (Mandal or Ward) <span style={req}>*</span></label>
                  <input style={input} value={f.permanentArea} onChange={(e) => update('permanentArea', e.target.value)} disabled={f.sameAsPresent} />
                </div>
                <div>
                  <label style={label}>District <span style={req}>*</span></label>
                  <input style={input} value={f.permanentDistrict} onChange={(e) => update('permanentDistrict', e.target.value)} disabled={f.sameAsPresent} />
                </div>
                <div>
                  <label style={label}>State <span style={req}>*</span></label>
                  <input style={input} value={f.permanentState} onChange={(e) => update('permanentState', e.target.value)} disabled={f.sameAsPresent} />
                </div>
                <div>
                  <label style={label}>PIN Code <span style={req}>*</span></label>
                  <input style={input} inputMode="numeric" value={f.permanentPincode} onChange={(e) => update('permanentPincode', e.target.value.replace(/\D/g, '').slice(0, 6))} disabled={f.sameAsPresent} />
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 16px' }}>Review &amp; submit</h2>
              <div style={{
                fontSize: 13, color: '#374151', lineHeight: 1.65, background: '#f8fafc',
                borderRadius: 10, padding: 14, marginBottom: 14, wordBreak: 'break-word',
              }}
              >
                <div><strong>Name:</strong> {f.fullName}</div>
                <div><strong>Phone:</strong> {f.phone}</div>
                <div><strong>Email:</strong> {f.email}</div>
                <div><strong>DOB / Age / Gender:</strong> {f.dob} · {f.age} yrs · {f.gender}</div>
                <div><strong>Marital:</strong> {f.maritalStatus}</div>
                <div><strong>Education:</strong> {f.education}</div>
                <div><strong>Vacutainer:</strong> {f.vacutainerMethod}</div>
                <div><strong>Jobs:</strong> {(f.preferredJobs || []).join(', ')}</div>
                <div><strong>Location:</strong> {f.preferredLocation} ({f.preferredPincode})</div>
                <div><strong>2-wheeler:</strong> {f.ownsTwoWheeler}{f.vehicleRegNo ? ` · ${f.vehicleRegNo}` : ''}</div>
                <div><strong>DL:</strong> {f.drivingLicense}</div>
                <div><strong>Present:</strong> {[f.presentHouse, f.presentStreet, f.presentArea, f.presentDistrict, f.presentState, f.presentPincode].filter(Boolean).join(', ')}</div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={label}>Feedback and Suggestions</label>
                <textarea
                  style={{ ...input, minHeight: 72, resize: 'vertical' }}
                  value={f.feedback}
                  onChange={(e) => update('feedback', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13,
                color: '#374151', cursor: 'pointer', lineHeight: 1.45,
                padding: 12, background: '#f0fdfa', borderRadius: 10,
              }}
              >
                <input
                  type="checkbox"
                  checked={f.agree}
                  onChange={(e) => update('agree', e.target.checked)}
                  style={{ marginTop: 2, width: 20, height: 20, flexShrink: 0 }}
                />
                <span>
                  I declare that the information provided is true to the best of my knowledge. I agree to follow Jeevan HealthCare service guidelines for camps and home sample collection.
                  <span style={req}>*</span>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Sticky mobile-friendly action bar */}
      <div style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '10px 12px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        boxShadow: '0 -4px 16px rgba(15,23,42,0.06)',
      }}
      >
        <button
          type="button"
          style={{ ...btnOutline, opacity: step <= 1 ? 0.4 : 1, flex: '0 0 auto', padding: '12px 14px' }}
          onClick={goPrev}
          disabled={step <= 1}
        >
          ← Back
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          {step}/{STEPS.length}
        </div>
        {step < 6 ? (
          <button
            type="button"
            style={{ ...btnPrimary, flex: '1 1 auto', maxWidth: 200, opacity: step === 1 || canNext() ? 1 : 0.7 }}
            onClick={goNext}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            style={{ ...btnPrimary, flex: '1 1 auto', maxWidth: 220, opacity: f.agree && !submitting ? 1 : 0.5 }}
            onClick={handleSubmit}
            disabled={!f.agree || submitting}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
