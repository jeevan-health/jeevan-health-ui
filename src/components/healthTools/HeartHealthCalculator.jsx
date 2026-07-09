import { useState } from 'react';
import { heartRiskScore, calcBMI, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

export default function HeartHealthCalculator() {
  const [form, setForm] = useState({ age: '', gender: 'male', height: '', weight: '', systolicBp: '', smoking: 'no', alcohol: 'no', diabetes: 'no', cholesterol: 'normal', exercise: 'moderate', familyHistory: 'no' });
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const u = (k, v) => setForm({ ...form, [k]: v });
  const h = Number(form.height), w = Number(form.weight);
  const bmi = calcBMI(h, w);
  const result = form.age ? heartRiskScore(Number(form.age), form.gender, h, w, Number(form.systolicBp), form.smoking, form.alcohol, form.diabetes, form.cholesterol, form.exercise, form.familyHistory) : null;
  const recs = getRecommendedTests('heart');

  const btnStyle = { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' };
  const selectStyle = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' };

  const fields = [
    { cols: 2, items: [
      { label: 'Age', node: <input className="input" type="number" value={form.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /> },
      { label: 'Gender', node: <select value={form.gender} onChange={e => u('gender', e.target.value)} style={selectStyle}><option value="male">Male</option><option value="female">Female</option></select> },
    ]},
    { cols: 2, items: [
      { label: 'Height (cm)', node: <input className="input" type="number" value={form.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /> },
      { label: 'Weight (kg)', node: <input className="input" type="number" value={form.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /> },
    ]},
    { cols: 2, items: [
      { label: 'Systolic BP', node: <input className="input" type="number" value={form.systolicBp} onChange={e => u('systolicBp', e.target.value)} style={{ fontSize: 12 }} /> },
      { label: 'Smoking', node: <select value={form.smoking} onChange={e => u('smoking', e.target.value)} style={selectStyle}><option value="no">No</option><option value="former">Former</option><option value="yes">Yes</option></select> },
    ]},
    { cols: 2, items: [
      { label: 'Alcohol', node: <select value={form.alcohol} onChange={e => u('alcohol', e.target.value)} style={selectStyle}><option value="no">No</option><option value="occasional">Occasional</option><option value="daily">Daily</option></select> },
      { label: 'Diabetes', node: <select value={form.diabetes} onChange={e => u('diabetes', e.target.value)} style={selectStyle}><option value="no">No</option><option value="borderline">Borderline</option><option value="yes">Yes</option></select> },
    ]},
    { cols: 2, items: [
      { label: 'Cholesterol', node: <select value={form.cholesterol} onChange={e => u('cholesterol', e.target.value)} style={selectStyle}><option value="normal">Normal</option><option value="borderline">Borderline</option><option value="high">High</option></select> },
      { label: 'Exercise', node: <select value={form.exercise} onChange={e => u('exercise', e.target.value)} style={selectStyle}><option value="active">Active</option><option value="moderate">Moderate</option><option value="light">Light</option><option value="sedentary">Sedentary</option></select> },
    ]},
    { cols: 1, items: [
      { label: 'Family History of Heart Disease', node: <select value={form.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={selectStyle}><option value="no">No</option><option value="yes">Yes</option></select> },
    ]},
  ];

  return (
    <div>
      {fields.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${row.cols}, 1fr)`, gap: 10, marginBottom: 10 }}>
          {row.items.map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 10, color: '#64748b', display: 'block', marginBottom: 2, fontWeight: 600 }}>{f.label}</label>
              {f.node}
            </div>
          ))}
        </div>
      ))}

      {result && (
        <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>HEART HEALTH SCORE</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: result.category.color }}>{result.score}<span style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8' }}>/{result.max}</span></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: result.category.color }}>{result.category.icon} {result.category.label}</div>
          {bmi && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>BMI: {bmi}</div>}
        </div>
      )}

      {result && result.score < 60 && (
        <div style={{ background: '#fef2f2', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #fecaca' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>⚠️ Preventive Care Recommended</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#7f1d1d', lineHeight: 1.7 }}>
            <li>Schedule a cardiac evaluation with your healthcare provider</li>
            <li>Monitor blood pressure and cholesterol regularly</li>
            <li>Aim for 30 mins of moderate exercise daily</li>
            <li>Maintain a heart-healthy diet low in saturated fats</li>
            <li>Avoid smoking and limit alcohol consumption</li>
          </ul>
        </div>
      )}

      {result && result.score >= 60 && (
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', marginBottom: 4 }}>✅ Keep It Up!</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#166534', lineHeight: 1.7 }}>
            <li>Continue regular exercise and balanced diet</li>
            <li>Get annual health check-ups</li>
            <li>Maintain healthy sleep and stress levels</li>
          </ul>
        </div>
      )}

      {recs && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Tests</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ fontSize: 12, color: '#334155' }}>✔ {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span></div>
            ))}
          </div>
          {recs.packages.map(p => (
            <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{ ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginBottom: 6, fontWeight: 600 }}>
              📦 {p.name} — ₹{p.price}
            </button>
          ))}
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600 }}>
            🛒 Book Tests (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}
