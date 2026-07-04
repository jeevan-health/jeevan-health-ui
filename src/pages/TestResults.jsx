import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, Flask, CheckCircle, XCircle, Download } from '@phosphor-icons/react';
import { getTestResults } from '../services/diagnosticsService';

export default function TestResults() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestResults(orderId).then(({ data }) => setResults(data)).catch(() => {}).finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/my-test-orders')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Orders
        </button>
        <h1>Test Results</h1>
        <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20 }}>Order #{orderId}</p>

        {loading ? (
          <div className="card p-10 text-center">Loading results...</div>
        ) : results.length === 0 ? (
          <div className="card p-10 text-center">
            <Flask size={40} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-light)' }}>No results available yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {results.map(r => (
              <div key={r.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: r.is_abnormal ? '#fbe9e7' : '#e8f5e9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: r.is_abnormal ? '#c62828' : '#2e7d32',
                  }}>
                    {r.is_abnormal ? <XCircle size={22} weight="fill" /> : <CheckCircle size={22} weight="fill" />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, margin: 0 }}>{r.test_name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
                      {r.is_abnormal ? 'Abnormal — Consult your doctor' : 'Normal range'}
                    </p>
                  </div>
                </div>

                {/* Parameter values */}
                {Object.keys(r.values).length > 0 && (
                  <div style={{ background: '#f5f7fa', borderRadius: 8, padding: 12 }}>
                    {Object.entries(r.values).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, borderBottom: '1px solid #e8ecf0' }}>
                        <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                        <span style={{ fontWeight: 600 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {r.notes && (
                  <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8 }}>Notes: {r.notes}</p>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {r.pdf_url && (
                    <a href={r.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
                      <Download size={14} /> Download Report
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div className="card p-5" style={{ background: '#fff8e1' }}>
              <h3 style={{ fontSize: 14, marginBottom: 8, color: '#e65100' }}>Need to consult a doctor?</h3>
              <p style={{ fontSize: 13, color: 'var(--text-body)', marginBottom: 8 }}>Share these results with a specialist for expert advice.</p>
              <button onClick={() => navigate('/doctor-consultation')} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
                Consult a Doctor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
