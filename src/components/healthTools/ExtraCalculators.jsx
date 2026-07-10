import { useState } from 'react';
import { idealWeightRange, dailyCalorie, diabetesRisk, boneHealthRisk, stressWellnessScore, calcBMI, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';

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
  const t = useT();
  const [h, setH] = useState('');
  const [g, setG] = useState('male');
  const [calc, setCalc] = useState(false);
  const ideal = idealWeightRange(Number(h), g);
  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('idealWeight.height', 'Height (cm)')}</label><input className="input" type="number" value={h} onChange={e => setH(e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('idealWeight.gender', 'Gender')}</label><select value={g} onChange={e => setG(e.target.value)} style={s.select}><option value="male">{t('idealWeight.male', 'Male')}</option><option value="female">{t('idealWeight.female', 'Female')}</option></select></div>
      </div>
      <button style={{ ...s.btnCalc, background: '#06B6D4' }} onClick={() => setCalc(true)} disabled={!h}>📏 {t('idealWeight.calculate', 'Calculate Ideal Weight')}</button>
      {calc && ideal && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f0fdf4', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{t('idealWeight.range', 'IDEAL WEIGHT RANGE')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>{ideal.min} – {ideal.max} kg</div>
          </div>
          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, fontSize: 11, color: '#0c4a6e', lineHeight: 1.6 }}>
            💡 {t('idealWeight.tip', 'Maintaining a healthy weight reduces risk of diabetes, heart disease, and joint problems. Combine balanced nutrition with regular physical activity for best results.')}
          </div>
        </>
      )}
    </div>
  );
}

export function CalorieCalc() {
  const t = useT();
  const [f, setF] = useState({ age: '', gender: 'male', height: '', weight: '', activity: 'moderate' });
  const [calc, setCalc] = useState(false);
  const u = (k, v) => setF({ ...f, [k]: v });
  const cal = dailyCalorie(Number(f.age), f.gender, Number(f.height), Number(f.weight), f.activity);
  const navigate = useNavigate();
  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('calorie.age', 'Age')}</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('calorie.gender', 'Gender')}</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={s.select}><option value="male">{t('calorie.male', 'Male')}</option><option value="female">{t('calorie.female', 'Female')}</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('calorie.height', 'Height (cm)')}</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('calorie.weight', 'Weight (kg)')}</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>{t('calorie.activityLevel', 'Activity Level')}</label>
        <select value={f.activity} onChange={e => u('activity', e.target.value)} style={s.select}>
          <option value="sedentary">{t('calorie.sedentary', 'Sedentary (desk job, little exercise)')}</option>
          <option value="light">{t('calorie.light', 'Light (1–3 days/week)')}</option>
          <option value="moderate">{t('calorie.moderate', 'Moderate (3–5 days/week)')}</option>
          <option value="active">{t('calorie.active', 'Active (6–7 days/week)')}</option>
          <option value="veryActive">{t('calorie.veryActive', 'Very Active (daily + physical job)')}</option>
        </select>
      </div>
      <button style={{ ...s.btnCalc, background: '#F97316' }} onClick={() => setCalc(true)} disabled={!f.age || !f.height || !f.weight}>🔥 {t('calorie.calculate', 'Calculate Daily Calories')}</button>
      {calc && cal && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#fff7ed', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{t('calorie.dailyNeed', 'DAILY CALORIE NEED')}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ea580c' }}>{cal.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{t('calorie.calPerDay', 'calories/day')}</div>
          </div>
          <button onClick={() => navigate('/package/weight-management-package')} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600 }}>
            📦 {t('calorie.weightMgmtPackage', 'Weight Management Package')}
          </button>
        </>
      )}
    </div>
  );
}

