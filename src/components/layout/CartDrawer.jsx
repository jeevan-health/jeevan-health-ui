import { Link } from 'react-router-dom';
import useCartStore from '../../stores/cartStore.js';
import { formatInr } from '../../services/ordersService.js';
import './cart-drawer.css';

export default function CartDrawer() {
  const open = useCartStore((s) => s.drawerOpen);
  const setDrawerOpen = useCartStore((s) => s.setDrawerOpen);
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.subtotal());

  if (!open) return null;

  return (
    <div className="cart-drawer-root">
      <button type="button" className="cart-drawer-backdrop" aria-label="Close cart" onClick={() => setDrawerOpen(false)} />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <header className="cart-drawer-head">
          <h2>Your cart ({items.length})</h2>
          <button type="button" className="cart-drawer-x" onClick={() => setDrawerOpen(false)} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">
              <p>Your cart is empty</p>
              <Link to="/diagnostics" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>
                Browse tests
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer-list">
              {items.map((i) => (
                <li key={i.testId}>
                  <div>
                    <strong>{i.name}</strong>
                    <span className="code">{i.jhcCode}</span>
                  </div>
                  <div className="cart-drawer-line">
                    <div className="qty-stepper">
                      <button
                        type="button"
                        onClick={() => {
                          if (i.quantity <= 1) remove(i.testId);
                          else setQty(i.testId, i.quantity - 1);
                        }}
                      >
                        −
                      </button>
                      <span>{i.quantity}</span>
                      <button type="button" onClick={() => setQty(i.testId, i.quantity + 1)}>
                        +
                      </button>
                    </div>
                    <span className="line-price">{formatInr(i.price * i.quantity)}</span>
                    <button type="button" className="line-remove" onClick={() => remove(i.testId)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-drawer-foot">
            <div className="cart-drawer-sum">
              <span>Subtotal</span>
              <strong>{formatInr(subtotal)}</strong>
            </div>
            <div className="cart-drawer-sum free">
              <span>Home collection</span>
              <span>FREE</span>
            </div>
            <div className="cart-drawer-sum total">
              <span>Total</span>
              <strong>{formatInr(subtotal)}</strong>
            </div>
            <div className="cart-drawer-actions">
              <Link to="/diagnostics" className="btn btn-outline-dark" onClick={() => setDrawerOpen(false)}>
                Add more
              </Link>
              <Link to="/checkout" className="btn btn-primary" onClick={() => setDrawerOpen(false)}>
                Proceed to book →
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
