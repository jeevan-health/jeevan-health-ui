import { NavLink } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import useCartStore from '../../stores/cartStore.js';

export default function MobileNav() {
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.count());

  const items = [
    { to: '/', label: 'Home', icon: '🏠', end: true },
    { to: '/diagnostics', label: 'Tests', icon: '🔬' },
    {
      to: user ? '/my-orders' : '/signup',
      label: 'Orders',
      icon: '📅',
    },
    {
      to: user ? '/reports' : '/signup',
      label: 'Reports',
      icon: '📄',
    },
    {
      to: '/checkout',
      label: cartCount > 0 ? `Cart (${cartCount})` : 'Cart',
      icon: '🛒',
    },
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
