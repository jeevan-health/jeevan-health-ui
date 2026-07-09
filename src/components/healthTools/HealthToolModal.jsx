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
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{title}</span>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#f1f5f9', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
          }}>✕</button>
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
