import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';

const KEYS = {
  nursing: { booking: 'jh_nursing_bookings', leads: 'jh_nurse_leads', label: 'Nursing', color: '#7C3AED', icon: '👩‍⚕️' },
  vaccination: { booking: 'jh_vaccination_bookings', leads: 'jh_vaccination_leads', label: 'Vaccination', color: '#2563EB', icon: '💉' },
  physio: { booking: 'jh_physio_bookings', leads: 'jh_physio_leads', label: 'Physio', color: '#0D9488', icon: '💪' },
};

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export default function AdminSalesDashboard() {
  const t = useT();
  const [data, setData] = useState({ nursing: { bookings: [], leads: [] }, vaccination: { bookings: [], leads: [] }, physio: { bookings: [], leads: [] } });

  useEffect(() => {
    setData({
      nursing: { bookings: load(KEYS.nursing.booking), leads: load(KEYS.nursing.leads) },
      vaccination: { bookings: load(KEYS.vaccination.booking), leads: load(KEYS.vaccination.leads) },
      physio: { bookings: load(KEYS.physio.booking), leads: load(KEYS.physio.leads) },
    });
  }, []);

  const totalRevenue = useMemo(() => {
    let total = 0;
    Object.values(KEYS).forEach(k => {
      const b = data[k.label.toLowerCase()]?.bookings || [];
      b.forEach(bk => { total += Number(bk.totalAmount || bk.servicePrice || bk.vaccinePrice || 0); });
    });
    return total;
  }, [data]);

  const monthRevenue = useMemo(() => {
    const now = new Date();
    const m = now.getMonth(), y = now.getFullYear();
    let total = 0;
    Object.values(KEYS).forEach(k => {
      const b = data[k.label.toLowerCase()]?.bookings || [];
      b.forEach(bk => {
        const d = new Date(bk.preferredDate || bk.appointmentDate || bk.date || 0);
        if (d.getMonth() === m && d.getFullYear() === y) total += Number(bk.totalAmount || bk.servicePrice || bk.vaccinePrice || 0);
      });
    });
    return total;
  }, [data]);

  const bookingCounts = useMemo(() => {
    const r = {};
    Object.entries(KEYS).forEach(([key, k]) => {
      const b = data[key]?.bookings || [];
      r[key] = b.length;
      r[`${key}_upcoming`] = b.filter(bk => (bk.status || '').toLowerCase() === 'confirmed' || (bk.status || '').toLowerCase() === 'upcoming').length;
      r[`${key}_completed`] = b.filter(bk => (bk.status || '').toLowerCase() === 'completed').length;
      r[`${key}_cancelled`] = b.filter(bk => (bk.status || '').toLowerCase() === 'cancelled').length;
      r[`${key}_revenue`] = b.reduce((s, bk) => s + Number(bk.totalAmount || bk.servicePrice || bk.vaccinePrice || 0), 0);
    });
    r.total = Object.values(KEYS).reduce((s, k) => s + (data[k.label.toLowerCase()]?.bookings || []).length, 0);
    return r;
  }, [data]);

  const leadCounts = useMemo(() => {
    const r = {};
    Object.entries(KEYS).forEach(([key, k]) => {
      const l = data[key]?.leads || [];
      r[key] = l.length;
      r[`${key}_converted`] = l.filter(lk => lk.status === 'converted' || lk.status === 'qualified').length;
    });
    return r;
  }, [data]);

  const byMonth = useMemo(() => {
    const map = {};
    Object.values(KEYS).forEach(k => {
      (data[k.label.toLowerCase()]?.bookings || []).forEach(bk => {
        const d = new Date(bk.preferredDate || bk.appointmentDate || bk.date || 0);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!map[key]) map[key] = { label: key, count: 0, revenue: 0 };
        map[key].count++;
        map[key].revenue += Number(bk.totalAmount || bk.servicePrice || bk.vaccinePrice || 0);
      });
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).slice(-12).map(([, v]) => v);
  }, [data]);

  const section = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
  const barMax = Math.max(...byMonth.map(m => m.count), 1);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>📈 {t('admin.sales.title', 'Sales Dashboard')}</h2>

      {/* Revenue Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { label: t('admin.sales.totalRevenue', 'Total Revenue'), value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', color: '#F59E0B' },
          { label: t('admin.sales.monthRevenue', 'This Month'), value: `₹${monthRevenue.toLocaleString()}`, icon: '📅', color: '#3B82F6' },
          { label: t('admin.sales.totalBookings', 'Total Bookings'), value: bookingCounts.total, icon: '📋', color: '#10B981' },
          { label: t('admin.sales.totalLeads', 'Total Leads'), value: leadCounts.nursing + leadCounts.vaccination + leadCounts.physio, icon: '👥', color: '#8B5CF6' },
        ].map(c => (
          <div key={c.label} style={{ ...section, marginBottom: 0, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{c.value}</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* By Service */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {Object.entries(KEYS).map(([key, k]) => {
          const bc = bookingCounts;
          const lc = leadCounts;
          return (
            <div key={key} style={{ ...section, marginBottom: 0, borderLeft: `4px solid ${k.color}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{k.icon} {k.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
                <div><span style={{ color: '#64748b' }}>{t('admin.sales.bookings', 'Bookings')}</span><br /><span style={{ fontWeight: 700, color: '#0f172a' }}>{bc[key]}</span></div>
                <div><span style={{ color: '#64748b' }}>{t('admin.sales.revenue', 'Revenue')}</span><br /><span style={{ fontWeight: 700, color: '#0f172a' }}>₹{bc[`${key}_revenue`].toLocaleString()}</span></div>
                <div><span style={{ color: '#64748b' }}>{t('admin.sales.completed', 'Completed')}</span><br /><span style={{ fontWeight: 700, color: '#059669' }}>{bc[`${key}_completed`]}</span></div>
                <div><span style={{ color: '#64748b' }}>{t('admin.sales.upcoming', 'Upcoming')}</span><br /><span style={{ fontWeight: 700, color: '#2563eb' }}>{bc[`${key}_upcoming`]}</span></div>
                <div><span style={{ color: '#64748b' }}>{t('admin.sales.cancelled', 'Cancelled')}</span><br /><span style={{ fontWeight: 700, color: '#dc2626' }}>{bc[`${key}_cancelled`]}</span></div>
                <div><span style={{ color: '#64748b' }}>{t('admin.sales.leads', 'Leads')}</span><br /><span style={{ fontWeight: 700, color: '#8B5CF6' }}>{lc[key]} ({lc[`${key}_converted`]} {t('admin.sales.converted', 'conv')})</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Trend — Bar Chart */}
      <div style={section}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>📊 {t('admin.sales.monthlyTrend', 'Monthly Booking Trend')}</h3>
        {byMonth.length === 0 ? (
          <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: 20 }}>{t('admin.sales.noData', 'No booking data yet')}</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, minHeight: 120 }}>
            {byMonth.map(m => (
              <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>{m.count}</span>
                <div style={{ width: '100%', maxWidth: 40, height: `${(m.count / barMax) * 80}px`, minHeight: 4, borderRadius: '4px 4px 0 0', background: `linear-gradient(to top, #3B82F6, #8B5CF6)`, transition: 'height 0.3s' }} />
                <span style={{ fontSize: 8, color: '#94a3b8', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', marginTop: 2 }}>{m.label}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 10, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: '#64748b' }}>
          <span>📈 {t('admin.sales.total', 'Total')}: {byMonth.reduce((s, m) => s + m.count, 0)} {t('admin.sales.bookings.lower', 'bookings')}</span>
          <span>💰 ₹{byMonth.reduce((s, m) => s + m.revenue, 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div style={section}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>🔄 {t('admin.sales.conversionFunnel', 'Conversion Funnel')}</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {Object.entries(KEYS).map(([key, k]) => {
            const totalLeads = leadCounts[key];
            const totalBookings = bookingCounts[key];
            const completedBookings = bookingCounts[`${key}_completed`];
            const leadRate = totalLeads > 0 ? Math.round((totalBookings / totalLeads) * 100) : 0;
            const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;
            return (
              <div key={key} style={{ padding: 12, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6, color: k.color }}>{k.icon} {k.label}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11 }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{totalLeads}</div>
                    <div style={{ color: '#64748b' }}>{t('admin.sales.leads', 'Leads')}</div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 16 }}>→</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: k.color }}>{leadRate}%</div>
                    <div style={{ color: '#64748b' }}>{t('admin.sales.bookingRate', 'Booking Rate')}</div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 16 }}>→</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{totalBookings}</div>
                    <div style={{ color: '#64748b' }}>{t('admin.sales.bookings', 'Bookings')}</div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 16 }}>→</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#059669' }}>{completionRate}%</div>
                    <div style={{ color: '#64748b' }}>{t('admin.sales.completion', 'Completion')}</div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 16 }}>→</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#059669' }}>{completedBookings}</div>
                    <div style={{ color: '#64748b' }}>{t('admin.sales.done', 'Done')}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div style={section}>
        <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>🔗 {t('admin.sales.quickLinks', 'Quick Links')}</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { path: '/admin/nursing', label: 'Nursing', icon: '👩‍⚕️', color: '#7C3AED' },
            { path: '/admin/vaccination', label: 'Vaccination', icon: '💉', color: '#2563EB' },
            { path: '/admin/physiotherapy', label: 'Physiotherapy', icon: '💪', color: '#0D9488' },
            { path: '/admin/marketing', label: 'Marketing', icon: '📣', color: '#F59E0B' },
            { path: '/admin/crm', label: 'CRM', icon: '🤝', color: '#EC4899' },
          ].map(l => (
            <Link key={l.path} to={l.path} style={{ padding: '8px 16px', borderRadius: 8, background: `${l.color}10`, border: `1px solid ${l.color}30`, color: l.color, textDecoration: 'none', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
