import { useState } from 'react';
import { menstrualCycle, getRecommendedTests } from '../../utils/healthCalculations';
import useCartStore from '../../stores/cartStore';

const s = {
  label: { fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 },
  btnCalc: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#F472B6', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%', marginBottom: 16 },
  btnSec: { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
};

export default function OvulationFertility() {
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [calculated, setCalculated] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const cycle = menstrualCycle(lmp, cycleLength, '5');
  const recs = getRecommendedTests('ovulation');

  return (
    <div>
      <div style={s.inputRow}>
        <div>
          <label style={s.label}>Last Period Start</label>
          <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>Cycle Length (days)</label>
          <input className="input" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} style={{ fontSize: 12 }} min="21" max="35" />
        </div>
      </div>

      <button style={s.btnCalc} onClick={() => setCalculated(true)} disabled={!lmp}>🌸 Calculate Ovulation</button>

      {calculated && cycle && (
        <div style={{ background: '#fdf2f8', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#be185d', fontWeight: 600 }}>🥚 Ovulation Day</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{cycle.ovulation?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) || '—'}</div>
            </div>
            <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#be185d', fontWeight: 600 }}>🌱 Fertile Window</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                {cycle.fertileStart?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – {cycle.fertileEnd?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#be185d', fontWeight: 600 }}>📅 Next Period Due</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{cycle.nextPeriod?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) || '—'}</div>
          </div>
        </div>
      )}

      {calculated && cycle && (
        <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 11, color: '#0c4a6e', lineHeight: 1.6 }}>
          💡 Your fertile window is your best chance of conceiving. Ovulation typically occurs 14 days before your next period.
          For best results, aim to have intercourse during the fertile window. If you have been trying for 6+ months without success,
          consider consulting a fertility specialist.
        </div>
      )}

      {calculated && recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Preconception Health Screening</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ fontSize: 12, color: '#334155' }}>✔ {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span></div>
            ))}
          </div>
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
            🛒 Book Tests (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}
