export default function LoadingSpinner({ text = 'Loading...', size = 40 }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: '80px 16px', color: '#6b7280',
    }}>
      <div style={{
        width: size, height: size, border: `3px solid #e5e7eb`, borderTopColor: '#1866C9',
        borderRadius: '50%', animation: 'spinnerRotate 0.7s linear infinite',
      }} />
      {text && <div style={{ fontSize: 13, fontWeight: 500 }}>{text}</div>}
      <style>{`
        @keyframes spinnerRotate { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