export function DiabetesRiskCalc() {
  const t = useT();
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
        <div><label style={s.label}>{t('diabetes.age', 'Age')}</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('diabetes.gender', 'Gender')}</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={s.select}><option value="male">{t('diabetes.male', 'Male')}</option><option value="female">{t('diabetes.female', 'Female')}</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('diabetes.height', 'Height (cm)')}</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('diabetes.weight', 'Weight (kg)')}</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      {bmi && <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>BMI: {bmi}</div>}
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('diabetes.familyHistory', 'Family History of Diabetes')}</label><select value={f.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={s.select}><option value="no">{t('diabetes.no', 'No')}</option><option value="yes">{t('diabetes.yes', 'Yes')}</option></select></div>
        <div><label style={s.label}>{t('diabetes.exerciseLevel', 'Exercise Level')}</label><select value={f.exercise} onChange={e => u('exercise', e.target.value)} style={s.select}><option value="active">{t('diabetes.active', 'Active')}</option><option value="moderate">{t('diabetes.moderate', 'Moderate')}</option><option value="light">{t('diabetes.light', 'Light')}</option><option value="sedentary">{t('diabetes.sedentary', 'Sedentary')}</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('diabetes.smoking', 'Smoking')}</label><select value={f.smoking} onChange={e => u('smoking', e.target.value)} style={s.select}><option value="no">{t('diabetes.no', 'No')}</option><option value="yes">{t('diabetes.yes', 'Yes')}</option></select></div>
        <div><label style={s.label}>{t('diabetes.bloodPressure', 'Blood Pressure')}</label><select value={f.bloodPressure} onChange={e => u('bloodPressure', e.target.value)} style={s.select}><option value="normal">{t('diabetes.normal', 'Normal')}</option><option value="elevated">{t('diabetes.elevated', 'Elevated')}</option><option value="high">{t('diabetes.high', 'High')}</option></select></div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>{t('diabetes.fastingSugar', 'Fasting Blood Sugar (mg/dL) — optional')}</label>
        <input className="input" type="number" value={f.bloodSugar} onChange={e => u('bloodSugar', e.target.value)} style={{ fontSize: 12 }} />
      </div>

      <button style={{ ...s.btnCalc, background: '#F59E0B' }} onClick={() => setCalculated(true)} disabled={!canCalc}>🩸 {t('diabetes.calculate', 'Calculate Diabetes Risk')}</button>

      {calculated && risk && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{t('diabetes.riskTitle', 'DIABETES RISK')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{t('diabetes.riskScore', 'Risk Score')}: {risk.score}/100</div>
          </div>

          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>💡 {t('diabetes.lifestyleSuggestions', 'Lifestyle Suggestions')}</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#0c4a6e', lineHeight: 1.7 }}>
              <li>{t('diabetes.suggestion1', 'Maintain a balanced diet rich in fiber, whole grains, and lean proteins')}</li>
              <li>{t('diabetes.suggestion2', 'Aim for at least 30 minutes of physical activity daily')}</li>
              <li>{t('diabetes.suggestion3', 'Limit sugar-sweetened beverages and processed foods')}</li>
              <li>{t('diabetes.suggestion4', 'Monitor your weight and maintain a healthy BMI')}</li>
              <li>{t('diabetes.suggestion5', 'Get regular health check-ups including blood sugar screening')}</li>
            </ul>
          </div>

          {recs && recs.tests.length > 0 && (
            <div style={s.recsBox}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 {t('diabetes.recommendedTests', 'Recommended Tests')}</div>
              {recs.tests.map(t => <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>)}
              {recs.packages.map(p => (
                <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{ ...s.btnSec, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginTop: 8, fontWeight: 600, marginBottom: 6 }}>
                  📦 {p.name} — ₹{p.price}
                </button>
              ))}
              <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
                🛒 {t('diabetes.bookTests', 'Book Tests')} (₹{recs.totalCost})
              </button>
              <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ {t('diabetes.consultDoctor', 'Consult Doctor')}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function BoneHealthCalc() {
  const t = useT();
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
        <div><label style={s.label}>{t('bone.age', 'Age')}</label><input className="input" type="number" value={f.age} onChange={e => u('age', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('bone.gender', 'Gender')}</label><select value={f.gender} onChange={e => u('gender', e.target.value)} style={s.select}><option value="female">{t('bone.female', 'Female')}</option><option value="male">{t('bone.male', 'Male')}</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('bone.height', 'Height (cm)')}</label><input className="input" type="number" value={f.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} /></div>
        <div><label style={s.label}>{t('bone.weight', 'Weight (kg)')}</label><input className="input" type="number" value={f.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} /></div>
      </div>
      {f.gender === 'female' && (
        <div style={s.inputFull}>
          <label style={s.label}>{t('bone.menopauseStatus', 'Menopause Status')}</label>
          <select value={f.menopause} onChange={e => u('menopause', e.target.value)} style={s.select}>
            <option value="pre">{t('bone.preMenopause', 'Pre-menopause')}</option>
            <option value="peri">{t('bone.periMenopause', 'Peri-menopause')}</option>
            <option value="post">{t('bone.postMenopause', 'Post-menopause')}</option>
          </select>
        </div>
      )}
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('bone.previousFractures', 'Previous Fractures')}</label><select value={f.fractures} onChange={e => u('fractures', e.target.value)} style={s.select}><option value="no">{t('bone.no', 'No')}</option><option value="yes">{t('bone.yes', 'Yes')}</option></select></div>
        <div><label style={s.label}>{t('bone.osteoporosisHistory', 'Family History of Osteoporosis')}</label><select value={f.familyHistory} onChange={e => u('familyHistory', e.target.value)} style={s.select}><option value="no">{t('bone.no', 'No')}</option><option value="yes">{t('bone.yes', 'Yes')}</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('bone.vitaminD', 'Vitamin D Status')}</label><select value={f.vitaminD} onChange={e => u('vitaminD', e.target.value)} style={s.select}><option value="sufficient">{t('bone.sufficient', 'Sufficient')}</option><option value="insufficient">{t('bone.insufficient', 'Insufficient')}</option><option value="deficient">{t('bone.deficient', 'Deficient')}</option></select></div>
        <div><label style={s.label}>{t('bone.calciumIntake', 'Calcium Intake')}</label><select value={f.calcium} onChange={e => u('calcium', e.target.value)} style={s.select}><option value="high">{t('bone.highCalcium', 'High (dairy-rich diet)')}</option><option value="moderate">{t('bone.moderate', 'Moderate')}</option><option value="low">{t('bone.low', 'Low')}</option></select></div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>{t('bone.physicalActivity', 'Physical Activity Level')}</label>
        <select value={f.activity} onChange={e => u('activity', e.target.value)} style={s.select}>
          <option value="active">{t('bone.activeActivity', 'Active (regular weight-bearing exercise)')}</option>
          <option value="moderate">{t('bone.moderate', 'Moderate')}</option>
          <option value="light">{t('bone.light', 'Light')}</option>
          <option value="sedentary">{t('bone.sedentary', 'Sedentary')}</option>
        </select>
      </div>

      <button style={{ ...s.btnCalc, background: '#6366F1' }} onClick={() => setCalculated(true)} disabled={!canCalc}>🦴 {t('bone.calculate', 'Calculate Bone Health')}</button>

      {calculated && risk && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{t('bone.riskTitle', 'BONE HEALTH RISK')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: risk.color }}>{risk.icon} {risk.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{t('bone.riskScore', 'Risk Score')}: {risk.score}/100</div>
          </div>

          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 4 }}>💡 {t('bone.lifestyleAdvice', 'Lifestyle Advice')}</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#0c4a6e', lineHeight: 1.7 }}>
              <li>{t('bone.advice1', 'Ensure adequate calcium intake (1000–1200 mg daily through diet or supplements)')}</li>
              <li>{t('bone.advice2', 'Maintain sufficient Vitamin D levels (sunlight exposure + supplements if needed)')}</li>
              <li>{t('bone.advice3', 'Include weight-bearing exercises like walking, jogging, or strength training')}</li>
              <li>{t('bone.advice4', 'Avoid smoking and limit alcohol consumption')}</li>
              <li>{t('bone.advice5', 'Consider bone density screening if at increased risk')}</li>
            </ul>
          </div>

          {recs && recs.tests.length > 0 && (
            <div style={s.recsBox}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 {t('bone.recommendedTests', 'Recommended Tests')}</div>
              {recs.tests.map(t => <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>)}
              {recs.packages.map(p => (
                <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{ ...s.btnSec, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginTop: 8, fontWeight: 600, marginBottom: 6 }}>
                  📦 {p.name} — ₹{p.price}
                </button>
              ))}
              <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
                🛒 {t('bone.bookTests', 'Book Tests')} (₹{recs.totalCost})
              </button>
              <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ {t('bone.consultDoctor', 'Consult Doctor')}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function StressWellnessCalc() {
  const t = useT();
  const [f, setF] = useState({ sleep: 7, stress: 'moderate', exercise: 'weekly', workPattern: 'balanced' });
  const [calc, setCalc] = useState(false);
  const score = stressWellnessScore(f.sleep, f.stress, f.exercise, f.workPattern);
  const status = score >= 80 ? { label: 'Excellent', color: '#16a34a', icon: '🌟' } : score >= 60 ? { label: 'Good', color: '#F59E0B', icon: '👍' } : score >= 40 ? { label: 'Fair', color: '#F97316', icon: '⚠️' } : { label: 'Needs Attention', color: '#EF4444', icon: '🔴' };
  const u = (k, v) => setF({ ...f, [k]: v });

  return (
    <div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('wellness.sleep', 'Sleep (hours)')}</label><input className="input" type="number" value={f.sleep} onChange={e => u('sleep', Number(e.target.value))} style={{ fontSize: 12 }} min="4" max="12" /></div>
        <div><label style={s.label}>{t('wellness.stressLevel', 'Stress Level')}</label><select value={f.stress} onChange={e => u('stress', e.target.value)} style={s.select}><option value="low">{t('wellness.low', 'Low')}</option><option value="moderate">{t('wellness.moderate', 'Moderate')}</option><option value="high">{t('wellness.high', 'High')}</option></select></div>
      </div>
      <div style={s.inputRow}>
        <div><label style={s.label}>{t('wellness.exercise', 'Exercise')}</label><select value={f.exercise} onChange={e => u('exercise', e.target.value)} style={s.select}><option value="daily">{t('wellness.daily', 'Daily')}</option><option value="weekly">{t('wellness.weekly', 'Weekly')}</option><option value="occasional">{t('wellness.occasional', 'Occasional')}</option><option value="none">{t('wellness.none', 'None')}</option></select></div>
        <div><label style={s.label}>{t('wellness.workPattern', 'Work Pattern')}</label><select value={f.workPattern} onChange={e => u('workPattern', e.target.value)} style={s.select}><option value="balanced">{t('wellness.balanced', 'Balanced')}</option><option value="flexible">{t('wellness.flexible', 'Flexible')}</option><option value="demanding">{t('wellness.demanding', 'Demanding')}</option><option value="stressful">{t('wellness.stressful', 'Stressful')}</option></select></div>
      </div>
      <button style={{ ...s.btnCalc, background: '#14B8A6' }} onClick={() => setCalc(true)}>🧠 {t('wellness.checkWellness', 'Check Wellness')}</button>
      {calc && (
        <>
          <div style={{ textAlign: 'center', padding: 16, background: '#f0f9ff', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{t('wellness.mentalWellnessScore', 'MENTAL WELLNESS SCORE')}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: status.color }}>{score}/100</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: status.color }}>{status.icon} {status.label}</div>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, fontSize: 11, color: '#166534', lineHeight: 1.6 }}>
            💡 {t('wellness.tips', 'Tips to improve your wellness score: Prioritize 7–8 hours of sleep, practice daily meditation or deep breathing, incorporate physical activity into your routine, and maintain a healthy work-life balance. If you\'re experiencing persistent stress, consider speaking with a healthcare professional.')}
          </div>
        </>
      )}
    </div>
  );
}
