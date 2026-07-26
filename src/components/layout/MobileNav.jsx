import { NavLink } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);

  const items = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/diagnostics', label: 'Tests', icon: '🔬' },
    { to: user ? '/dashboard' : '/signup', label: 'Bookings', icon: '📅' },
    { to: '/diagnostics', label: 'Health', icon: '💚' },
    { to: user ? '/dashboard' : '/signup', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item, i) => (
        <NavLink
          key={`${item.label}-${i}`}
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive && item.end ? 'active' : isActive && !item.end && item.label !== 'Health' ? 'active' : undefined)}
        >
          <span className="nav-icon-wrap" aria-hidden>
            {item.icon}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
