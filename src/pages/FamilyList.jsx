import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash, Users } from '@phosphor-icons/react';
import { getFamilyMembers, deleteFamilyMember } from '../services/authService';

export default function FamilyList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try { const { data } = await getFamilyMembers(); setMembers(data); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Remove this family member?')) return;
    await deleteFamilyMember(id);
    load();
  };

  return (
    <div style={{ background: 'var(--cyan-50)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0891b2 0%, #066f8f 100%)' }} className="px-6 pt-6 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Family Members</h1>
          <button onClick={() => navigate('/family/add')} className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            <Plus size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {loading ? (
          <div className="card p-8 text-center">
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--cyan-100)', color: 'var(--primary)' }}>
              <Users size={28} />
            </div>
            <p className="font-semibold">No family members</p>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>Add your family to manage their healthcare</p>
            <button onClick={() => navigate('/family/add')} className="btn btn-primary">
              <Plus size={18} weight="bold" /> Add Member
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m) => (
              <div key={m._id || m.id} className="card flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {m.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                    {m.relation}{m.dob ? ` · ${new Date(m.dob).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <button onClick={() => handleDelete(m._id || m.id)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ color: 'var(--red-400)' }}>
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
