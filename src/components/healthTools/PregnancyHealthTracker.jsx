import { useState, useEffect } from 'react';
import { pregnancyDueDate, getRecommendedTests } from '../../utils/healthCalculations';
import useHealthToolsStore from '../../stores/healthToolsStore';
import useCartStore from '../../stores/cartStore';

const s = {
  label: { fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 },
  btnCalc: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#A78BFA', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%', marginBottom: 16 },
  btnSec: { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
};

const CHECKLIST = [
  '✅ Schedule first antenatal visit',
  '✅ Start folic acid supplements',
  '✅ Blood tests (CBC, Blood Group, Rh)',
  '✅ Thyroid function screening',
  '✅ Blood sugar screening',
  '✅ Urine routine test',
  '✅ Ultrasound scan (dating scan)',
  '✅ Monitor blood pressure regularly',
  '✅ Track weight gain',
  '✅ Iron and calcium supplements',
  '✅ Glucose tolerance test',
  '✅ Anatomy scan (20 weeks)',
  '✅ Vaccinations (Flu, Tdap)',
  '✅ Group B Streptococcus screening',
  '✅ Fetal movement tracking',
  '✅ Birth plan preparation',
  '✅ Pediatrician selection',
  '✅ Hospital bag preparation',
];

export default function PregnancyHealthTracker() {
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [calculated, setCalculated] = useState(false);
  const [checked, setChecked] = useState({});
  const addItem = useCartStore(s => s.addItem);
  const pregnancyData = useHealthToolsStore(s => s.pregnancyData);
  const updatePregnancy = useHealthToolsStore(s => s.updatePregnancy);
  const due = pregnancyDueDate(lmp, cycleLength);
  const recs = getRecommendedTests('pregnancyTracker');

  const handleCalculate = () => {
    setCalculated(true);
    if (due) {
      updatePregnancy({
        lmp, cycleLength,
        dueDate: due.dueDate.toISOString(),
        weeks: due.weeks,
        trimester: due.trimester.label,
      });
    }
  };

  const toggleCheck = (i) => setChecked({ ...checked, [i]: !checked[i] });

  return (
    <div>
      <div style={s.inputRow}>
        <div>
          <label style={s.label}>Last Menstrual Period</label>
          <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>Cycle Length (days)</label>
          <input className="input" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} style={{ fontSize: 12 }} min="21" max="35" />
        </div>
      </div>

      <button style={s.btnCalc} onClick={handleCalculate} disabled={!lmp}>👶 Start Pregnancy Tracker</button>

      {calculated && due && (
        <>
          <div style={{ background: '#f5f3ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#6d28d9', fontWeight: 600 }}>PREGNANCY SUMMARY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#4c1d95' }}>Week {due.weeks} — {due.trimester.label}</div>
              <div style={{ fontSize: 13, color: '#6d28d9' }}>EDD: {due.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 8 }}>📋 Pregnancy Health Checklist</div>
            <div style={{ fontSize: 11, color: '#166534', lineHeight: 1.7 }}>
              {CHECKLIST.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
                  <input type="checkbox" checked={!!checked[i]} onChange={() => toggleCheck(i)} style={{ width: 14, height: 14, cursor: 'pointer' }} />
                  <span style={{ textDecoration: checked[i] ? 'line-through' : 'none', color: checked[i] ? '#94a3b8' : '#166534' }}>{item.replace('✅ ', '')}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff7ed', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: 11, color: '#9a3412', marginBottom: 4 }}>💡 Tips for {due.trimester.label}</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#78350f', lineHeight: 1.7 }}>
              {due.weeks <= 13 && <>
                <li>Take folic acid and prenatal vitamins daily</li>
                <li>Stay hydrated and eat small, frequent meals</li>
                <li>Get plenty of rest and avoid strenuous activity</li>
              </>}
              {due.weeks > 13 && due.weeks <= 27 && <>
                <li>Continue prenatal vitamins — iron and calcium are important now</li>
                <li>Schedule your anatomy scan (18–22 weeks)</li>
                <li>Stay active with pregnancy-safe exercise</li>
              </>}
              {due.weeks > 27 && <>
                <li>Monitor fetal movements daily</li>
                <li>Prepare hospital bag and birth plan</li>
                <li>Attend all third-trimester checkups</li>
              </>}
            </ul>
          </div>

          {recs && recs.tests.length > 0 && (
            <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 Recommended Prenatal Tests</div>
              {recs.tests.map(t => (
                <div key={t.name} style={{ fontSize: 12, color: '#334155', marginBottom: 2 }}>✔ {t.name} — {t.reason}</div>
              ))}
              <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginTop: 8, marginBottom: 6 }}>
                🛒 Book Tests (₹{recs.totalCost})
              </button>
              <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ Consult Gynaecologist</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
