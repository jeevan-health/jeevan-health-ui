export default function Card({ children, padding = 20, variant = 'default', style, onClick, className }) {
  const isDefault = variant === 'default';
  const isInteractive = variant === 'interactive';
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: 'var(--card-bg, #fff)', borderRadius: 12,
        border: isDefault ? '1px solid var(--border-color, #e5e7eb)' : 'none',
        boxShadow: isDefault ? 'var(--card-shadow, 0 1px 3px rgba(0,0,0,0.06))' : isInteractive ? 'var(--card-shadow-hover, 0 4px 12px rgba(0,0,0,0.1))' : 'none',
        padding, transition: 'all 0.2s', cursor: onClick ? 'pointer' : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardGrid({ children, minWidth = 280, gap = 16, style }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
      gap, ...style,
    }}>
      {children}
    </div>
  );
}
