import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { submitPhlebotomistApplication } from '../services/phleboService.js';
import { isPhleboHostname } from '../utils/authRoles.js';
import { formatDeadlineIst, hoursRemaining } from '../utils/formatDeadline.js';
import './phlebo-hire.css';

const STEPS = ['Welcome', 'Personal', 'Skills', 'Address', 'Review'];
const JOB_OPTIONS = ['Home Sample Collection', 'Sitting Job', 'Camps'];
const EDU_OPTIONS = ['MLT', 'DMLT', 'BMLT', 'Other'];

const empty = () => ({
  fullName: '',
  dob: '',
  age: '',
  gender: '',
  maritalStatus: '',
  phone: '',
  email: '',
  aadhaar: '',
  education: '',
  workExperience: '',
  preferredJobs: [],
  preferredLocation: '',
  preferredPincode: '',
  drivingLicense: '',
  ownsTwoWheeler: '',
  vehicleRegNo: '',
  presentArea: '',
  presentDistrict: 'Hyderabad',
  presentState: 'Telangana',
  presentPincode: '',
  presentHouse: '',
  agree: false,
});

function ageFromDob(dob) {
  if (!dob) return '';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return String(age);
}

export default function PhlebotomistOnboarding() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const phleboHost = isPhleboHostname();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return (
          form.fullName.trim().length >= 2 &&
          form.phone.replace(/\D/g, '').length >= 10 &&
          form.email.trim().includes('@') &&
          form.gender &&
          form.education
        );
      case 2:
        return form.preferredJobs.length > 0 && form.preferredLocation.trim();
      case 3:
        return form.presentArea.trim() && form.presentPincode.trim().length >= 5;
      case 4:
        return form.agree;
      default:
        return false;
    }
  }, [step, form]);

  const toggleJob = (job) => {
    setForm((f) => {
      const has = f.preferredJobs.includes(job);
      return {
        ...f,
        preferredJobs: has ? f.preferredJobs.filter((j) => j !== job) : [...f.preferredJobs, job],
      };
    });
  };

  const onSubmit = async () => {
    if (!canNext) {
      setError('Please complete required fields and accept the declaration.');
      return;
    }
    setLoading(true);
    setError('');
    if (!form.email.trim().includes('@')) {
      setError('Email is required so we can send your competency assessment link.');
      return;
    }
    try {
      const data = await submitPhlebotomistApplication({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        dob: form.dob || null,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        maritalStatus: form.maritalStatus || null,
        education: form.education || null,
        aadhaar: form.aadhaar || null,
        preferredLocation: form.preferredLocation || form.presentArea,
        preferredPincode: form.preferredPincode || form.presentPincode,
        data: {
          preferredJobs: form.preferredJobs,
          workExperience: form.workExperience,
          drivingLicense: form.drivingLicense,
          ownsTwoWheeler: form.ownsTwoWheeler,
          vehicleRegNo: form.vehicleRegNo,
          presentAddress: {
            house: form.presentHouse,
            area: form.presentArea,
            district: form.presentDistrict,
            state: form.presentState,
            pincode: form.presentPincode,
          },
        },
        files: [],
      });
      setDone(data.application || data);
      setAssessment(data.assessment || null);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Could not submit application');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    const windowHours = assessment?.hours || 48;
    const deadline = formatDeadlineIst(assessment?.deadlineAt);
    const left = hoursRemaining(assessment?.deadlineAt);
    // Prefer absolute phlebo-host URL from API so apex hire form also lands on phlebo portal
    const assessUrl = assessment?.url || null;
    let assessPath = null;
    if (assessUrl) {
      try {
        const u = new URL(assessUrl);
        assessPath = u.pathname + (u.search || '');
      } catch {
        assessPath = null;
      }
    }
    return (
      <div className="ph-hire-page">
        <div className="ph-hire-card ph-hire-success">
          <div className="ph-hire-emoji" aria-hidden>
            ✅
          </div>
          <h1>Application received</h1>
          <p>
            Thank you, <strong>{done.fullName}</strong>. We saved your details
            {done.phone ? (
              <>
                {' '}
                for <strong>{done.phone}</strong>
              </>
            ) : null}
            .
          </p>
          <div className="ph-assess-next">
            <h2>Next step — competency assessment</h2>
            <p>
              You must complete the assessment to move to the next steps in hiring. You have{' '}
              <strong>{windowHours} hours from now</strong>
              {deadline ? (
                <>
                  {' '}
                  — complete by <strong>{deadline}</strong>
                  {left != null && left > 0 ? ` (about ${left} hours left)` : ''}
                </>
              ) : null}
              .
            </p>
            <p>
              <strong>Ready now?</strong> Start the test on this device. If you prefer later, use the
              link we email to <strong>{done.email || form.email}</strong> (check spam if needed). The
              same link will also be sent by SMS / WhatsApp once those channels are enabled.
            </p>
            <p className="muted">
              After you submit, our team will review and contact you. Do not share the assessment
              link with others.
            </p>
          </div>
          <div className="ph-hire-actions">
            {assessUrl || assessPath ? (
              phleboHost && assessPath ? (
                <Link to={assessPath} className="btn btn-primary">
                  Start assessment now
                </Link>
              ) : (
                <a href={assessUrl} className="btn btn-primary">
                  Start assessment now
                </a>
              )
            ) : null}
            {phleboHost ? (
              <Link to="/" className="btn btn-outline-dark">
                Do it later · Phlebo home
              </Link>
            ) : (
              <Link to="/" className="btn btn-outline-dark">
                Do it later · Home
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ph-hire-page">
      <div className="ph-hire-hero">
        <p className="ph-hire-eyebrow">Careers · Camps &amp; home collection</p>
        <h1>Phlebotomist hiring</h1>
        <p>Apply for home sample collection, camps, and lab desk roles with Jeevan HealthCare.</p>
      </div>

      <div className="ph-hire-card">
        <ol className="ph-hire-steps">
          {STEPS.map((label, i) => (
            <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''}>
              <span>{i + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="ph-hire-section">
            <h2>Welcome</h2>
            <p>
              We&apos;re hiring trained phlebotomists for Hyderabad home collections and camps.
              Complete this short form (about 5 minutes). Admin reviews applications and enables
              your phone OTP login on the phlebo portal.
            </p>
            <ul className="ph-hire-bullets">
              <li>MLT / DMLT / BMLT preferred</li>
              <li>Two-wheeler preferred for home routes</li>
              <li>Valid Aadhaar + mobile number required</li>
            </ul>
          </div>
        )}

        {step === 1 && (
          <div className="ph-hire-section">
            <h2>Personal details</h2>
            <label>
              Full name *
              <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
            </label>
            <div className="ph-row">
              <label>
                Phone *
                <input
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  maxLength={15}
                  inputMode="tel"
                />
              </label>
              <label>
                Email * <span className="ph-field-hint">(assessment link)</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
            </div>
            <div className="ph-row">
              <label>
                Date of birth
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => {
                    set('dob', e.target.value);
                    set('age', ageFromDob(e.target.value));
                  }}
                />
              </label>
              <label>
                Age
                <input value={form.age} onChange={(e) => set('age', e.target.value)} />
              </label>
            </div>
            <div className="ph-row">
              <label>
                Gender *
                <select value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Marital status
                <select
                  value={form.maritalStatus}
                  onChange={(e) => set('maritalStatus', e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>
              </label>
            </div>
            <label>
              Education / qualification *
              <select value={form.education} onChange={(e) => set('education', e.target.value)}>
                <option value="">Select</option>
                {EDU_OPTIONS.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </label>
            <label>
              Aadhaar (last 4 or full — stored securely)
              <input value={form.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="ph-hire-section">
            <h2>Skills &amp; preference</h2>
            <p className="muted">Preferred job types *</p>
            <div className="ph-chips">
              {JOB_OPTIONS.map((j) => (
                <button
                  key={j}
                  type="button"
                  className={form.preferredJobs.includes(j) ? 'chip on' : 'chip'}
                  onClick={() => toggleJob(j)}
                >
                  {j}
                </button>
              ))}
            </div>
            <label>
              Work experience
              <textarea
                rows={3}
                value={form.workExperience}
                onChange={(e) => set('workExperience', e.target.value)}
                placeholder="Years, previous labs, camps…"
              />
            </label>
            <label>
              Preferred work area / city *
              <input
                value={form.preferredLocation}
                onChange={(e) => set('preferredLocation', e.target.value)}
                placeholder="e.g. Gachibowli, Hyderabad"
              />
            </label>
            <label>
              Preferred pincode
              <input
                value={form.preferredPincode}
                onChange={(e) => set('preferredPincode', e.target.value)}
                maxLength={6}
              />
            </label>
            <div className="ph-row">
              <label>
                Driving license
                <input
                  value={form.drivingLicense}
                  onChange={(e) => set('drivingLicense', e.target.value)}
                />
              </label>
              <label>
                Own two-wheeler?
                <select
                  value={form.ownsTwoWheeler}
                  onChange={(e) => set('ownsTwoWheeler', e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
            </div>
            <label>
              Vehicle registration (optional)
              <input
                value={form.vehicleRegNo}
                onChange={(e) => set('vehicleRegNo', e.target.value)}
              />
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="ph-hire-section">
            <h2>Present address</h2>
            <label>
              House / flat
              <input value={form.presentHouse} onChange={(e) => set('presentHouse', e.target.value)} />
            </label>
            <label>
              Area / locality *
              <input value={form.presentArea} onChange={(e) => set('presentArea', e.target.value)} />
            </label>
            <div className="ph-row">
              <label>
                District
                <input
                  value={form.presentDistrict}
                  onChange={(e) => set('presentDistrict', e.target.value)}
                />
              </label>
              <label>
                State
                <input
                  value={form.presentState}
                  onChange={(e) => set('presentState', e.target.value)}
                />
              </label>
            </div>
            <label>
              Pincode *
              <input
                value={form.presentPincode}
                onChange={(e) => set('presentPincode', e.target.value)}
                maxLength={6}
              />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="ph-hire-section">
            <h2>Review &amp; submit</h2>
            <dl className="ph-review">
              <div>
                <dt>Name</dt>
                <dd>{form.fullName}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{form.phone}</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>{form.education}</dd>
              </div>
              <div>
                <dt>Jobs</dt>
                <dd>{form.preferredJobs.join(', ')}</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>
                  {form.preferredLocation || form.presentArea} · {form.presentPincode}
                </dd>
              </div>
            </dl>
            <label className="ph-agree">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => set('agree', e.target.checked)}
              />
              I confirm the details are true and I consent to Jeevan HealthCare contacting me about
              this application.
            </label>
          </div>
        )}

        {error && <div className="ph-hire-error">{error}</div>}

        <div className="ph-hire-nav">
          {step > 0 ? (
            <button type="button" className="btn btn-outline-dark" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canNext}
              onClick={() => {
                setError('');
                if (!canNext) {
                  setError('Please complete required fields.');
                  return;
                }
                setStep((s) => s + 1);
              }}
            >
              Continue
            </button>
          ) : (
            <button type="button" className="btn btn-accent" disabled={loading || !canNext} onClick={onSubmit}>
              {loading ? 'Submitting…' : 'Submit application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
