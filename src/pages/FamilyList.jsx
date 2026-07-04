import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFamilyMembers, deleteFamilyMember } from '../services/authService';

export default function FamilyList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadMembers = async () => {
    try {
      const { data } = await getFamilyMembers();
      setMembers(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remove this family member?')) return;
    await deleteFamilyMember(id);
    loadMembers();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 text-lg">←</button>
        <h1 className="font-semibold text-gray-800">Family Members</h1>
        <button onClick={() => navigate('/family/add')} className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">+ Add</button>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-gray-400 text-center py-10">Loading...</p>
        ) : members.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">No family members added yet</p>
            <button onClick={() => navigate('/family/add')} className="bg-blue-500 text-white px-6 py-2 rounded-lg">Add Member</button>
          </div>
        ) : (
          members.map((m) => (
            <div key={m._id} className="bg-white rounded-xl p-4 mb-3 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                {m.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{m.name}</p>
                <p className="text-xs text-gray-400 capitalize">{m.relation}{m.DOB ? ` · ${new Date(m.DOB).toLocaleDateString()}` : ''}</p>
              </div>
              <button onClick={() => handleDelete(m._id)} className="text-red-400 text-sm">Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
