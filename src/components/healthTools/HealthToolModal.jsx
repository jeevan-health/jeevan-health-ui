export default function HealthToolModal({ open, onClose, title, icon, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      overflowY: 'auto',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #e8edf2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#f8f9fa', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
              padding: 0, lineHeight: 1,
            }}>←</button>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{title}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          {children}
        </div>

        {/* Disclaimer */}
        <div style={{
          padding: '12px 20px', background: '#fef9c3', borderTop: '1px solid #fde68a',
          fontSize: 11, color: '#92400e', lineHeight: 1.4,
        }}>
          ⚕️ This tool provides wellness guidance and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
        </div>
      </div>
    </div>
  );
}
