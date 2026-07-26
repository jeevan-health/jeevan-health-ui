import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import {
  adminListTests,
  adminImportExcel,
  adminUpdateTest,
  formatInr,
} from '../../services/diagnosticsService.js';
import './admin-catalog.css';

function isAdminRole(role) {
  return role === 'admin' || role === 'super_admin';
}

export default function AdminCatalog() {
  const { user, isAuthenticated } = useAuthStore();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importMsg, setImportMsg] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      // active=false → admin list includes disabled rows
      const data = await adminListTests({ q: query, limit: 100, active: 'false' });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setTotalActive(data.totalActive || 0);
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated() && isAdminRole(user?.role)) {
      // load all including inactive for admin
      (async () => {
        setLoading(true);
        try {
          const data = await adminListTests({ q: '', limit: 100, active: 'false' });
          setItems(data.items || []);
          setTotal(data.total || 0);
          setTotalActive(data.totalActive || 0);
        } catch (e) {
          setError(e?.response?.data?.error?.message || e.message);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  if (!isAdminRole(user?.role)) {
    return <Navigate to="/admin/login" replace />;
  }

  const onSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminListTests({ q, limit: 100, active: 'false' });
      setItems(data.items || []);
      setTotal(data.total || 0);
      setTotalActive(data.totalActive || 0);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg(null);
    setError(null);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const contentBase64 = btoa(binary);
      const result = await adminImportExcel({
        filename: file.name,
        contentBase64,
      });
      setImportMsg(
        `Imported “${result.filename}”: ${result.upserted} tests upserted` +
          (result.parseErrors?.length ? ` · ${result.parseErrors.length} row warnings` : '') +
          ` · ${result.totalActive} active in catalog`,
      );
      await load(q);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const toggleActive = async (t) => {
    try {
      await adminUpdateTest(t.id, { isActive: !t.isActive });
      await load(q);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message);
    }
  };

  return (
    <div className="admin-cat">
      <div className="admin-cat-hero">
        <div className="container">
          <p className="admin-cat-eyebrow">Admin · Catalog</p>
          <h1>Test catalog</h1>
          <p>
            Active tests: <strong>{totalActive}</strong>
            {total ? ` · Listed: ${total}` : null}
          </p>
        </div>
      </div>

      <div className="container admin-cat-body">
        <section className="admin-card">
          <h2>Upload Excel (non-tech friendly)</h2>
          <p className="admin-hint">
            Use the same workbook format: <strong>JHC Code</strong>, <strong>Final Test Name</strong>,{' '}
            <strong>Hyderabad Market MRP</strong>, <strong>Jeevan Offer Price</strong>. Re-upload anytime
            — rows update by JHC code.
          </p>
          <label className={`admin-upload ${importing ? 'busy' : ''}`}>
            <input
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={onFile}
              disabled={importing}
            />
            {importing ? 'Uploading…' : 'Choose Excel file (.xlsx)'}
          </label>
          {importMsg && <p className="admin-success">{importMsg}</p>}
        </section>

        <form className="admin-search" onSubmit={onSearch}>
          <input
            type="search"
            placeholder="Filter by name or code…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Filter
          </button>
        </form>

        {error && <div className="admin-error">{error}</div>}
        {loading && <p className="admin-hint">Loading…</p>}

        {!loading && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t.id} className={t.isActive ? '' : 'inactive'}>
                    <td className="mono">{t.jhcCode}</td>
                    <td>{t.name}</td>
                    <td>
                      {formatInr(t.price)}
                      {t.marketMrp != null && t.marketMrp > t.price && (
                        <span className="mrp"> {formatInr(t.marketMrp)}</span>
                      )}
                    </td>
                    <td>{t.isActive ? 'Active' : 'Off'}</td>
                    <td>
                      <button type="button" className="linkish" onClick={() => toggleActive(t)}>
                        {t.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!items.length && <p className="admin-hint">No tests yet — upload Excel above.</p>}
          </div>
        )}

        <p className="admin-hint" style={{ marginTop: 20 }}>
          <Link to="/diagnostics">View public catalog →</Link>
        </p>
      </div>
    </div>
  );
}
