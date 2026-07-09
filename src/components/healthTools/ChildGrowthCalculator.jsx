import { useState } from 'react';
import { childPercentile, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';

const s = {
  label: { fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 },
  btnCalc: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#10B981', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%', marginBottom: 16 },
  btnSec: { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' },
  select: { width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
  inputRow3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 },
  inputFull: { marginBottom: 10 },
};

export default function ChildGrowthCalculator() {
  const [form, setForm] = useState({ name: '', gender: 'boy', dob: '', height: '', weight: '', headCircumference: '' });
  const [calculated, setCalculated] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const u = (k, v) => setForm({ ...form, [k]: v });

  const ageMonths = form.dob ? Math.floor((new Date() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 30.44)) : null;
  const result = (ageMonths !== null && form.height && form.weight) ? childPercentile(Number(form.height), Number(form.weight), ageMonths) : null;
  const recs = getRecommendedTests('child');

  const years = ageMonths !== null ? Math.floor(ageMonths / 12) : null;
  const months = ageMonths !== null ? ageMonths % 12 : null;

  const growthStatus = () => {
    if (!result) return null;
    if (result.heightPct && (result.heightPct < 50 || result.heightPct > 150)) return { label: 'Needs Monitoring', color: '#F59E0B', icon: '🟡' };
    if (result.bmi && (result.bmi < 14 || result.bmi > 20)) return { label: 'Needs Monitoring', color: '#F59E0B', icon: '🟡' };
    return { label: 'Healthy Growth', color: '#16A34A', icon: '🟢' };
  };

  const canCalc = form.dob && form.height && form.weight;

  return (
    <div>
      <div style={s.inputRow}>
        <div>
          <label style={s.label}>Child's Name</label>
          <input className="input" value={form.name} onChange={e => u('name', e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>Gender</label>
          <select value={form.gender} onChange={e => u('gender', e.target.value)} style={s.select}>
            <option value="boy">Boy</option><option value="girl">Girl</option>
          </select>
        </div>
      </div>
      <div style={s.inputRow3}>
        <div>
          <label style={s.label}>Date of Birth</label>
          <input className="input" type="date" value={form.dob} onChange={e => u('dob', e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>Height (cm)</label>
          <input className="input" type="number" step="0.1" value={form.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>Weight (kg)</label>
          <input className="input" type="number" step="0.1" value={form.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} />
        </div>
      </div>
      <div style={s.inputFull}>
        <label style={s.label}>Head Circumference (cm) — for infants under 3 years</label>
        <input className="input" type="number" step="0.1" value={form.headCircumference} onChange={e => u('headCircumference', e.target.value)} style={{ fontSize: 12 }} placeholder="Optional" />
      </div>

      {ageMonths !== null && <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Age: {years}y {months}m</div>}

      <button style={s.btnCalc} onClick={() => setCalculated(true)} disabled={!canCalc}>👶 Calculate Growth</button>

      {calculated && result && (
        <>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: 12, marginBottom: 16, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>GROWTH STATUS</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: growthStatus()?.color || '#16a34a', marginTop: 4 }}>
              {growthStatus()?.icon} {growthStatus()?.label}
            </div>
            {form.name && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>for {form.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: result.headCircumference ? '1fr 1fr 1fr' : '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {result.heightPct !== null && (
              <div style={{ textAlign: 'center', padding: '12px 8px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Height Percentile</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{result.heightPct}%</div>
              </div>
            )}
            {result.weightPct !== null && (
              <div style={{ textAlign: 'center', padding: '12px 8px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>Weight Percentile</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{result.weightPct}%</div>
              </div>
            )}
            {result.bmi !== null && (
              <div style={{ textAlign: 'center', padding: '12px 8px', background: '#f8fafc', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>BMI-for-Age</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{result.bmi}</div>
              </div>
            )}
          </div>

          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 6 }}>👶 Pediatric Screening</div>
            <div style={{ fontSize: 11, color: '#0c4a6e', lineHeight: 1.6 }}>
              Regular pediatric check-ups help monitor growth milestones and detect potential concerns early.
              Based on age, appropriate screening tests may be recommended by your pediatrician.
            </div>
          </div>

          {recs && recs.tests.length > 0 && (
            <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Screening</div>
              {recs.tests.map(t => (
                <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>
              ))}
              <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginTop: 8, marginBottom: 6 }}>
                🛒 Book Tests (₹{recs.totalCost})
              </button>
              <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ Consult Pediatrician</button>
            </div>
          )}
        </>
      )}

      {calculated && !canCalc && <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 16 }}>Please fill in DOB, height, and weight to calculate growth.</div>}
    </div>
  );
}
