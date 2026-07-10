import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccines, vaccineCategories } from '../data/vaccinationData';

const ageOrder = ['Birth', '0-6 Weeks', '6 Weeks', '6 Weeks - 24 Months', '6 Weeks - 14 Weeks', '6 Months - 5 Years', '0-5 Years', '5-18 Years', '5-11 Years', '4-6 Years', '5-6 Years', '9-45 Years', '10-16 Years', '10+', '11+ Years', '15+', '18+', '18+ Years', '11+ Years', '18+ (High Risk)', '18+ (Healthcare)', '27-45 Years', '60+ Years', '65+ Years', 'All Ages'];

export default function VaccineSchedule() {
  const t = useT();
  const [expandedCat, setExpandedCat] = useState(null);

  const grouped = useMemo(() => {
    const map = {};
    vaccineCategories.forEach(c => { map[c.id] = { ...c, vaccines: [] }; });
    vaccines.forEach(v => {
      if (map[v.category]) map[v.category].vaccines.push(v);
    });
    return Object.values(map).filter(g => g.vaccines.length > 0);
  }, []);

  const handlePrint = () => { window.print(); };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0891b2cc 100%)', padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/vaccination" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>{t('back.to.vaccination')}</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>📋</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{t('vaccination.schedule')}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>{t('complete.schedule')}</p>
            </div>
          </div>
          <button onClick={handlePrint}
            style={{ marginTop: 12, padding: '10px 24px', borderRadius: 8, border: 'none', background: '#fff', color: '#0891b2', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {t('print.save')}
          </button>
        </div>
      </div>

      <div className="page-section container" style={{ paddingTop: 20 }}>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('showing.vaccines')}</p>

        {grouped.map(group => {
          const isExpanded = expandedCat === group.id;
          const catVacCount = group.vaccines.length;
          return (
            <div key={group.id} style={{ marginBottom: 12, borderRadius: 10, border: `1px solid ${group.color}30`, overflow: 'hidden', background: '#fff' }}>
              <div onClick={() => setExpandedCat(isExpanded ? null : group.id)}
                style={{ padding: '12px 16px', background: `${group.color}08`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isExpanded ? `1px solid ${group.color}20` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{group.icon}</span>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{group.name}</h3>
                    <span style={{ fontSize: 11, color: group.color, fontWeight: 600 }}>{group.age} · {catVacCount} vaccine{catVacCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: '#94a3b8', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </div>
              {isExpanded && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('vaccine')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('disease')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('age.group')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('doses')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('schedule')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('price')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('availability')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>{t('action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.vaccines.map(v => (
                        <tr key={v.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap' }}>{v.name}</td>
                          <td style={{ padding: '8px 10px', color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.disease}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569', fontSize: 10 }}>{v.ageGroup}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 4, background: '#f0f9ff', color: '#0369a1', fontWeight: 600, fontSize: 10 }}>{v.doseCount}</span>
                          </td>
                          <td style={{ padding: '8px 10px', color: '#64748b', fontSize: 10, maxWidth: 160 }}>{v.doseInterval}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#059669', whiteSpace: 'nowrap' }}>₹{v.price}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: v.availability === 'Home & Clinic' ? '#f0fdf4' : '#fef2f2', color: v.availability === 'Home & Clinic' ? '#15803d' : '#b91c1c', fontWeight: 600 }}>{v.availability === 'Home & Clinic' ? '🏠 Home' : '🏥 Clinic'}</span>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <Link to={`/vaccination/${v.slug}`} style={{ padding: '4px 10px', borderRadius: 4, background: group.color, color: '#fff', textDecoration: 'none', fontSize: 10, fontWeight: 600, display: 'inline-block' }}>{t('view')}</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @media print {
          header, footer, nav, .admin-layout, .btn, button, a[href] { display: none !important; }
          body { background: #fff; font-size: 10px; }
          .page-section { padding: 0 !important; }
          div[style*="background: linear-gradient"] { padding: 10px 0 !important; }
          h1 { font-size: 16px !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}

