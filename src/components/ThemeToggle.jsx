import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ style }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 9998,
        width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border-color, #e5e7eb)',
        background: 'var(--card-bg, #fff)', color: 'var(--text-primary, #111827)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontFamily: 'inherit',
        transition: 'all 0.2s', ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
