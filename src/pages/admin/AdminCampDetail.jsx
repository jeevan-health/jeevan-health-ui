import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as campService from '../../services/campService';
import CampQrCardBuilder, { PATIENT_ORIGIN } from '../../components/admin/CampQrCardBuilder';

/**
 * Single camp: QR card, branding save, registrants list, jump to report upload.
 */
export default function AdminCampDetail() {
  const { id } = useParams();
  const [camp, setCamp] = useState(null);
  const [regs, setRegs] = useState([]);
  const [regTotal, setRegTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('qr'); // qr | people

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [{ data: campData }, { data: regData }] = await Promise.all([
        campService.getCamp(id),
        campService.listRegistrations(id, { limit: 100 }),
      ]);
      setCamp(campData.camp);
      setRegs(regData.registrations || []);
      setRegTotal(regData.total || 0);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load camp');
      setCamp(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (tab !== 'people') return undefined;
    const tmr = setTimeout(async () => {
      try {
        const { data } = await campService.listRegistrations(id, { search: search.trim() || undefined, limit: 100 });
        setRegs(data.registrations || []);
        setRegTotal(data.total || 0);
      } catch {
        /* ignore */
      }
    }, 250);
    return () => clearTimeout(tmr);
  }, [search, tab, id]);

  const campUrl = useMemo(
    () => (camp?.slug ? `${PATIENT_ORIGIN}/camp/${camp.slug}` : `${PATIENT_ORIGIN}/camp`),
    [camp?.slug]
  );

  const saveBranding = async ({ headline, tagline, companyLogo }) => {
    setSaving(true);
    setError('');
    try {
      const { data } = await campService.updateCamp(id, {
        headline,
        tagline,
        companyLogo: companyLogo || '',
      });
      setCamp(data.camp);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (status) => {
    try {
      const { data } = await campService.updateCamp(id, { status });
      setCamp(data.camp);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading camp…</p>;
  if (!camp) {
    return (
      <div>
        <p style={{ color: '#b91c1c' }}>{error || 'Camp not found'}</p>
        <Link to="/admin/camps">← All camps</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link to="/admin/camps" style={{ fontSize: 12, color: '#1866C9' }}>← All camps</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>🏕️ {camp.name}</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            {camp.location || 'No location'} · status <strong>{camp.status}</strong>
            {' · '}👥 {camp.registrationCount ?? regTotal} registered
            {' · '}📄 {camp.reportCount ?? 0} reports
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#1866C9', wordBreak: 'break-all' }}>
            {campUrl}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Link
            to={`/admin/lab-reports?campId=${camp.id}`}
            className="btn btn-primary btn-sm"
          >
            Upload reports for this camp →
          </Link>
          {camp.status === 'active' ? (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus('ended')}>
              Mark ended
            </button>
          ) : (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus('active')}>
              Re-open active
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: 10, background: '#FEF2F2', color: '#b91c1c', borderRadius: 8, fontSize: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button
          type="button"
          className={tab === 'qr' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          onClick={() => setTab('qr')}
        >
          QR card
        </button>
        <button
          type="button"
          className={tab === 'people' ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
          onClick={() => setTab('people')}
        >
          Registrants ({regTotal})
        </button>
      </div>

      {tab === 'qr' && (
        <CampQrCardBuilder
          campUrl={campUrl}
          headline={camp.headline}
          tagline={camp.tagline}
          companyLogo={camp.companyLogo}
          downloadName={`jeevan-camp-${camp.slug}`}
          showSave
          saving={saving}
          onSave={saveBranding}
        />
      )}

      {tab === 'people' && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Registered patients</h3>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email / phone / name"
              style={{
                padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13,
                minWidth: 220, fontFamily: 'inherit',
              }}
            />
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: '#94a3b8' }}>
            These users are full Jeevan customers (in your user base) and linked to this camp for easy report upload.
          </p>
          {regs.length === 0 && (
            <p style={{ fontSize: 13, color: '#94a3b8' }}>No registrations yet. Share the QR card at the booth.</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
            {regs.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: 12, borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12,
                  display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{r.name || '—'}</div>
                  <div style={{ color: '#64748b' }}>{r.email || 'no email'} · {r.phone || 'no phone'}</div>
                </div>
                <div style={{ color: '#94a3b8', textAlign: 'right' }}>
                  {r.registeredAt ? new Date(r.registeredAt).toLocaleString('en-IN') : ''}
                  <div>
                    <Link
                      to={`/admin/lab-reports?campId=${camp.id}&userId=${r.userId}&email=${encodeURIComponent(r.email || '')}`}
                      style={{ color: '#1866C9' }}
                    >
                      Upload report →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
