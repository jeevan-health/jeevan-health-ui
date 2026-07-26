import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/diagnostics', label: 'Tests', icon: '🔬' },
  { to: '/signup', label: 'Account', icon: '👤' },
  { to: '/diagnostics', label: 'Book', icon: '📅', state: { book: true } },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive && item.label !== 'Book' ? 'active' : undefined)}
        >
          <span className="nav-icon" aria-hidden>
            {item.icon}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
