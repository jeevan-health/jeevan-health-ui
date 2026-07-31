import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import InstallAppButton from '../components/InstallAppButton.jsx';
import EnablePushButton from '../components/EnablePushButton.jsx';
import { listFamily, addFamilyMember, removeFamilyMember } from '../services/familyService.js';
import './page-shell.css';
import './dashboard.css';

const HUB = [
  {
    to: '/my-orders',
    title: 'My Bookings',
    desc: 'Track home collection orders',
    icon: '📅',
  },
  {
    to: '/reports',
    title: 'Reports',
    desc: 'Download digital lab PDFs',
    icon: '📄',
  },
  {
    to: '/diagnostics',
    title: 'Book tests',
    desc: 'Search catalog and add to cart',
    icon: '🔬',
  },
  {
    to: '/upload-prescription',
    title: 'Prescriptions',
    desc: 'Upload flow coming soon — book via catalog',
    icon: '📋',
  },
  {
    to: '/health-concerns',
    title: 'Health concerns',
    desc: 'Browse by common health topics',
    icon: '💚',
  },
  {
    to: '/checkout',
    title: 'Cart & checkout',
    desc: 'Complete an open booking',
    icon: '🛒',
  },
];

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [familyError, setFamilyError] = useState(null);
  const [familyBusy, setFamilyBusy] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', gender: '', relation: '' });

  const loadFamily = useCallback(async () => {
    try {
      setFamilyError(null);
      const list = await listFamily();
      setMembers(list || []);
    } catch (e) {
      setFamilyError(e?.response?.data?.error?.message || e.message || 'Could not load family');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) loadFamily();
  }, [isAuthenticated, loadFamily]);

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace />;
  }

  const first = user?.name?.split(' ')[0];

  const onAddFamily = async (e) => {
    e.preventDefault();
    setFamilyBusy(true);
    setFamilyError(null);
    try {
      await addFamilyMember({
        name: form.name.trim(),
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        relation: form.relation || undefined,
      });
      setForm({ name: '', age: '', gender: '', relation: '' });
      setShowAdd(false);
      await loadFamily();
    } catch (err) {
      setFamilyError(err?.response?.data?.error?.message || err.message || 'Add failed');
    } finally {
      setFamilyBusy(false);
    }
  };

  const onRemove = async (id) => {
    if (!window.confirm('Remove this family member?')) return;
    setFamilyBusy(true);
    try {
      await removeFamilyMember(id);
      await loadFamily();
    } catch (err) {
      setFamilyError(err?.response?.data?.error?.message || err.message || 'Remove failed');
    } finally {
      setFamilyBusy(false);
    }
  };

  return (
    <div className="page-shell dash">
      <div className="dash-welcome">
        <div className="dash-avatar" aria-hidden>
          {(first || user?.phone || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1>My Health</h1>
          <p>Hello{first ? `, ${first}` : ''} — your Jeevan account hub</p>
        </div>
      </div>

      <div className="dash-card">
        <h2>Profile</h2>
        <dl className="dash-dl">
          <div>
            <dt>Name</dt>
            <dd>{user?.name || '—'}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user?.phone || '—'}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email || '—'}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd className="dash-role">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="dash-card">
        <h2>Quick links</h2>
        <ul className="dash-hub">
          {HUB.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="dash-hub-item">
                <span className="dash-hub-icon" aria-hidden>
                  {item.icon}
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <span className="dash-hub-desc">{item.desc}</span>
                </span>
                <span className="dash-hub-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="dash-card">
        <div className="dash-card-head">
          <h2>Family members</h2>
          <button type="button" className="dash-link-btn" onClick={() => setShowAdd((v) => !v)}>
            {showAdd ? 'Cancel' : 'Add'}
          </button>
        </div>
        {familyError ? <p className="dash-error">{familyError}</p> : null}
        {showAdd ? (
          <form className="dash-family-form" onSubmit={onAddFamily}>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div className="dash-family-row">
              <input
                type="number"
                min="0"
                max="120"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
              <select
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input
              placeholder="Relation (e.g. Spouse, Child)"
              value={form.relation}
              onChange={(e) => setForm((f) => ({ ...f, relation: e.target.value }))}
            />
            <button type="submit" className="btn btn-primary" disabled={familyBusy}>
              {familyBusy ? 'Saving…' : 'Save member'}
            </button>
          </form>
        ) : null}
        {members.length === 0 ? (
          <p className="dash-muted">No family members yet. Add someone to book tests for them at checkout.</p>
        ) : (
          <ul className="dash-family-list">
            {members.map((m) => (
              <li key={m.id}>
                <div>
                  <strong>{m.name}</strong>
                  <span>
                    {[m.relation, m.age != null ? `${m.age}y` : null, m.gender]
                      .filter(Boolean)
                      .join(' · ') || 'Member'}
                  </span>
                </div>
                <button type="button" className="dash-link-btn danger" onClick={() => onRemove(m.id)} disabled={familyBusy}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dash-card">
        <h2>Payments & addresses</h2>
        <p className="dash-muted">
          Payment gateway is parked — pay cash/card on collection or leave online as pending.
          Saved address book is on the roadmap; enter address at checkout today.
        </p>
      </div>

      <div className="dash-actions">
        <InstallAppButton variant="block" />
        <EnablePushButton variant="block" />
        {(user?.role === 'admin' || user?.role === 'super_admin') && (
          <Link to="/admin/orders" className="btn btn-outline-dark">
            Admin orders
          </Link>
        )}
        <button type="button" className="btn btn-outline-dark" onClick={() => logout()}>
          Log out
        </button>
      </div>
    </div>
  );
}
