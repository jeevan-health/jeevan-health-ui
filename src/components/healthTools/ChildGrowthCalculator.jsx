import { useState } from 'react';
import { childPercentile, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';

export default function ChildGrowthCalculator() {
  const [form, setForm] = useState({ name: '', gender: 'boy', dob: '', height: '', weight: '', headCircumference: '' });
  const addItem = useCartStore(s => s.addItem);
  const u = (k, v) => setForm({ ...form, [k]: v });

  const ageMonths = form.dob ? Math.floor((new Date() - new Date(form.dob)) / (1000 * 60 * 60 * 24 * 30.44)) : null;
  const result = (ageMonths !== null && form.height && form.weight) ? childPercentile(Number(form.height), Number(form.weight), ageMonths) : null;
  const recs = getRecommendedTests('child');

  const btnStyle = { padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Child's Name</label>
          <input className="input" value={form.name} onChange={e => u('name', e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Gender</label>
          <select value={form.gender} onChange={e => u('gender', e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff' }}>
            <option value="boy">Boy</option><option value="girl">Girl</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Date of Birth</label>
          <input className="input" type="date" value={form.dob} onChange={e => u('dob', e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Height (cm)</label>
          <input className="input" type="number" value={form.height} onChange={e => u('height', e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>Weight (kg)</label>
          <input className="input" type="number" step="0.1" value={form.weight} onChange={e => u('weight', e.target.value)} style={{ fontSize: 12 }} />
        </div>
      </div>

      {ageMonths !== null && <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Age: {Math.floor(ageMonths / 12)}y {ageMonths % 12}m</div>}

      {result && (
        <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: 12, marginBottom: 16, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>GROWTH STATUS</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', marginTop: 4 }}>🟢 Healthy Growth</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            {result.heightPct && <div style={{ padding: '8px', background: '#fff', borderRadius: 10 }}><div style={{ fontSize: 10, color: '#64748b' }}>Height Percentile</div><div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{result.heightPct}%</div></div>}
            {result.weightPct && <div style={{ padding: '8px', background: '#fff', borderRadius: 10 }}><div style={{ fontSize: 10, color: '#64748b' }}>Weight Percentile</div><div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{result.weightPct}%</div></div>}
            {result.bmi && <div style={{ padding: '8px', background: '#fff', borderRadius: 10 }}><div style={{ fontSize: 10, color: '#64748b' }}>BMI-for-Age</div><div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{result.bmi}</div></div>}
          </div>
        </div>
      )}

      {/* Pediatric Screening */}
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
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginTop: 8 }}>
            🛒 Book Tests (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}
