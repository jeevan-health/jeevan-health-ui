import { useTheme } from '../context/ThemeContext';

/**
 * Desktop floating theme control. Hidden on mobile (≤768px) so it never
 * covers the bottom nav Home tab — mobile uses the header control instead.
 */
export default function ThemeToggle({ style }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      type="button"
      className="theme-fab"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 40,
        width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--border-color, #e5e7eb)',
        background: 'var(--card-bg, #fff)', color: 'var(--text-primary, #111827)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.12)', fontFamily: 'inherit',
        transition: 'transform 0.15s, box-shadow 0.15s', ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {isDark ? '☀️' : '🌙'}
      <style>{`
        @media (max-width: 768px) {
          .theme-fab { display: none !important; }
        }
      `}</style>
    </button>
  );
}
