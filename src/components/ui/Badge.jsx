const COLORS = {
  blue: { bg: 'var(--brand-secondary-light, #E8F1FC)', text: 'var(--brand-secondary-dark, #0F4A96)' },
  green: { bg: '#dcfce7', text: '#166534' },
  red: { bg: '#fee2e2', text: '#991b1b' },
  amber: { bg: '#fef3c7', text: '#92400e' },
  purple: { bg: '#f3e8ff', text: '#6b21a8' },
  gray: { bg: '#f3f4f6', text: '#6b7280' },
};

export default function Badge({ children, color = 'blue', size = 'sm', style }) {
  const c = COLORS[color] || COLORS.blue;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius: 20, fontSize: size === 'sm' ? 10 : 12, fontWeight: 600,
      background: c.bg, color: c.text, whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </span>
  );
}
