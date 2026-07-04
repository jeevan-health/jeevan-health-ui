import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, AppleLogo, Plus, Trash, Coffee, ForkKnife, Hamburger, Moon } from '@phosphor-icons/react';
import { logFood, getFoodLogs } from '../services/wellnessService';

const mealIcons = { breakfast: Coffee, lunch: ForkKnife, snacks: Hamburger, dinner: Moon };
const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', snacks: 'Snacks', dinner: 'Dinner' };

export default function FoodDiary() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState([]);
  const [showAdd, setShowAdd] = useState(null);
  const [form, setForm] = useState({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });

  const load = async () => {
    try { const { data } = await getFoodLogs({ date }); setLogs(data); } catch {}
  };

  useEffect(() => { load(); }, [date]);

  const handleAdd = async () => {
    try {
      await logFood({
        mealType: showAdd,
        foodName: form.foodName,
        calories: form.calories ? parseInt(form.calories) : null,
        protein: form.protein ? parseFloat(form.protein) : null,
        carbs: form.carbs ? parseFloat(form.carbs) : null,
        fats: form.fats ? parseFloat(form.fats) : null,
        loggedDate: date,
      });
      setForm({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });
      setShowAdd(null);
      load();
    } catch {}
  };

  const totalCalories = logs.reduce((sum, l) => sum + (l.calories || 0), 0);

  const grouped = { breakfast: [], lunch: [], snacks: [], dinner: [] };
  logs.forEach(l => { if (grouped[l.meal_type]) grouped[l.meal_type].push(l); });

  return (
    <div className="page-section">
      <div className="container" style={{ maxWidth: 640 }}>
        <button onClick={() => navigate('/wellness')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Wellness
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ margin: 0 }}>Food Diary</h1>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" style={{ width: 'auto', padding: '6px 10px', fontSize: 13 }} />
        </div>

        <div className="card p-5" style={{ textAlign: 'center', margin: '16px 0' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: totalCalories > 0 ? 'var(--primary)' : 'var(--text-light)' }}>{totalCalories}</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>calories consumed today</p>
        </div>

        {['breakfast', 'lunch', 'snacks', 'dinner'].map(meal => {
          const Icon = mealIcons[meal];
          const items = grouped[meal] || [];
          return (
            <div key={meal} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon size={18} color="var(--primary)" />
                <h3 style={{ fontSize: 14, margin: 0, flex: 1 }}>{mealLabels[meal]}</h3>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{items.reduce((s, l) => s + (l.calories || 0), 0)} cal</span>
                <button onClick={() => setShowAdd(showAdd === meal ? null : meal)}
                  style={{ padding: 4, background: 'none', color: 'var(--primary)' }}>
                  <Plus size={18} weight="bold" />
                </button>
              </div>

              {showAdd === meal && (
                <div className="card p-4" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input placeholder="Food name (e.g., 2 eggs, 1 banana)" value={form.foodName} onChange={e => setForm({ ...form, foodName: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input type="number" placeholder="Calories" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      <input type="number" step="0.1" placeholder="Protein (g)" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input type="number" step="0.1" placeholder="Carbs (g)" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      <input type="number" step="0.1" placeholder="Fats (g)" value={form.fats} onChange={e => setForm({ ...form, fats: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                    </div>
                    <button onClick={handleAdd} disabled={!form.foodName} className="btn btn-accent">Add Food</button>
                  </div>
                </div>
              )}

              {items.map(item => (
                <div key={item.id} className="card" style={{ padding: '8px 12px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{item.food_name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-light)' }}>
                      {item.protein ? `${item.protein}g protein` : ''}{item.protein && item.carbs ? ' · ' : ''}{item.carbs ? `${item.carbs}g carbs` : ''}{item.fats ? ` · ${item.fats}g fats` : ''}
                    </p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{item.calories || '-'}</span>
                </div>
              ))}

              {items.length === 0 && showAdd !== meal && (
                <p style={{ fontSize: 12, color: 'var(--text-light)', padding: '4px 0' }}>No entries. Tap + to add food.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
