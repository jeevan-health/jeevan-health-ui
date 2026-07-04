import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Syringe, AppleLogo, CaretLeft, Flame, Ruler, Heart } from '@phosphor-icons/react';
import { calculateBMI, calculateBodyFat, calculateCalories, getVaccinations, getVaccinationSchedule, addVaccination, getNutritionPlans } from '../services/wellnessService';
import useAuthStore from '../store/authStore';

const tabs = [
  { key: 'calculators', label: 'Health Calculators', icon: Calculator },
  { key: 'vaccinations', label: 'Vaccination Tracker', icon: Syringe },
  { key: 'nutrition', label: 'Nutrition Plans', icon: AppleLogo },
];

export default function WellnessHub() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [tab, setTab] = useState('calculators');

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Dashboard
        </button>
        <h1>Wellness & Prevention</h1>

        <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: tab === t.key ? 'var(--primary)' : '#fff',
                color: tab === t.key ? '#fff' : 'var(--text-body)',
                border: tab === t.key ? 'none' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
          {isAuthenticated && (
            <button onClick={() => navigate('/food-diary')} className="btn-outline" style={{ padding: '8px 18px', fontSize: 13, marginLeft: 'auto' }}>
              Food Diary
            </button>
          )}
        </div>

        {tab === 'calculators' && <Calculators />}
        {tab === 'vaccinations' && <Vaccinations />}
        {tab === 'nutrition' && <Nutrition />}
      </div>
    </div>
  );
}

