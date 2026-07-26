import { NavLink } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);
  const items = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/diagnostics', label: 'Tests', icon: '🔬' },
    user
      ? { to: '/dashboard', label: 'Account', icon: '👤' }
      : { to: '/signup', label: 'Login', icon: '🔑' },
    { to: '/diagnostics', label: 'Book', icon: '📅' },
  ];

  return (
    <nav className="mobile-nav" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
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
