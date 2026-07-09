import { useState } from 'react';
import { idealWeightRange, dailyCalorie, diabetesRisk, boneHealthRisk, stressWellnessScore, calcBMI, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

const s = {
  label: { fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 },
  select: { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' },
  btnCalc: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%', marginBottom: 16 },
  btnSec: { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
  inputFull: { marginBottom: 10 },
  resultCard: { textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 16 },
  recsBox: { background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' },
};

export function IdealWeightCalc() {
  const [h, setH] = useState('');
  const [g, setG] = useState('male');
  const [calc, setCalc] = useState(false);
  const ideal = idealWeightRange(Number(h), g);
  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Height (cm)</label><input className="input" type="number" value={h} onChange={e => setH(e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Gender</label><select value={g} onChange={e => setG(e.target.value)} style={s.select}><option value="male">Male</option><option value="female">Female</option></select></div>
      </div>
      <button style={{ ...s.btnCalc, background: '#06B6D4' }} onClick={() => setCalc(true)} disabled={!h}>📏 Calculate Ideal Weight</button>
      {calc && ideal && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>IDEAL WEIGHT RANGE</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>{ideal.min} – {ideal.max} kg</div>
          </div>
          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, fontSize: 11, color: '#0c4a6e', lineHeight: 1.6 }}>
            💡 Maintaining a healthy weight reduces risk of diabetes, heart disease, and joint problems.
            Combine balanced nutrition with regular physical activity for best results.
          </div>
        </>
      )}
    </div>
  );
}

export function CalorieCalc() {
  const [f, setF] = useState({ age: '', gender: 'male', height: '', weight: '', activity: 'moderate' });
  const [calc, setCalc] = useState(false);
  const u = (k, v) => setF({ ...f, [k]: v });
  const cal = dailyCalorie(Number(f.age), f.gender, Number(f.height), Number(f.weight), f.activity);
  const navigate = useNavigate();
  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Age</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Gender</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={s.select}><option value="male">Male</option><option value="female">Female</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Height (cm)</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Weight (kg)</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>Activity Level</label>
        <select value={f.activity} onChange={e => u('activity', e.target.value)} style={s.select}>
          <option value="sedentary">Sedentary (desk job, little exercise)</option>
          <option value="light">Light (1–3 days/week)</option>
          <option value="moderate">Moderate (3–5 days/week)</option>
          <option value="active">Active (6–7 days/week)</option>
          <option value="veryActive">Very Active (daily + physical job)</option>
        </select>
      </div>
      <button style={{ ...s.btnCalc, background: '#F97316' }} onClick={() => setCalc(true)} disabled={!f.age || !f.height || !f.weight}>🔥 Calculate Daily Calories</button>
      {calc && cal && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#fff7ed', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>DAILY CALORIE NEED</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ea580c' }}>{cal.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>calories/day</div>
          </div>
          <button onClick={() => navigate('/package/weight-management-package')} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600 }}>
            📦 Weight Management Package
          </button>
        </>
      )}
    </div>
  );
}