function Calculators() {
  const [calc, setCalc] = useState('bmi');
  const [form, setForm] = useState({ weight: '', height: '', age: '', gender: 'male', activityLevel: 'sedentary' });
  const [result, setResult] = useState(null);

  const handleCalc = async () => {
    try {
      let data;
      if (calc === 'bmi') data = (await calculateBMI({ weight: parseFloat(form.weight), height: parseFloat(form.height) })).data;
      else if (calc === 'bodyfat') data = (await calculateBodyFat({ ...form, weight: parseFloat(form.weight), height: parseFloat(form.height), age: parseInt(form.age) })).data;
      else data = (await calculateCalories({ ...form, weight: parseFloat(form.weight), height: parseFloat(form.height), age: parseInt(form.age) })).data;
      setResult(data);
    } catch {}
  };

  const calculators = [
    { key: 'bmi', label: 'BMI Calculator', icon: Ruler },
    { key: 'bodyfat', label: 'Body Fat', icon: Heart },
    { key: 'calories', label: 'Daily Calories', icon: Flame },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} className="calc-layout">
      <div className="card p-5">
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {calculators.map(c => (
            <button key={c.key} onClick={() => { setCalc(c.key); setResult(null); }}
              style={{
                padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: calc === c.key ? 'var(--primary)' : '#f5f7fa',
                color: calc === c.key ? '#fff' : 'var(--text-body)',
                display: 'flex', alignItems: 'center', gap: 4, border: 'none',
              }}>
              <c.icon size={14} /> {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="input" style={{ padding: '10px 12px', fontSize: 13 }} />
          <input type="number" placeholder="Height (cm)" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="input" style={{ padding: '10px 12px', fontSize: 13 }} />
          {calc !== 'bmi' && (
            <>
              <input type="number" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="input" style={{ padding: '10px 12px', fontSize: 13 }} />
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input" style={{ padding: '10px 12px', fontSize: 13 }}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </>
          )}
          {calc === 'calories' && (
            <select value={form.activityLevel} onChange={e => setForm({ ...form, activityLevel: e.target.value })} className="input" style={{ padding: '10px 12px', fontSize: 13 }}>
              <option value="sedentary">Sedentary (desk job)</option>
              <option value="light">Light exercise (1-2 days/wk)</option>
              <option value="moderate">Moderate (3-5 days/wk)</option>
              <option value="active">Active (6-7 days/wk)</option>
              <option value="extra">Extra active (athlete)</option>
            </select>
          )}
          <button onClick={handleCalc} disabled={!form.weight || !form.height} className="btn btn-accent" style={{ marginTop: 4 }}>
            Calculate
          </button>
        </div>
      </div>

      <div className="card p-5" style={{ textAlign: 'center' }}>
        {!result ? (
          <>
            <Calculator size={48} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Enter your details and click Calculate</p>
          </>
        ) : (
          <>
            {result.bmi && (
              <>
                <p style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)' }}>{result.bmi}</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>BMI</p>
                <span style={{ padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginTop: 8, display: 'inline-block', background: '#e8f5e9', color: '#2e7d32' }}>{result.category}</span>
              </>
            )}
            {result.bodyFat && (
              <>
                <p style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)' }}>{result.bodyFat}%</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Body Fat</p>
                <span style={{ padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginTop: 8, display: 'inline-block', background: '#e8f5e9', color: '#2e7d32' }}>{result.category}</span>
              </>
            )}
            {result.tdee && (
              <>
                <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>{result.tdee}</p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Daily Calories (TDEE)</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
                  <div style={{ padding: '6px 12px', background: '#fff3e0', borderRadius: 6, fontSize: 12 }}>Weight Loss: {result.weightLoss} cal</div>
                  <div style={{ padding: '6px 12px', background: '#e8f5e9', borderRadius: 6, fontSize: 12 }}>Maintain: {result.maintenance} cal</div>
                  <div style={{ padding: '6px 12px', background: '#e8f0fe', borderRadius: 6, fontSize: 12 }}>Weight Gain: {result.weightGain} cal</div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Vaccinations() {
  const [records, setRecords] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ vaccineName: '', dateAdministered: '', nextDueDate: '', administeredBy: '', notes: '' });

  useEffect(() => {
    getVaccinationSchedule().then(({ data }) => setSchedule(data)).catch(() => {});
  }, []);

  const handleAdd = async () => {
    try {
      await addVaccination(form);
      setShowAdd(false);
      setForm({ vaccineName: '', dateAdministered: '', nextDueDate: '', administeredBy: '', notes: '' });
      const { data } = await getVaccinations();
      setRecords(data);
    } catch {}
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
          <Syringe size={16} /> Log Vaccination
        </button>
      </div>

      {showAdd && (
        <div className="card p-5" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input placeholder="Vaccine Name" value={form.vaccineName} onChange={e => setForm({ ...form, vaccineName: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12 }}>Date Administered</label>
                <input type="date" value={form.dateAdministered} onChange={e => setForm({ ...form, dateAdministered: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 12 }}>Next Due Date</label>
                <input type="date" value={form.nextDueDate} onChange={e => setForm({ ...form, nextDueDate: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
              </div>
            </div>
            <input placeholder="Administered By (optional)" value={form.administeredBy} onChange={e => setForm({ ...form, administeredBy: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
            <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input" rows={2} style={{ padding: '8px 10px', fontSize: 13, resize: 'vertical' }} />
            <button onClick={handleAdd} disabled={!form.vaccineName || !form.dateAdministered} className="btn btn-accent">Save</button>
          </div>
        </div>
      )}

      {records.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>My Vaccination Records</h3>
          {records.map(r => (
            <div key={r.id} className="card" style={{ padding: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Syringe size={20} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{r.vaccine_name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
                  {new Date(r.date_administered).toLocaleDateString('en-IN')}
                  {r.next_due_date && ` → Next: ${new Date(r.next_due_date).toLocaleDateString('en-IN')}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: 14, marginBottom: 8 }}>Recommended Schedule (India)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {schedule.map((s, i) => (
          <div key={i} className="card" style={{ padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ minWidth: 80, fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{s.age}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13 }}>{s.vaccine}</p>
              {s.doses && <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{s.doses} dose{s.doses > 1 ? 's' : ''}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Nutrition() {
  const [plans, setPlans] = useState([]);
  const [dietType, setDietType] = useState('');
  const [goal, setGoal] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const params = {};
    if (dietType) params.dietType = dietType;
    if (goal) params.goal = goal;
    getNutritionPlans(params).then(({ data }) => setPlans(data)).catch(() => {});
  }, [dietType, goal]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={dietType} onChange={e => setDietType(e.target.value)} className="input" style={{ width: 'auto', minWidth: 140, padding: '8px 10px', fontSize: 13 }}>
          <option value="">All Diet Types</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>
        <select value={goal} onChange={e => setGoal(e.target.value)} className="input" style={{ width: 'auto', minWidth: 180, padding: '8px 10px', fontSize: 13 }}>
          <option value="">All Goals</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Weight Management">Weight Management</option>
          <option value="Muscle Building">Muscle Building</option>
          <option value="Diabetes Management">Diabetes Management</option>
          <option value="Heart Health">Heart Health</option>
        </select>
      </div>

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            <CaretLeft size={16} /> Back to Plans
          </button>
          <div className="card p-5">
            <h2 style={{ fontSize: 18 }}>{selected.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>{selected.goal} · {selected.diet_type} · {selected.calories} cal/day</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>{selected.description}</p>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(selected.meals || []).map((meal, i) => (
                <div key={i} style={{ padding: '12px 14px', background: '#f5f7fa', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 13, color: 'var(--primary)', margin: 0 }}>{meal.meal}</h4>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>{meal.calories} cal</span>
                  </div>
                  <ul style={{ paddingLeft: 16, fontSize: 13, color: 'var(--text-body)' }}>
                    {meal.items?.map((item, j) => <li key={j} style={{ padding: '1px 0' }}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginTop: 12 }}>Total: ~{selected.calories} calories/day</p>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="card p-8 text-center"><AppleLogo size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} /><p style={{ color: 'var(--text-light)' }}>No plans found.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {plans.map(p => (
            <div key={p.id} className="card" style={{ padding: 16, cursor: 'pointer' }} onClick={() => setSelected(p)}>
              <h3 style={{ fontSize: 14, margin: 0 }}>{p.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>{p.goal} · {p.diet_type}</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                <Flame size={16} color="var(--accent)" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.calories} cal/day</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6 }}>{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
