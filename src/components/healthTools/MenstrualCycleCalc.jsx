import { useState } from 'react';
import { menstrualCycle, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';

const s = {
  label: { fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 },
  btnCalc: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#EC4899', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%', marginBottom: 16 },
  btnSec: { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' },
  inputRow3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 },
};

export default function MenstrualCycleCalc() {
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodDuration, setPeriodDuration] = useState('5');
  const [calculated, setCalculated] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const cycle = menstrualCycle(lmp, cycleLength, periodDuration);
  const recs = getRecommendedTests('menstrual');

  return (
    <div>
      <div style={s.inputRow3}>
        <div>
          <label style={s.label}>Last Period Start</label>
          <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>Cycle Length (days)</label>
          <input className="input" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} style={{ fontSize: 12 }} min="21" max="35" />
        </div>
        <div>
          <label style={s.label}>Period Duration</label>
          <input className="input" type="number" value={periodDuration} onChange={e => setPeriodDuration(e.target.value)} style={{ fontSize: 12 }} min="3" max="10" />
        </div>
      </div>

      <button style={s.btnCalc} onClick={() => setCalculated(true)} disabled={!lmp}>📅 Calculate Cycle</button>

      {calculated && cycle && (
        <div style={{ background: '#fdf2f8', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Next Period', value: cycle.nextPeriod?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: '📅' },
              { label: 'Ovulation Day', value: cycle.ovulation?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }), icon: '🥚' },
              { label: 'Fertile Window', value: `${cycle.fertileStart?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${cycle.fertileEnd?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, icon: '🌱' },
              { label: 'PMS Start', value: cycle.pmsStart?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }), icon: '💫' },
            ].map(item => (
              <div key={item.label} style={{ padding: '8px 12px', background: '#fff', borderRadius: 10 }}>
                <div style={{ fontSize: 10, color: '#be185d', fontWeight: 600 }}>{item.icon} {item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{item.value || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {calculated && !lmp && <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 16 }}>Please enter your last period start date.</div>}

      {calculated && recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Health Screening</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ fontSize: 12, color: '#334155' }}>✔ {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span></div>
            ))}
          </div>
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
            🛒 Book Tests (₹{recs.totalCost})
          </button>
          <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ Consult Gynaecologist</button>
        </div>
      )}
    </div>
  );
}
