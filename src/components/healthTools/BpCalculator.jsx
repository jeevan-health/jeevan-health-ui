import { useState } from 'react';
import { bpCategory, getRecommendedTests } from '../../utils/healthCalculations';
import useHealthToolsStore from '../../stores/healthToolsStore';
import useCartStore from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';

export default function BpCalculator() {
  const t = useT();
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const bpReadings = useHealthToolsStore(s => s.bpReadings);
  const addBpReading = useHealthToolsStore(s => s.addBpReading);
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const cat = bpCategory(systolic, diastolic);
  const recs = (systolic || diastolic) ? getRecommendedTests('bp', { systolic, diastolic }) : null;

  const handleAdd = () => {
    if (!systolic || !diastolic) return;
    addBpReading({ systolic: Number(systolic), diastolic: Number(diastolic), pulse: Number(pulse) || null });
  };

  const btnStyle = { padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('bp.systolic', 'Systolic BP')}</label>
          <input className="input" type="number" placeholder={t('bp.egSystolic', 'e.g. 120')} value={systolic} onChange={e => setSystolic(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('bp.diastolic', 'Diastolic BP')}</label>
          <input className="input" type="number" placeholder={t('bp.egDiastolic', 'e.g. 80')} value={diastolic} onChange={e => setDiastolic(e.target.value)} style={{ fontSize: 13 }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('bp.pulse', 'Pulse (bpm)')}</label>
          <input className="input" type="number" placeholder={t('bp.egPulse', 'e.g. 72')} value={pulse} onChange={e => setPulse(e.target.value)} style={{ fontSize: 13 }} />
        </div>
      </div>

      {systolic && diastolic && cat && (
        <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{t('bp.bloodPressure', 'BLOOD PRESSURE')}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: cat?.color }}>{systolic} / {diastolic}</div>
          <div style={{ fontSize: 14 }}>mmHg</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: cat?.color, marginTop: 4 }}>{cat?.icon} {cat?.label}</div>
          {pulse && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{t('bp.pulseLabel', 'Pulse')}: {pulse} bpm</div>}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={handleAdd} disabled={!systolic || !diastolic} style={{ ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', flex: 1, fontWeight: 600, opacity: (!systolic || !diastolic) ? 0.5 : 1 }}>💾 {t('bp.addReading', 'Add Reading')}</button>
      </div>

      {/* History */}
      {bpReadings.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>📊 {t('bp.readingHistory', 'Reading History')}</div>
          <div style={{ display: 'flex', gap: 6, overflow: 'auto', paddingBottom: 4 }}>
            {bpReadings.slice(-10).map(r => {
              const rc = bpCategory(r.systolic, r.diastolic);
              return (
                <div key={r.id} style={{ flexShrink: 0, textAlign: 'center', padding: '6px 10px', background: '#f8fafc', borderRadius: 8, fontSize: 11, borderLeft: `3px solid ${rc?.color || '#94a3b8'}` }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.systolic}/{r.diastolic}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BP Classification */}
      <div style={{ background: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>📋 {t('bp.bpClassification', 'BP Classification')}</div>
        {[
          { label: t('bp.classNormal', 'Normal'), range: '< 120 / < 80', color: '#16A34A' },
          { label: t('bp.classElevated', 'Elevated'), range: '120–129 / < 80', color: '#F59E0B' },
          { label: t('bp.classStage1', 'Stage 1 HTN'), range: '130–139 / 80–89', color: '#F97316' },
          { label: t('bp.classStage2', 'Stage 2 HTN'), range: '≥ 140 / ≥ 90', color: '#EF4444' },
          { label: t('bp.classCrisis', 'Crisis'), range: '≥ 180 / ≥ 120', color: '#DC2626' },
        ].map(c => {
          const isActive = cat?.label?.toLowerCase().includes(c.label.toLowerCase());
          return (
            <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 11, color: isActive ? c.color : '#64748b', fontWeight: isActive ? 700 : 400 }}>
              <span>{isActive ? '▶' : ''} {c.label}</span>
              <span>{c.range}</span>
            </div>
          );
        })}
      </div>

      {cat && cat.label !== 'Normal' && (
        <div style={{ background: '#fef2f2', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #fecaca' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>⚠️ {t('bp.highBpAlert', 'High BP Alert')}</div>
          <div style={{ fontSize: 11, color: '#7f1d1d', lineHeight: 1.5 }}>
            {t('bp.highBpDesc', 'Your blood pressure is elevated. Please consult a healthcare provider for proper evaluation. Monitor your BP regularly and maintain a healthy lifestyle.')}
          </div>
        </div>
      )}

      {/* Recommended tests */}
      {recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 {t('bp.recommendedForYou', 'Recommended for You')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#334155' }}>
                <span>✔</span> {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span>
              </div>
            ))}
          </div>
          {recs.packages.map(p => (
            <button key={p.name} onClick={() => navigate(`/package/${p.name.toLowerCase().replace(/\s+/g, '-')}`)} style={{ ...btnStyle, background: '#1866C9', color: '#fff', border: 'none', width: '100%', marginBottom: 6, fontWeight: 600 }}>
              📦 {p.name} — ₹{p.price}
            </button>
          ))}
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600 }}>
            🛒 {t('bp.bookRecommended', 'Book Recommended Tests')} (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}
