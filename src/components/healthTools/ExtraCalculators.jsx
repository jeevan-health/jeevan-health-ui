import { useState } from 'react';
import { idealWeightRange, dailyCalorie, diabetesRisk, boneHealthRisk, stressWellnessScore, calcBMI, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

const btnStyle = { padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' };
const selectStyle = { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' };

export function IdealWeightCalc() {
  const [h, setH] = useState(''); const [g, setG] = useState('male');
  const ideal = idealWeightRange(Number(h), g);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Height (cm)</label><input className="input" type="number" value={h} onChange={e => setH(e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Gender</label><select value={g} onChange={e => setG(e.target.value)} style={selectStyle}><option value="male">Male</option><option value="female">Female</option></select></div>
      </div>
      {ideal && (
        <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>IDEAL WEIGHT RANGE</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>{ideal.min} – {ideal.max} kg</div>
        </div>
      )}
      <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, fontSize: 11, color: '#0c4a6e', lineHeight: 1.6 }}>
        💡 Maintaining a healthy weight reduces risk of diabetes, heart disease, and joint problems.
        Combine balanced nutrition with regular physical activity for best results.
      </div>
    </div>
  );
}

export function CalorieCalc() {
  const [f, setF] = useState({ age: '', gender: 'male', height: '', weight: '', activity: 'moderate' });
  const u = (k, v) => setF({ ...f, [k]: v });
  const cal = dailyCalorie(Number(f.age), f.gender, Number(f.height), Number(f.weight), f.activity);
  const navigate = useNavigate();
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Age</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Gender</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={selectStyle}><option value="male">Male</option><option value="female">Female</option></select></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Height (cm)</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Weight (kg)</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Activity Level</label>
        <select value={f.activity} onChange={e => u('activity', e.target.value)} style={selectStyle}>
          <option value="sedentary">Sedentary (desk job, little exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="veryActive">Very Active (daily + physical job)</option>
        </select>
      </div>
      {cal && (
        <div style={{ textAlign: 'center', padding: 16, background: '#fff7ed', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>DAILY CALORIE NEED</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#ea580c' }}>{cal.toLocaleString()}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>calories/day</div>
        </div>
      )}
      <button onClick={() => navigate('/package/weight-management-package')} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600 }}>
        📦 Weight Management Package
      </button>
    </div>
  );
}

export function DiabetesRiskCalc() {
  const [f, setF] = useState({ age: '', bmi: '', familyHistory: 'no', exercise: 'moderate', bloodSugar: '' });
  const u = (k, v) => setF({ ...f, [k]: v });
  const risk = (f.age && f.bmi) ? diabetesRisk(Number(f.age), Number(f.bmi), f.familyHistory, f.exercise, Number(f.bloodSugar) || 0) : null;
  const recs = getRecommendedTests('diabetes');
  const addItem = useCartStore(s => s.addItem);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Age</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>BMI</label><input className="input" type="number" value={f.bmi} onChange={e => u('bmi', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Family History of Diabetes</label><select value={f.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={selectStyle}><option value="no">No</option><option value="yes">Yes</option></select></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Exercise Level</label><select value={f.exercise} onChange={e => u('exercise', e.target.value)} style={selectStyle}><option value="active">Active</option><option value="moderate">Moderate</option><option value="light">Light</option><option value="sedentary">Sedentary</option></select></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Fasting Blood Sugar (mg/dL) — optional</label>
        <input className="input" type="number" value={f.bloodSugar} onChange={e => u('bloodSugar', e.target.value)} style={{ fontSize: 12 }} />
      </div>
      {risk && (
        <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>DIABETES RISK</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Risk Score: {risk.score}/100</div>
        </div>
      )}
      {recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Tests</div>
          {recs.tests.map(t => <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>)}
          {recs.packages.map(p => (
            <button key={p.name} onClick={() => {/* navigate to package */}} style={{ ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginTop: 8, fontWeight: 600 }}>
              📦 {p.name} — ₹{p.price}
            </button>
          ))}
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginTop: 6 }}>
            🛒 Book Tests (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}

export function BoneHealthCalc() {
  const [f, setF] = useState({ age: '', gender: 'female', weight: '', fractures: 'no', familyHistory: 'no' });
  const u = (k, v) => setF({ ...f, [k]: v });
  const risk = (f.age && f.weight) ? boneHealthRisk(Number(f.age), f.gender, Number(f.weight), f.fractures, f.familyHistory) : null;
  const recs = getRecommendedTests('bone');
  const addItem = useCartStore(s => s.addItem);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Age</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Gender</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={selectStyle}><option value="female">Female</option><option value="male">Male</option></select></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Weight (kg)</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Previous Fractures</label><select value={f.fractures} onChange={e => u('fractures', e.target.value)} style={selectStyle}><option value="no">No</option><option value="yes">Yes</option></select></div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Family History of Osteoporosis</label>
        <select value={f.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={selectStyle}><option value="no">No</option><option value="yes">Yes</option></select>
      </div>
      {risk && (
        <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>BONE HEALTH RISK</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Risk Score: {risk.score}/100</div>
        </div>
      )}
      {recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Tests</div>
          {recs.tests.map(t => <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>)}
          {recs.packages.map(p => (
            <button key={p.name} style={{ ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginTop: 8, fontWeight: 600 }}>
              📦 {p.name} — ₹{p.price}
            </button>
          ))}
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginTop: 6 }}>
            🛒 Book Tests (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}

export function StressWellnessCalc() {
  const [f, setF] = useState({ sleep: 7, stress: 'moderate', exercise: 'weekly', workPattern: 'balanced' });
  const score = stressWellnessScore(f.sleep, f.stress, f.exercise, f.workPattern);
  const status = score >= 80 ? { label: 'Excellent', color: '#16a34a', icon: '🌟' } : score >= 60 ? { label: 'Good', color: '#F59E0B', icon: '👍' } : score >= 40 ? { label: 'Fair', color: '#F97316', icon: '⚠️' } : { label: 'Needs Attention', color: '#EF4444', icon: '🔴' };

  const u = (k, v) => setF({ ...f, [k]: v });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Sleep (hours)</label><input className="input" type="number" value={f.sleep} onChange={e => u('sleep', Number(e.target.value))} style={{ fontSize: 12 }} min="4" max="12" /></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Stress Level</label><select value={f.stress} onChange={e => u('stress', e.target.value)} style={selectStyle}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option></select></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Exercise</label><select value={f.exercise} onChange={e => u('exercise', e.target.value)} style={selectStyle}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="occasional">Occasional</option><option value="none">None</option></select></div>
        <div><label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Work Pattern</label><select value={f.workPattern} onChange={e => u('workPattern', e.target.value)} style={selectStyle}><option value="balanced">Balanced</option><option value="flexible">Flexible</option><option value="demanding">Demanding</option><option value="stressful">Stressful</option></select></div>
      </div>
      <div style={{ textAlign: 'center', padding: 16, background: '#f0f9ff', borderRadius: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>MENTAL WELLNESS SCORE</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: status.color }}>{score}/100</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: status.color }}>{status.icon} {status.label}</div>
      </div>
      <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, fontSize: 11, color: '#166534', lineHeight: 1.6 }}>
        💡 Tips to improve your wellness score: Prioritize 7–8 hours of sleep, practice daily meditation or deep breathing, incorporate physical activity into your routine, and maintain a healthy work-life balance. If you're experiencing persistent stress, consider speaking with a healthcare professional.
      </div>
    </div>
  );
}
