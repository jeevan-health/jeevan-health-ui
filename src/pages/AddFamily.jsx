import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate('/family')} className="text-gray-500 text-lg">←</button>
        <h1 className="font-semibold text-gray-800">Add Family Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" required />
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Relation</label>
            <select value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm bg-white">
              {relations.map((r) => <option key={r} value={r} className="capitalize">{r}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Gender</label>
            <div className="flex gap-3">
              {genders.map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })} className={`flex-1 py-2 rounded-lg border text-sm capitalize ${form.gender === g ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200 text-gray-400'}`}>{g}</button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 block mb-1">Date of Birth</label>
            <input type="date" value={form.DOB} onChange={(e) => setForm({ ...form, DOB: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
          </div>

          <button type="submit" disabled={loading || !form.name} className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
}