export function DiabetesRiskCalc() {
  const [f, setF] = useState({ age: '', gender: 'male', height: '', weight: '', familyHistory: 'no', exercise: 'moderate', smoking: 'no', bloodPressure: 'normal', bloodSugar: '' });
  const [calculated, setCalculated] = useState(false);
  const u = (k, v) => setF({ ...f, [k]: v });
  const bmi = calcBMI(Number(f.height), Number(f.weight));
  const risk = diabetesRisk(Number(f.age), f.gender, Number(f.height), Number(f.weight), f.familyHistory, f.exercise, f.smoking, f.bloodPressure, Number(f.bloodSugar) || 0);
  const recs = getRecommendedTests('diabetes');
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const canCalc = f.age && f.height && f.weight;

  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Age</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Gender</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={s.select}><option value="male">Male</option><option value="female">Female</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Height (cm)</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Weight (kg)</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      {bmi && <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>BMI: {bmi}</div>}
      <div style={s.inputRow}>
        <div><label style={s.label}>Family History of Diabetes</label><select value={f.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={s.select}><option value="no">No</option><option value="yes">Yes</option></select></div>
        <div><label style={s.label}>Exercise Level</label><select value={f.exercise} onChange={e => u('exercise', e.target.value)} style={s.select}><option value="active">Active</option><option value="moderate">Moderate</option><option value="light">Light</option><option value="sedentary">Sedentary</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Smoking</label><select value={f.smoking} onChange={e => u('smoking', e.target.value)} style={s.select}><option value="no">No</option><option value="yes">Yes</option></select></div>
        <div><label style={s.label}>Blood Pressure</label><select value={f.bloodPressure} onChange={e => u('bloodPressure', e.target.value)} style={s.select}><option value="normal">Normal</option><option value="elevated">Elevated</option><option value="high">High</option></select></div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>Fasting Blood Sugar (mg/dL) — optional</label>
        <input className="input" type="number" value={f.bloodSugar} onChange={e => u('bloodSugar', e.target.value)} style={{ fontSize: 12 }} />
      </div>

      <button style={{ ...s.btnCalc, background: '#F59E0B' }} onClick={() => setCalculated(true)} disabled={!canCalc}>🩸 Calculate Diabetes Risk</button>

      {calculated && risk && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>DIABETES RISK</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Risk Score: {risk.score}/100</div>
          </div>

          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>💡 Lifestyle Suggestions</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#0c4a6e', lineHeight: 1.7 }}>
              <li>Maintain a balanced diet rich in fiber, whole grains, and lean proteins</li>
              <li>Aim for at least 30 minutes of physical activity daily</li>
              <li>Limit sugar-sweetened beverages and processed foods</li>
              <li>Monitor your weight and maintain a healthy BMI</li>
              <li>Get regular health check-ups including blood sugar screening</li>
            </ul>
          </div>

          {recs && recs.tests.length > 0 && (
            <div style={s.recsBox}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Tests</div>
              {recs.tests.map(t => <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>)}
              {recs.packages.map(p => (
                <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{ ...s.btnSec, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginTop: 8, fontWeight: 600, marginBottom: 6 }}>
                  📦 {p.name} — ₹{p.price}
                </button>
              ))}
              <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
                🛒 Book Tests (₹{recs.totalCost})
              </button>
              <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ Consult Doctor</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function BoneHealthCalc() {
  const [f, setF] = useState({ age: '', gender: 'female', height: '', weight: '', menopause: 'pre', fractures: 'no', familyHistory: 'no', vitaminD: 'sufficient', calcium: 'moderate', activity: 'moderate' });
  const [calculated, setCalculated] = useState(false);
  const u = (k, v) => setF({ ...f, [k]: v });
  const risk = boneHealthRisk(Number(f.age), f.gender, Number(f.weight), Number(f.height), f.fractures, f.familyHistory, f.menopause, f.vitaminD, f.calcium, f.activity);
  const recs = getRecommendedTests('bone');
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const canCalc = f.age && f.weight;

  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Age</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Gender</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={s.select}><option value="female">Female</option><option value="male">Male</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Height (cm)</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>Weight (kg)</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      {f.gender === 'female' && (
        <div style={s.inputFull}>
          <label style={s.label}>Menopause Status</label>
          <select value={f.menopause} onChange={e => u('menopause', e.target.value)} style={s.select}>
            <option value="pre">Pre-menopause</option>
            <option value="peri">Peri-menopause</option>
            <option value="post">Post-menopause</option>
          </select>
        </div>
      )}
      <div style={s.inputRow}>
        <div><label style={s.label}>Previous Fractures</label><select value={f.fractures} onChange={e => u('fractures', e.target.value)} style={s.select}><option value="no">No</option><option value="yes">Yes</option></select></div>
        <div><label style={s.label}>Family History of Osteoporosis</label><select value={f.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={s.select}><option value="no">No</option><option value="yes">Yes</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Vitamin D Status</label><select value={f.vitaminD} onChange={e => u('vitaminD', e.target.value)} style={s.select}><option value="sufficient">Sufficient</option><option value="insufficient">Insufficient</option><option value="deficient">Deficient</option></select></div>
        <div><label style={s.label}>Calcium Intake</label><select value={f.calcium} onChange={e => u('calcium', e.target.value)} style={s.select}><option value="high">High (dairy-rich diet)</option><option value="moderate">Moderate</option><option value="low">Low</option></select></div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>Physical Activity Level</label>
        <select value={f.activity} onChange={e => u('activity', e.target.value)} style={s.select}>
          <option value="active">Active (regular weight-bearing exercise)</option>
          <option value="moderate">Moderate</option>
          <option value="light">Light</option>
          <option value="sedentary">Sedentary</option>
        </select>
      </div>

      <button style={{ ...s.btnCalc, background: '#6366F1' }} onClick={() => setCalculated(true)} disabled={!canCalc}>🦴 Calculate Bone Health</button>

      {calculated && risk && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>BONE HEALTH RISK</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Risk Score: {risk.score}/100</div>
          </div>

          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>💡 Lifestyle Advice</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#0c4a6e', lineHeight: 1.7 }}>
              <li>Ensure adequate calcium intake (1000–1200 mg daily through diet or supplements)</li>
              <li>Maintain sufficient Vitamin D levels (sunlight exposure + supplements if needed)</li>
              <li>Include weight-bearing exercises like walking, jogging, or strength training</li>
              <li>Avoid smoking and limit alcohol consumption</li>
              <li>Consider bone density screening if at increased risk</li>
            </ul>
          </div>

          {recs && recs.tests.length > 0 && (
            <div style={s.recsBox}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Tests</div>
              {recs.tests.map(t => <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>)}
              {recs.packages.map(p => (
                <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{ ...s.btnSec, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginTop: 8, fontWeight: 600, marginBottom: 6 }}>
                  📦 {p.name} — ₹{p.price}
                </button>
              ))}
              <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
                🛒 Book Tests (₹{recs.totalCost})
              </button>
              <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ Consult Doctor</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function StressWellnessCalc() {
  const [f, setF] = useState({ sleep: 7, stress: 'moderate', exercise: 'weekly', workPattern: 'balanced' });
  const [calc, setCalc] = useState(false);
  const score = stressWellnessScore(f.sleep, f.stress, f.exercise, f.workPattern);
  const status = score >= 80 ? { label: 'Excellent', color: '#16a34a', icon: '🌟' } : score >= 60 ? { label: 'Good', color: '#F59E0B', icon: '👍' } : score >= 40 ? { label: 'Fair', color: '#F97316', icon: '⚠️' } : { label: 'Needs Attention', color: '#EF4444', icon: '🔴' };
  const u = (k, v) => setF({ ...f, [k]: v });

  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Sleep (hours)</label><input className="input" type="number" value={f.sleep} onChange={e => u('sleep', Number(e.target.value))} style={{ fontSize: 12 }} min="4" max="12" /></div>
        <div><label style={s.label}>Stress Level</label><select value={f.stress} onChange={e => u('stress', e.target.value)} style={s.select}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>Exercise</label><select value={f.exercise} onChange={e => u('exercise', e.target.value)} style={s.select}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="occasional">Occasional</option><option value="none">None</option></select></div>
        <div><label style={s.label}>Work Pattern</label><select value={f.workPattern} onChange={e => u('workPattern', e.target.value)} style={s.select}><option value="balanced">Balanced</option><option value="flexible">Flexible</option><option value="demanding">Demanding</option><option value="stressful">Stressful</option></select></div>
      </div>
      <button style={{ ...s.btnCalc, background: '#14B8A6' }} onClick={() => setCalc(true)}>🧠 Check Wellness</button>
      {calc && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f0f9ff', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>MENTAL WELLNESS SCORE</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: status.color }}>{score}/100</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: status.color }}>{status.icon} {status.label}</div>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, fontSize: 11, color: '#166534', lineHeight: 1.6 }}>
            💡 Tips to improve your wellness score: Prioritize 7–8 hours of sleep, practice daily meditation or deep breathing, incorporate physical activity into your routine, and maintain a healthy work-life balance. If you're experiencing persistent stress, consider speaking with a healthcare professional.
          </div>
        </>
      )}
    </div>
  );
}
