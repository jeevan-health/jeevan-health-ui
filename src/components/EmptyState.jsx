export default function EmptyState({ icon = '', title = 'No data found', message = '', action, style }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', textAlign: 'center', ...style,
    }}>
      {icon && <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.7 }}>{icon}</div>}
      <div style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{title}</div>
      {message && <div style={{ fontSize: 13, color: '#9ca3af', maxWidth: 300, lineHeight: 1.5, marginBottom: action ? 16 : 0 }}>{message}</div>}
      {action && (
        <button onClick={action.onClick} style={{
          padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>{action.label}</button>
      )}
    </div>
  );
}
