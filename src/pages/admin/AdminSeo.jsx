import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useSeoStore from '../../stores/seoStore';

export default function AdminSeo() {
  const t = useT();
  const { data, updateKeyword, addKeyword, deleteKeyword, updatePage, updateAnalytics, resetSeo } = useSeoStore();
  const [tab, setTab] = useState('overview');
  const [showAddKw, setShowAddKw] = useState(false);
  const [kwForm, setKwForm] = useState({ keyword: '', volume: '', difficulty: '' });

  const handleAddKw = (e) => {
    e.preventDefault();
    addKeyword({ keyword: kwForm.keyword, volume: +kwForm.volume, difficulty: +kwForm.difficulty, rank: 0, trend: 'stable' });
    setKwForm({ keyword: '', volume: '', difficulty: '' });
    setShowAddKw(false);
  };

  const renderTab = (label, key) => (
    <button onClick={() => setTab(key)} style={{ padding: '8px 16px', border: 'none', cursor: 'pointer', borderRadius: 4, background: tab === key ? '#6366f1' : '#e5e7eb', color: tab === key ? '#fff' : '#374151', fontWeight: tab === key ? 600 : 400, fontSize: 13 }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>🔍 SEO Manager</h2>
        <button onClick={resetSeo} style={{ padding: '6px 14px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>Reset to Defaults</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {renderTab('Overview', 'overview')}
        {renderTab('Keywords', 'keywords')}
        {renderTab('Pages', 'pages')}
        {renderTab('Analytics', 'analytics')}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 10, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 13, color: '#166534' }}>Total Pages</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#14532d' }}>{data.analytics.totalPages}</div>
          </div>
          <div style={{ background: '#eff6ff', padding: 20, borderRadius: 10, border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: 13, color: '#1e40af' }}>Indexed Pages</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e3a8a' }}>{data.analytics.indexedPages}</div>
          </div>
          <div style={{ background: '#fefce8', padding: 20, borderRadius: 10, border: '1px solid #fde68a' }}>
            <div style={{ fontSize: 13, color: '#854d0e' }}>Organic Traffic (30d)</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#713f12' }}>{data.analytics.organicTraffic.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: data.analytics.organicChange.startsWith('+') ? '#16a34a' : '#dc2626' }}>{data.analytics.organicChange}</div>
          </div>
          <div style={{ background: '#f5f3ff', padding: 20, borderRadius: 10, border: '1px solid #ddd6fe' }}>
            <div style={{ fontSize: 13, color: '#5b21b6' }}>Backlinks</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#4c1d95' }}>{data.analytics.backlinks.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: data.analytics.backlinksChange.startsWith('+') ? '#16a34a' : '#dc2626' }}>{data.analytics.backlinksChange}</div>
          </div>
          <div style={{ background: '#ecfdf5', padding: 20, borderRadius: 10, border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: 13, color: '#065f46' }}>Sitemap</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#064e3b' }}>{data.analytics.sitemapUrl}</div>
          </div>
          <div style={{ background: '#fdf2f8', padding: 20, borderRadius: 10, border: '1px solid #fbcfe8' }}>
            <div style={{ fontSize: 13, color: '#9d174d' }}>robots.txt</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#831843' }}>{data.analytics.robotsTxt}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Last crawl: {data.analytics.lastCrawl}</div>
          </div>
        </div>
      )}

      {tab === 'keywords' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: '#6b7280' }}>{data.keywords.length} keywords tracked</div>
            <button onClick={() => setShowAddKw(true)} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500, fontSize: 12 }}>+ Add Keyword</button>
          </div>
          {showAddKw && (
            <form onSubmit={handleAddKw} style={{ background: '#f9fafb', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #e5e7eb', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Keyword</label><input value={kwForm.keyword} onChange={e => setKwForm({ ...kwForm, keyword: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Search Volume</label><input type="number" value={kwForm.volume} onChange={e => setKwForm({ ...kwForm, volume: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 100 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Difficulty (0-100)</label><input type="number" min="0" max="100" value={kwForm.difficulty} onChange={e => setKwForm({ ...kwForm, difficulty: e.target.value })} required style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 80 }} /></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="submit" style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Add</button>
                <button type="button" onClick={() => setShowAddKw(false)} style={{ padding: '6px 14px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>{t('admin.seo.cancel', 'Cancel')}</button>
              </div>
            </form>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Keyword</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Volume</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Difficulty</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Rank</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Trend</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Last Checked</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.keywords.map(kw => (
                <tr key={kw.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{kw.keyword}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>{kw.volume?.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{ color: kw.difficulty > 50 ? '#dc2626' : kw.difficulty > 30 ? '#d97706' : '#16a34a' }}>{kw.difficulty}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', minWidth: 24, padding: '2px 8px', borderRadius: 10, background: kw.rank <= 3 ? '#dcfce7' : kw.rank <= 5 ? '#fef9c3' : '#fee2e2', color: kw.rank <= 3 ? '#166534' : kw.rank <= 5 ? '#854d0e' : '#991b1b', fontWeight: 600, fontSize: 12 }}>{kw.rank > 0 ? `#${kw.rank}` : '—'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontSize: 16 }}>{kw.trend === 'up' ? '📈' : kw.trend === 'down' ? '📉' : '➡️'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6b7280', fontSize: 12 }}>{kw.lastChecked}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <button onClick={() => deleteKeyword(kw.id)} style={{ padding: '3px 8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'pages' && (
        <div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>{data.pages.length} pages monitored</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Route</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Score</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Last Scanned</th>
                <th style={{ padding: '10px 12px' }}></th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map(p => (
                <tr key={p.route} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12, color: '#6366f1' }}>{p.route}</td>
                  <td style={{ padding: '10px 12px', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.title}>{p.metaDesc ? p.metaDesc.slice(0, 60) + '…' : p.title}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, background: p.status === 'good' ? '#dcfce7' : '#fef9c3', color: p.status === 'good' ? '#166534' : '#854d0e', fontSize: 11, fontWeight: 500 }}>{p.status === 'good' ? '✅ Good' : '⚠️ Needs Work'}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 600, color: p.score >= 85 ? '#16a34a' : p.score >= 70 ? '#d97706' : '#dc2626' }}>{p.score}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#6b7280', fontSize: 12 }}>{p.lastScanned}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <button onClick={() => { const t = prompt('Page Title:', p.title); if (t) updatePage(p.route, { title: t }); }} style={{ padding: '3px 8px', background: '#e5e7eb', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, marginRight: 4 }}>Title</button>
                    <button onClick={() => { const d = prompt('Meta Description:', p.metaDesc); if (d) updatePage(p.route, { metaDesc: d }); }} style={{ padding: '3px 8px', background: '#e5e7eb', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>Meta</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'analytics' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Organic Traffic (30d)</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{data.analytics.organicTraffic?.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: data.analytics.organicChange?.startsWith('+') ? '#16a34a' : '#dc2626' }}>{data.analytics.organicChange}</div>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Backlinks</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{data.analytics.backlinks?.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: data.analytics.backlinksChange?.startsWith('+') ? '#16a34a' : '#dc2626' }}>{data.analytics.backlinksChange} this month</div>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Pages Indexed</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>{data.analytics.indexedPages} / {data.analytics.totalPages}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(data.analytics.indexedPages / data.analytics.totalPages * 100)}% indexed</div>
            </div>
            <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Sitemap</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4, wordBreak: 'break-all' }}>{data.analytics.sitemapUrl}</div>
            </div>
          </div>
          <div style={{ background: '#f9fafb', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Update Analytics</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Organic Traffic</label><input type="number" defaultValue={data.analytics.organicTraffic} id="seo-organic" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 120 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Change %</label><input defaultValue={data.analytics.organicChange} id="seo-organic-change" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 80 }} /></div>
              <div><label style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Backlinks</label><input type="number" defaultValue={data.analytics.backlinks} id="seo-backlinks" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, width: 100 }} /></div>
              <button onClick={() => {
                updateAnalytics({
                  organicTraffic: +document.getElementById('seo-organic').value,
                  organicChange: document.getElementById('seo-organic-change').value,
                  backlinks: +document.getElementById('seo-backlinks').value,
                });
              }} style={{ padding: '6px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}