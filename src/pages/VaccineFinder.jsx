import { useState } from 'react';
import { Link } from 'react-router-dom';
import { vaccineFinderQuestions, vaccines } from '../data/vaccinationData';

export default function VaccineFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const currentQ = vaccineFinderQuestions[step];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQ.key]: value };
    setAnswers(newAnswers);
    if (step < vaccineFinderQuestions.length - 1) {
      setStep(step + 1);
    } else {
      const recommended = findVaccines(newAnswers);
      setResults(recommended);
    }
  };

  const handleMultiSelect = (value) => {
    const current = answers[currentQ.key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [currentQ.key]: updated });
  };

  const findVaccines = (ans) => {
    let filtered = [...vaccines];
    const personType = ans.personType;
    const ageRange = ans.ageRange;
    const conditions = ans.conditions || [];
    const prevStatus = ans.prevStatus;

    if (personType === 'child' && ageRange) {
      if (ageRange === '0-1') filtered = filtered.filter(v => v.category === 'baby');
      else if (ageRange === '1-5' || ageRange === '5-18') filtered = filtered.filter(v => v.category === 'baby' || v.category === 'child');
    } else if (personType === 'adult' || personType === 'senior') {
      if (personType === 'senior') filtered = filtered.filter(v => v.category === 'senior' || v.category === 'adult');
      else filtered = filtered.filter(v => v.category === 'adult' || v.category === 'women');
    } else if (personType === 'pregnant') {
      filtered = filtered.filter(v => v.slug === 'tdap-vaccine' || v.slug === 'flu-vaccine');
    }

    if (conditions && !conditions.includes('none')) {
      if (conditions.includes('diabetes') || conditions.includes('heart')) {
        const extras = vaccines.filter(v => v.slug === 'pneumococcal-adult-vaccine' || v.slug === 'flu-vaccine');
        filtered = [...filtered, ...extras];
      }
      if (conditions.includes('immunity')) {
        const extras = vaccines.filter(v => v.slug === 'pneumococcal-adult-vaccine' || v.slug === 'flu-vaccine');
        filtered = [...filtered, ...extras];
      }
    }

    filtered = filtered.filter((v, i, a) => a.indexOf(v) === i);
    return filtered.slice(0, 8);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  if (results) {
    return (
      <div className="page-section container" style={{ maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>✅</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>Recommended Vaccines</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Based on the information you provided</p>
        </div>
        <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
          {results.map(v => (
            <Link key={v.id} to={`/vaccination/${v.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💉</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{v.disease} · {v.doseCount} dose{v.doseCount > 1 ? 's' : ''} · ₹{v.price}/dose</div>
                </div>
                <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>View →</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>Start Over</button>
          <Link to="/vaccination/all-vaccines" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, textDecoration: 'none' }}>View All Vaccines</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: 560 }}>
      <Link to="/vaccination" style={{ color: '#64748b', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 8 }}>← Back to Vaccination</Link>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>🔍</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>Find My Vaccine</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Answer a few questions to find the right vaccine for you</p>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center' }}>
        {vaccineFinderQuestions.map((_, i) => (
          <div key={i} style={{ width: 40, height: 4, borderRadius: 2, background: i <= step ? '#2563eb' : '#e2e8f0' }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginBottom: 16 }}>Step {step + 1} of {vaccineFinderQuestions.length}</p>

      {/* Question */}
      <div style={{ padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{currentQ.question}</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {currentQ.options.map(opt => (
            <button key={opt.value} onClick={() => currentQ.multiple ? handleMultiSelect(opt.value) : handleAnswer(opt.value)}
              style={{ padding: '12px 16px', borderRadius: 10, border: answers[currentQ.key]?.includes?.(opt.value) || answers[currentQ.key] === opt.value
                ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: answers[currentQ.key]?.includes?.(opt.value) || answers[currentQ.key] === opt.value ? '#EFF6FF' : '#fff',
                cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8,
                color: '#0f172a', fontWeight: answers[currentQ.key]?.includes?.(opt.value) || answers[currentQ.key] === opt.value ? 700 : 400 }}>
              {opt.icon && <span style={{ fontSize: 20 }}>{opt.icon}</span>}
              {opt.label}
            </button>
          ))}
        </div>
        {currentQ.multiple && (
          <button onClick={() => handleAnswer(answers[currentQ.key] || [])} disabled={!answers[currentQ.key]?.length}
            style={{ marginTop: 12, padding: '10px 24px', borderRadius: 8, border: 'none', background: answers[currentQ.key]?.length ? '#2563eb' : '#94a3b8', color: '#fff', cursor: answers[currentQ.key]?.length ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%' }}>
            Continue →
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button onClick={() => step > 0 ? setStep(step - 1) : null} disabled={step === 0}
          style={{ padding: '6px 16px', borderRadius: 6, border: 'none', background: 'none', cursor: step > 0 ? 'pointer' : 'default', fontSize: 12, color: step > 0 ? '#2563eb' : '#ccc', fontFamily: 'inherit' }}>
          ← Back
        </button>
      </div>
    </div>
  );
}
