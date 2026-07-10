import { useState } from 'react';
import { calcBMI, bmiCategory, idealWeightRange, getRecommendedTests } from '../../utils/healthCalculations';
import useHealthToolsStore from '../../stores/healthToolsStore';
import useCartStore from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';

export default function BmiCalculator() {
  const t = useT();
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [unit, setUnit] = useState('cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const addBmiRecord = useHealthToolsStore(s => s.addBmiRecord);
  const bmiHistory = useHealthToolsStore(s => s.bmiHistory);
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const hCm = unit === 'cm' ? Number(heightCm) : (Number(feet) * 30.48 + Number(inches) * 2.54);
  const wKg = Number(weightKg);
  const bmi = calcBMI(hCm, wKg);
  const cat = bmiCategory(bmi);
  const ideal = idealWeightRange(hCm);

  const handleSave = () => {
    if (!bmi) return;
    addBmiRecord({ bmi, heightCm: hCm, weightKg: wKg, category: cat?.label });
  };

  const recs = bmi ? getRecommendedTests('bmi', { bmi }) : null;

  const btnStyle = { padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' };

  return (
    <div>
      {/* Unit toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['cm', 'ft'].map(u => (
          <button key={u} onClick={() => setUnit(u)} style={{
            ...btnStyle, flex: 1, background: unit === u ? '#1866C9' : '#fff',
            color: unit === u ? '#fff' : '#334155', fontWeight: unit === u ? 700 : 400,
          }}>{u === 'cm' ? t('bmi.centimeters', 'Centimeters') : t('bmi.feetInches', 'Feet & Inches')}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('bmi.height', 'Height')} {unit === 'cm' ? '(cm)' : ''}</label>
          {unit === 'cm' ? (
            <input className="input" type="number" placeholder={t('bmi.egHeight', 'e.g. 170')} value={heightCm} onChange={e => setHeightCm(e.target.value)} style={{ fontSize: 13 }} />
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <input className="input" type="number" placeholder={t('bmi.feet', 'Feet')} value={feet} onChange={e => setFeet(e.target.value)} style={{ fontSize: 13, flex: 1 }} />
              <input className="input" type="number" placeholder={t('bmi.inches', 'Inches')} value={inches} onChange={e => setInches(e.target.value)} style={{ fontSize: 13, flex: 1 }} />
            </div>
          )}
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('bmi.weight', 'Weight (kg)')}</label>
          <input className="input" type="number" placeholder={t('bmi.egWeight', 'e.g. 72')} value={weightKg} onChange={e => setWeightKg(e.target.value)} style={{ fontSize: 13 }} />
        </div>
      </div>

      {bmi && (
        <>
          <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{t('bmi.yourBmi', 'YOUR BMI')}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: cat?.color }}>{bmi}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: cat?.color, marginTop: 2 }}>{cat?.icon} {cat?.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>{t('bmi.healthyRange', 'Healthy BMI Range: 18.5 – 24.9')}</div>
            {ideal && <div style={{ fontSize: 11, color: '#64748b' }}>{t('bmi.idealWeight', 'Ideal Weight')}: {ideal.min} – {ideal.max} kg</div>}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={handleSave} style={{ ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', flex: 1, fontWeight: 600 }}>💾 {t('bmi.saveToHistory', 'Save to History')}</button>
          </div>

          {/* History sparkline */}
          {bmiHistory.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>📊 {t('bmi.bmiHistory', 'BMI History')}</div>
              <div style={{ display: 'flex', gap: 6, overflow: 'auto', paddingBottom: 4 }}>
                {bmiHistory.slice(-10).map(r => (
                  <div key={r.id} style={{ flexShrink: 0, textAlign: 'center', padding: '6px 10px', background: '#f8fafc', borderRadius: 8, fontSize: 11 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.bmi}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8' }}>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle tips */}
          <div style={{ background: '#f0f9ff', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f4a96', marginBottom: 6 }}>💡 {t('bmi.lifestyleTips', 'Lifestyle Tips')}</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#334155', lineHeight: 1.8 }}>
              {bmi >= 25 && <li>{t('bmi.tipWalk', 'Walk 30 minutes daily to support weight management')}</li>}
              {bmi >= 25 && <li>{t('bmi.tipReduceProcessed', 'Reduce processed foods and added sugars')}</li>}
              <li>{t('bmi.tipHydrate', 'Stay hydrated — aim for 8 glasses of water daily')}</li>
              <li>{t('bmi.tipSleep', 'Sleep 7–8 hours for optimal health')}</li>
              {bmi < 18.5 && <li>{t('bmi.tipProtein', 'Include protein-rich foods and healthy fats in your diet')}</li>}
            </ul>
          </div>
        </>
      )}

      {/* Recommended tests */}
      {recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 {t('bmi.recommendedForYou', 'Recommended for You')}</div>
          <p style={{ fontSize: 11, color: '#78350f', marginBottom: 8 }}>{t('bmi.recommendedDesc', 'Based on your BMI, we recommend these preventive tests:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#334155' }}>
                <span>✔</span> {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span>
              </div>
            ))}
          </div>
          {recs.packages.map(p => (
            <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{
              ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginBottom: 6, fontWeight: 600,
            }}>📦 {p.name} — ₹{p.price}</button>
          ))}
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{
            ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600,
          }}>🛒 {t('bmi.bookRecommended', 'Book Recommended Tests')} (₹{recs.totalCost})</button>
        </div>
      )}
    </div>
  );
}
