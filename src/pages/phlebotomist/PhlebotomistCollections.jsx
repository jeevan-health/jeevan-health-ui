import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as phlebotomistService from '../../services/phlebotomistService';
import { notify } from '../../lib/toastBus';

const card = {
  background: '#fff',
  borderRadius: 12,
  padding: 14,
  border: '1px solid #e2e8f0',
  marginBottom: 10,
  boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
};

const field = {
  width: '100%',
  padding: '12px 12px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 16, // prevents iOS zoom
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  background: '#fff',
};

const label = {
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  display: 'block',
  marginBottom: 6,
};

function getGeo() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({});
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve({}),
      { timeout: 8000 }
    );
  });
}

const statusColor = (s) => {
  if (s === 'sample_collected') return { bg: '#dcfce7', color: '#166534' };
  if (s === 'failed' || s === 'cancelled' || s === 'sample_rejected') return { bg: '#fee2e2', color: '#991b1b' };
  if (s === 'patient_verified' || s === 'reached') return { bg: '#dbeafe', color: '#1e40af' };
  return { bg: '#fef3c7', color: '#92400e' };
};

export default function PhlebotomistCollections() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState('');

  // Sample collect
  const [sample, setSample] = useState({
    tubeType: '',
    barcode: '',
    sampleType: 'Blood',
    barcodeOverrideNote: '',
  });

  // H2 verification
  const [confirmName, setConfirmName] = useState(false);
  const [confirmIdentity, setConfirmIdentity] = useState(false);
  const [phoneLast4, setPhoneLast4] = useState('');
  const [typedName, setTypedName] = useState('');
  const [fastingStatus, setFastingStatus] = useState('');
  const [lastMealHours, setLastMealHours] = useState('');
  const [fastingNotes, setFastingNotes] = useState('');

  const loadList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await phlebotomistService.listJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadJob = useCallback(async (id) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await phlebotomistService.getJob(id);
      setJob(data.job);
      // Prefill verify if already done
      if (data.job?.lastFasting?.status) setFastingStatus(data.job.lastFasting.status);
    } catch (err) {
      setError(err?.response?.data?.error || 'Job not found');
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) loadJob(orderId);
    else loadList();
  }, [orderId, loadJob, loadList]);

  const allowedNext = useMemo(() => new Set(job?.allowedNext || []), [job]);
  const isTerminal = !!job?.isTerminal;

  const validateClient = (status) => {
    if (status === 'patient_verified') {
      if (!confirmName) return 'Tick “Patient name matches booking”';
      if (!confirmIdentity) return 'Tick “Identity confirmed (name/age)”';
      if (job?.phoneLast4Hint && phoneLast4.replace(/\D/g, '').length !== 4) {
        return 'Enter last 4 digits of patient phone';
      }
      if (!fastingStatus) return 'Select a fasting checklist option';
      if (job?.fastingLikely && fastingStatus === 'not_required' && !String(fastingNotes || notes).trim()) {
        return 'Tests may need fasting — confirm fasting OK / non-fasting, or add a note';
      }
    }
    if (status === 'sample_collected') {
      const barcode = String(sample.barcode || '').trim();
      const override = String(sample.barcodeOverrideNote || notes || '').trim();
      if (!barcode && override.length < 5) {
        return 'Enter barcode, or a reason (5+ chars) if barcode unavailable';
      }
    }
    if (['failed', 'sample_rejected', 'cancelled'].includes(status)) {
      if (String(notes || '').trim().length < 3) {
        return 'Add a short reason (min 3 characters)';
      }
    }
    return null;
  };

  const setStatus = async (status) => {
    if (!job) return;
    if (!allowedNext.has(status)) {
      notify.error(`Cannot set "${status.replace(/_/g, ' ')}" from current status`);
      return;
    }
    const clientErr = validateClient(status);
    if (clientErr) {
      notify.error(clientErr);
      return;
    }

    setBusy(true);
    try {
      const geo = await getGeo();
      const body = {
        status,
        ...geo,
        notes: notes || undefined,
      };

      if (status === 'patient_verified') {
        body.verification = {
          confirmedName: true,
          confirmedIdentity: true,
          phoneLast4: phoneLast4.replace(/\D/g, '').slice(-4) || undefined,
          nameMatch: typedName.trim() || undefined,
        };
        body.fasting = {
          status: fastingStatus,
          lastMealHours: lastMealHours !== '' ? Number(lastMealHours) : undefined,
          notes: fastingNotes || notes || undefined,
        };
        body.sampleData = {
          verification: body.verification,
          fasting: body.fasting,
        };
      }

      if (status === 'sample_collected') {
        body.sampleData = {
          sampleType: sample.sampleType || 'Blood',
          tubeType: sample.tubeType || undefined,
          barcode: sample.barcode || undefined,
          barcodeOverrideNote: sample.barcodeOverrideNote || undefined,
        };
      }

      if (['failed', 'sample_rejected', 'cancelled'].includes(status)) {
        body.sampleData = {
          failReason: notes,
          reason: notes,
        };
      }

      const { data } = await phlebotomistService.updateJobStatus(job.id, body);
      setJob(data.job);
      notify.success(`Updated → ${status.replace(/_/g, ' ')}`);
      if (['failed', 'sample_rejected', 'cancelled', 'sample_collected'].includes(status)) {
        setNotes('');
      }
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Loading…</div>;
  if (error && !job && orderId) {
    return (
      <div style={card}>
        <p style={{ color: '#b91c1c', margin: '0 0 12px' }}>{error}</p>
        <button
          type="button"
          onClick={() => navigate('/phlebotomist/collections')}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #e2e8f0',
            background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, minHeight: 44,
          }}
        >
          ← Back to list
        </button>
      </div>
    );
  }

  // Detail view
  if (orderId && job) {
    const sc = statusColor(job.phleboStatus);
    const forward = (phlebotomistService.JOB_STATUSES || []).filter((s) => allowedNext.has(s.value));
    const close = (phlebotomistService.CLOSE_STATUSES || []).filter((s) => allowedNext.has(s.value));
    const showVerify = allowedNext.has('patient_verified') || job.phleboStatus === 'patient_verified';
    const showSample = allowedNext.has('sample_collected') || job.phleboStatus === 'sample_collected';

    return (
      <div>
        <button
          type="button"
          onClick={() => navigate('/phlebotomist/collections')}
          style={{
            background: '#fff', border: '1px solid #e2e8f0', color: '#475569', cursor: 'pointer',
            marginBottom: 12, fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
            padding: '10px 14px', borderRadius: 10, minHeight: 40,
          }}
        >
          ← All collections
        </button>

        <div style={card}>
          <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 0.3, fontWeight: 600 }}>
            {job.displayOrderId || `ORD-${job.id}`}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 6px', color: '#0f172a', lineHeight: 1.25 }}>
            {job.patientName}
          </h2>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.45 }}>
            {[
              job.patientAge != null && job.patientAge !== '' ? `${job.patientAge} yrs` : null,
              job.patientGender || null,
              job.patientPhone || null,
            ].filter(Boolean).join(' · ') || 'Age / gender not on booking'}
            {(!job.patientAge || job.patientAge === '') && (
              <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>Age not provided on booking — confirm with patient</div>
            )}
            {!job.patientGender && (
              <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>Gender not provided — confirm with patient</div>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#0f172a' }}>{job.testLabel}</div>
          {job.fastingLikely && (
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#9a3412', background: '#fff7ed',
              border: '1px solid #fed7aa', borderRadius: 8, padding: '8px 10px', marginBottom: 10,
            }}
            >
              ⚠️ Tests may require fasting — complete checklist before verify
            </div>
          )}
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>
            📅 {job.collectionDate ? new Date(job.collectionDate).toLocaleDateString('en-IN') : '—'} · 🕘 {job.collectionTime || '—'}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.45, wordBreak: 'break-word' }}>
            📍 {job.address}
          </div>
          <div style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, color: sc.color,
            background: sc.bg, padding: '4px 10px', borderRadius: 999, textTransform: 'capitalize',
            marginBottom: 12,
          }}
          >
            {(job.phleboStatus || job.orderStatus || '—').replace(/_/g, ' ')}
          </div>

          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr' }}>
            {job.mapsUrl && (
              <a
                href={job.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textAlign: 'center', padding: '14px 12px', borderRadius: 10,
                  background: '#eff6ff', color: '#1d4ed8', fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', minHeight: 48, boxSizing: 'border-box',
                }}
              >
                🗺️ Navigate in Google Maps
              </a>
            )}
            {job.patientPhone && (
              <a
                href={`tel:${job.patientPhone}`}
                style={{
                  display: 'block', textAlign: 'center', padding: '14px 12px', borderRadius: 10,
                  background: '#f0fdf4', color: '#166534', fontSize: 14, fontWeight: 700,
                  textDecoration: 'none', minHeight: 48, boxSizing: 'border-box',
                }}
              >
                📞 Call patient
              </a>
            )}
          </div>
        </div>

        {/* Payment summary for doorstep collection */}
        <div style={{ ...card, borderColor: (job.balanceAmount ?? job.payment?.balanceAmount) > 0 ? '#fcd34d' : '#bbf7d0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>💳 Payment summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4px 10px', fontSize: 13 }}>
            <span style={{ color: '#64748b' }}>Package amount</span>
            <strong>₹{Number(job.grossAmount ?? job.payment?.grossAmount ?? job.totalAmount || 0).toLocaleString('en-IN')}</strong>
            {(job.discountAmount ?? job.payment?.discountAmount) > 0 && (
              <>
                <span style={{ color: '#64748b' }}>Discount</span>
                <strong style={{ color: '#166534' }}>− ₹{Number(job.discountAmount ?? job.payment?.discountAmount || 0).toLocaleString('en-IN')}</strong>
              </>
            )}
            <span style={{ color: '#64748b' }}>Final payable</span>
            <strong>₹{Number(job.totalAmount || 0).toLocaleString('en-IN')}</strong>
            <span style={{ color: '#64748b' }}>Paid</span>
            <strong>₹{Number(job.paidAmount ?? job.payment?.paidAmount || 0).toLocaleString('en-IN')}</strong>
            <span style={{ color: '#64748b' }}>Balance due</span>
            <strong style={{ color: (job.balanceAmount ?? job.payment?.balanceAmount) > 0 ? '#b45309' : '#166534' }}>
              ₹{Number(job.balanceAmount ?? job.payment?.balanceAmount || 0).toLocaleString('en-IN')}
            </strong>
          </div>
          <div style={{
            marginTop: 10, fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
            color: (job.balanceAmount ?? job.payment?.balanceAmount) > 0 ? '#92400e' : '#166534',
            background: (job.balanceAmount ?? job.payment?.balanceAmount) > 0 ? '#fffbeb' : '#f0fdf4',
            padding: '8px 10px', borderRadius: 8,
          }}
          >
            {(job.balanceAmount ?? job.payment?.balanceAmount) > 0
              ? `Collect ₹${Number(job.balanceAmount ?? job.payment?.balanceAmount || 0).toLocaleString('en-IN')} at doorstep (Cash / UPI / Card)`
              : '✓ Paid — no collection needed'}
          </div>
        </div>

        {/* Sample collection plan from test/package names */}
        {job.samplePlan?.tubesSummary?.length > 0 && (
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>🧪 Sample collection plan</h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px' }}>
              Tests: {job.samplePlan.totals?.testCount || job.tests?.length || 0}
              {' · '}Blood tubes: {job.samplePlan.totals?.bloodTubes || 0}
              {' · '}Urine: {job.samplePlan.totals?.urineContainers || 0}
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {job.samplePlan.tubesSummary.map((t) => (
                <div
                  key={t.tubeKey}
                  style={{
                    padding: '10px 12px', borderRadius: 10, background: '#f8fafc',
                    border: '1px solid #e2e8f0', fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {t.container || t.tube}
                    <span style={{ fontWeight: 600, color: '#64748b' }}> × {t.tubesNeeded || 1}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    {t.sampleType}{t.qtyMl ? ` · ~${t.qtyMl} ml` : ''}
                  </div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 4, lineHeight: 1.35 }}>
                    {(t.tests || []).slice(0, 6).join(', ')}
                    {(t.tests || []).length > 6 ? ` +${t.tests.length - 6} more` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* H2 Patient verification + fasting — shown when next step or current */}
        {showVerify && !isTerminal && (
          <div style={{ ...card, borderColor: allowedNext.has('patient_verified') ? '#99f6e4' : '#e2e8f0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>
              🪪 Patient verification
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 }}>
              Confirm identity against booking before draw. Required to mark patient verified.
            </p>

            <label style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10,
              fontSize: 14, color: '#0f172a', cursor: 'pointer', lineHeight: 1.35,
            }}
            >
              <input
                type="checkbox"
                checked={confirmName}
                onChange={(e) => setConfirmName(e.target.checked)}
                style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }}
              />
              <span>
                Patient name matches booking
                <span style={{ display: 'block', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  Booked as: <strong>{job.patientName}</strong>
                </span>
              </span>
            </label>

            <label style={{
              display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12,
              fontSize: 14, color: '#0f172a', cursor: 'pointer', lineHeight: 1.35,
            }}
            >
              <input
                type="checkbox"
                checked={confirmIdentity}
                onChange={(e) => setConfirmIdentity(e.target.checked)}
                style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }}
              />
              <span>
                Identity confirmed (name / age / gender match person present)
                <span style={{ display: 'block', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  Age on booking: {job.patientAge != null && job.patientAge !== '' ? `${job.patientAge} yrs` : 'not provided — confirm verbally'}
                  {job.patientGender ? ` · Gender: ${job.patientGender}` : ' · Gender: confirm verbally'}
                </span>
              </span>
            </label>

            {job.phoneLast4Hint && (
              <div style={{ marginBottom: 12 }}>
                <label style={label}>Last 4 digits of patient phone</label>
                <input
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  value={phoneLast4}
                  onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={field}
                  autoComplete="one-time-code"
                />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={label}>Type patient first name (optional double-check)</label>
              <input
                placeholder="Optional"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                style={field}
              />
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>
              🍽️ Fasting checklist
            </h4>
            <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
              {(phlebotomistService.FASTING_OPTIONS || []).map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px',
                    borderRadius: 10, border: fastingStatus === opt.value ? '2px solid #0d9488' : '1px solid #e2e8f0',
                    background: fastingStatus === opt.value ? '#f0fdfa' : '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a',
                  }}
                >
                  <input
                    type="radio"
                    name="fasting"
                    checked={fastingStatus === opt.value}
                    onChange={() => setFastingStatus(opt.value)}
                    style={{ width: 18, height: 18 }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={label}>Hours since last meal (optional)</label>
              <input
                inputMode="decimal"
                placeholder="e.g. 10"
                value={lastMealHours}
                onChange={(e) => setLastMealHours(e.target.value)}
                style={field}
              />
            </div>
            <div>
              <label style={label}>Fasting notes (required if “not required” on fasting-like tests)</label>
              <textarea
                placeholder="e.g. Doctor advised non-fasting lipid"
                value={fastingNotes}
                onChange={(e) => setFastingNotes(e.target.value)}
                style={{ ...field, minHeight: 64, resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Sample details — for collect step */}
        {showSample && !isTerminal && (
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Sample details</h3>
            <div style={{ display: 'grid', gap: 10, marginBottom: 4 }}>
              <div>
                <label style={label}>Sample type</label>
                <input
                  placeholder="Blood"
                  value={sample.sampleType}
                  onChange={(e) => setSample((s) => ({ ...s, sampleType: e.target.value }))}
                  style={field}
                />
              </div>
              <div>
                <label style={label}>Tube type</label>
                <input
                  placeholder="e.g. Purple EDTA"
                  value={sample.tubeType}
                  onChange={(e) => setSample((s) => ({ ...s, tubeType: e.target.value }))}
                  style={field}
                />
              </div>
              <div>
                <label style={label}>Barcode (required unless override)</label>
                <input
                  placeholder="Scan or type barcode"
                  value={sample.barcode}
                  onChange={(e) => setSample((s) => ({ ...s, barcode: e.target.value }))}
                  style={field}
                  autoCapitalize="characters"
                />
              </div>
              <div>
                <label style={label}>No barcode? Reason (min 5 chars)</label>
                <input
                  placeholder="e.g. Label printer down — written on tube"
                  value={sample.barcodeOverrideNote}
                  onChange={(e) => setSample((s) => ({ ...s, barcodeOverrideNote: e.target.value }))}
                  style={field}
                />
              </div>
            </div>
          </div>
        )}

        {/* Notes always for fail/cancel */}
        <div style={card}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Notes</h3>
          <textarea
            placeholder="Required for failed / rejected / cancelled. Optional otherwise."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ ...field, minHeight: 72, resize: 'vertical' }}
          />
        </div>

        <div style={card}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Update status</h3>
          {isTerminal && (
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 8px' }}>
              This job is closed. No further field updates.
            </p>
          )}
          {!isTerminal && forward.length === 0 && close.length === 0 && (
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>No actions available.</p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {forward.map((s) => {
              const active = job.phleboStatus === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  disabled={busy}
                  onClick={() => setStatus(s.value)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 10,
                    border: active ? 'none' : '1px solid #e2e8f0',
                    cursor: busy ? 'wait' : 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'inherit',
                    background: active ? '#0d9488' : s.value === 'sample_collected' ? '#059669' : '#fff',
                    color: active || s.value === 'sample_collected' ? '#fff' : '#334155',
                    minHeight: 48,
                    lineHeight: 1.25,
                    gridColumn: s.value === 'sample_collected' || s.value === 'patient_verified' ? '1 / -1' : undefined,
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
          {close.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '14px 0 8px', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                Close job
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
                {close.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    disabled={busy}
                    onClick={() => setStatus(s.value)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 10,
                      border: '1px solid #fecaca',
                      cursor: busy ? 'wait' : 'pointer',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      background: '#fff',
                      color: '#b91c1c',
                      minHeight: 44,
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {job.events?.length > 0 && (
          <div style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Timeline</h3>
            {job.events.map((e) => (
              <div key={e.id} style={{ fontSize: 12, padding: '8px 0', borderBottom: '1px solid #f1f5f9', color: '#475569', lineHeight: 1.4 }}>
                <strong style={{ textTransform: 'capitalize' }}>{String(e.status || '').replace(/_/g, ' ')}</strong>
                {' · '}
                {e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : ''}
                {e.notes ? ` — ${e.notes}` : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // List
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>🧪 My collections</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>{jobs.length} assigned job(s)</p>
      {error && <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>{error}</div>}
      {jobs.length === 0 && !error && (
        <div style={{ ...card, textAlign: 'center', color: '#94a3b8', padding: 24 }}>
          No jobs assigned yet. Admin assigns diagnostic orders to you.
        </div>
      )}
      {jobs.map((j) => {
        const sc = statusColor(j.phleboStatus);
        return (
          <Link key={j.id} to={`/phlebotomist/collections/${j.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{j.patientName}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{j.testLabel}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                    {j.displayOrderId || `ORD-${j.id}`} · {j.collectionDate ? new Date(j.collectionDate).toLocaleDateString('en-IN') : '—'} {j.collectionTime || ''}
                  </div>
                </div>
                <span style={{
                  flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'capitalize',
                  color: sc.color, background: sc.bg, padding: '4px 8px', borderRadius: 6,
                  maxWidth: 90, textAlign: 'center', lineHeight: 1.2,
                }}
                >
                  {(j.phleboStatus || j.orderStatus || '').replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
