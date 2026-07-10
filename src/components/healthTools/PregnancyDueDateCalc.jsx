import { useState } from 'react';
import { pregnancyDueDate, getRecommendedTests } from '../../utils/healthCalculations';
import useHealthToolsStore from '../../stores/healthToolsStore';
import useCartStore from '../../stores/cartStore';
import { useT } from '../../i18n/LanguageProvider';

const s = {
  label: { fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 },
  btnCalc: { padding: '10px 20px', borderRadius: 8, border: 'none', background: '#8B5CF6', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', width: '100%', marginBottom: 16 },
  btnSec: { padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' },
  inputRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
};

export default function PregnancyDueDateCalc() {
  const t = useT();
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [calculated, setCalculated] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const updatePregnancy = useHealthToolsStore(s => s.updatePregnancy);
  const due = pregnancyDueDate(lmp, cycleLength);
  const recs = getRecommendedTests('pregnancy');

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

  return (
    <div>
      <div style={s.inputRow}>
        <div>
          <label style={s.label}>{t('pregnancy.lastPeriod', 'Last Menstrual Period')}</label>
          <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} style={{ fontSize: 12 }} />
        </div>
        <div>
          <label style={s.label}>{t('pregnancy.cycleLength', 'Cycle Length (days)')}</label>
          <input className="input" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} style={{ fontSize: 12 }} min="21" max="35" />
        </div>
      </div>

      <button style={s.btnCalc} onClick={handleCalculate} disabled={!lmp}>🤰 {t('pregnancy.calculateDueDate', 'Calculate Due Date')}</button>

      {calculated && due && (
        <div style={{ background: '#f5f3ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#6d28d9', fontWeight: 600 }}>{t('pregnancy.expectedDelivery', 'EXPECTED DELIVERY DATE')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#4c1d95' }}>{due.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: '#6d28d9' }}>{t('pregnancy.pregnancyWeek', 'Pregnancy Week')}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{due.weeks}w {due.days}d</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: '#6d28d9' }}>{t('pregnancy.trimester', 'Trimester')}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: due.trimester.color }}>{due.trimester.label}</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#6d28d9' }}>
            {t('pregnancy.daysPregnant', 'Days Pregnant')}: {due.daysPregnant}
          </div>
        </div>
      )}

      {calculated && !lmp && <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 16 }}>{t('pregnancy.enterDate', 'Please enter your last menstrual period date.')}</div>}

      {calculated && recs && recs.tests.length > 0 && (
        <div style={{ background: '#fff7ed', borderRadius: 10, padding: 12, border: '1px solid #fed7aa' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9a3412', marginBottom: 6 }}>🩺 {t('pregnancy.recommendedPrenatal', 'Recommended Prenatal Tests')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ fontSize: 12, color: '#334155' }}>✔ {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span></div>
            ))}
          </div>
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...s.btnSec, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600, marginBottom: 6 }}>
            🛒 {t('pregnancy.bookTests', 'Book Tests')} (₹{recs.totalCost})
          </button>
          <button onClick={() => window.location.href = '/contact'} style={{ ...s.btnSec, width: '100%', fontWeight: 600 }}>👨‍⚕️ {t('pregnancy.consultGynaecologist', 'Consult Gynaecologist')}</button>
        </div>
      )}
    </div>
  );
}
