const VARIANTS = {
  primary: { bg: 'var(--brand-secondary, #1866C9)', color: '#fff', hoverBg: 'var(--brand-secondary-dark, #0F4A96)' },
  secondary: { bg: 'var(--brand-primary, #00D9FF)', color: '#0F4A96', hoverBg: 'var(--brand-primary-dark, #00B8D6)' },
  outline: { bg: 'transparent', color: 'var(--brand-secondary, #1866C9)', border: '1.5px solid var(--brand-secondary, #1866C9)', hoverBg: 'var(--brand-secondary-light, #E8F1FC)' },
  ghost: { bg: 'transparent', color: 'var(--text-secondary, #6b7280)', hoverBg: '#f3f4f6' },
  danger: { bg: 'var(--danger, #EF4444)', color: '#fff', hoverBg: '#dc2626' },
};

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 11 },
  md: { padding: '8px 18px', fontSize: 13 },
  lg: { padding: '12px 24px', fontSize: 15 },
};

export default function Button({ variant = 'primary', size = 'md', children, onClick, type = 'button', disabled, style, className, ...props }) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: s.padding, fontSize: s.fontSize, fontWeight: 600, fontFamily: 'inherit',
        borderRadius: 8, border: v.border || 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        background: disabled ? '#e5e7eb' : v.bg, color: disabled ? '#9ca3af' : v.color,
        opacity: disabled ? 0.6 : 1, transition: 'all 0.15s', whiteSpace: 'nowrap', ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = v.hoverBg; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = v.bg; }}
      {...props}
    >
      {children}
    </button>
  );
}
