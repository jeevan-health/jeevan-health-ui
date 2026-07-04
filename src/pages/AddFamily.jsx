import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, User } from '@phosphor-icons/react';
import { addFamilyMember } from '../services/authService';

const relations = ['spouse', 'child', 'parent', 'sibling', 'other'];
const genders = ['male', 'female', 'other'];

export default function AddFamily() {
  const [form, setForm] = useState({ name: '', relation: 'spouse', DOB: '', gender: 'male' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFamilyMember(form);
      navigate('/family');
    } catch {} finally { setLoading(false); }
  };

  return (
    <div style={{ background: 'var(--cyan-50)', minHeight: '100dvh' }}>
      <div style={{ background: 'linear-gradient(135deg, #0891b2 0%, #066f8f 100%)' }} className="px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/family')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Add Family Member</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 -mt-4">
        <div className="card p-5 flex flex-col gap-5">
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <User size={40} weight="thin" />
            </div>
          </div>

          <div>
            <label>Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Enter name" required />
          </div>

          <div>
            <label>Relation</label>
            <select value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} className="input">
              {relations.map((r) => <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>

          <div>
            <label>Gender</label>
            <div className="flex gap-3 mt-2">
              {genders.map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                  className="flex-1 py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all"
                  style={{
                    borderColor: form.gender === g ? 'var(--primary)' : 'var(--cyan-200)',
                    background: form.gender === g ? 'var(--cyan-50)' : 'white',
                    color: form.gender === g ? 'var(--primary)' : 'var(--text-secondary)',
                  }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Date of Birth</label>
            <input type="date" value={form.DOB} onChange={(e) => setForm({ ...form, DOB: e.target.value })} className="input" />
          </div>

          <button type="submit" disabled={loading || !form.name} className="btn btn-accent w-full">
            {loading ? 'Adding...' : 'Add Member'}
            <Check size={20} weight="bold" />
          </button>
        </div>
      </form>
    </div>
  );
}
