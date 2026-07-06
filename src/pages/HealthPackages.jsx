import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heartbeat, Warning, Shield, User, Heart, Lightbulb, Baby, Suitcase, Pill, Cloud, ForkKnife,
  Airplane, Briefcase, Coin, Moon, Leaf, Syringe, FirstAid, Globe, Lightning, Clock,
  CaretRight, MagnifyingGlass, FileText, CheckCircle, X,
} from '@phosphor-icons/react';

const axisMeta = {
  organ: { label: 'Organ Wise', icon: Heartbeat, color: '#0F5DA8', desc: 'Packages focused on specific organs like liver, heart, kidney, thyroid, lungs, brain, bone, skin, pancreas' },
  disease: { label: 'Disease Wise', icon: Warning, color: '#c62828', desc: 'Packages targeting specific diseases such as diabetes, hypertension, cancer, hepatitis, PCOS, anemia, TB, arthritis' },
  disorder: { label: 'Disorder Wise', icon: Shield, color: '#7b1fa2', desc: 'Packages for broader health disorders including autoimmune, bleeding, metabolic, hormonal, nutritional' },
  age: { label: 'Age Wise', icon: User, color: '#2e7d32', desc: 'Packages tailored to every life stage — newborn, pediatric, adolescent, adult, senior, geriatric' },
  gender: { label: 'Gender Wise', icon: Heart, color: '#e65100', desc: 'Gender-specific health packages — women, men, transgender' },
  lifestyle: { label: 'Lifestyle Wise', icon: Lightbulb, color: '#FF8A00', desc: 'Packages for different lifestyles — corporate, smoker, alcoholic, athlete, sedentary, vegan' },
  lifeStage: { label: 'Life Stage Wise', icon: Baby, color: '#ec407a', desc: 'Packages for key life transitions — pre-marital, pre-conception, pregnancy, postpartum, menopause, andropause' },
  symptom: { label: 'Symptom Wise', icon: Warning, color: '#ff7043', desc: 'Packages based on presenting symptoms — fever, fatigue, hair loss, joint pain, weight loss' },
  occupation: { label: 'Occupation Wise', icon: Suitcase, color: '#5c6bc0', desc: 'Packages for occupational requirements — pre-employment, travel visa, sports, hospital admission, govt schemes' },
  medication: { label: 'Medication Monitoring', icon: Pill, color: '#26a69a', desc: 'Monitoring packages for patients on long-term medications — warfarin, diabetes, thyroid, antiepileptic, lithium' },
  familyHistory: { label: 'Family History / Genetic', icon: Heartbeat, color: '#ef5350', desc: 'Risk assessment based on family history — cardiac, cancer, diabetes, genetic disorders' },
  seasonal: { label: 'Seasonal Wise', icon: Cloud, color: '#42a5f5', desc: 'Season-specific health packages — monsoon, winter, summer' },
  diet: { label: 'Diet Wise', icon: ForkKnife, color: '#66bb6a', desc: 'Diet-based screening packages — vegan, high-protein, keto, malnutrition' },
  postRecovery: { label: 'Post-Recovery Wise', icon: Heartbeat, color: '#ab47bc', desc: 'Recovery monitoring packages — post-COVID, post-surgery, post-chemo, post-heart attack, post-stroke' },
  travel: { label: 'Travel Wise', icon: Airplane, color: '#ffa726', desc: 'Travel-related health packages — pre-travel titers, post-travel screen, visa medicals' },
  insurance: { label: 'Insurance / Corporate', icon: Briefcase, color: '#78909c', desc: 'Insurance and corporate health packages — annual checkups, insurance medicals, govt schemes' },
  preventive: { label: 'Preventive Screening', icon: Shield, color: '#26c6da', desc: 'Preventive health screening — annual master, cancer screening, wellness panel' },
  budget: { label: 'Budget / Price Tier', icon: Coin, color: '#ffca28', desc: 'Affordable packages at different price points — silver, gold, platinum' },
  risk: { label: 'Risk Profile', icon: Warning, color: '#ef5350', desc: 'Risk-based health assessment — high, medium, low risk profiles' },
  duration: { label: 'Duration / Urgency', icon: Clock, color: '#8d6e63', desc: 'Packages based on turnaround time — instant, same-day, 24hr, 72hr, comprehensive week' },
  mentalHealth: { label: 'Mental Health', icon: Heart, color: '#7e57c2', desc: 'Mental wellness assessment — stress, sleep, depression, complete mental wellness' },
  fitness: { label: 'Fitness & Sports', icon: Lightning, color: '#ff7043', desc: 'Sports and fitness packages — pre-marathon, bodybuilding, endurance athlete' },
  sleep: { label: 'Sleep Health', icon: Moon, color: '#5c6bc0', desc: 'Sleep health assessment — sleep apnea, circadian rhythm' },
  environmental: { label: 'Environmental / Toxin', icon: Leaf, color: '#66bb6a', desc: 'Environmental exposure screening — heavy metals, air pollution' },
  vaccination: { label: 'Vaccination & Immunity', icon: Syringe, color: '#42a5f5', desc: 'Immunity assessment — antibody titers, immune status, allergy panel' },
  preSurgical: { label: 'Pre-Surgical', icon: FirstAid, color: '#ef5350', desc: 'Pre-surgery clearance packages — pre-operative, anesthesia clearance' },
  ethnicity: { label: 'Ethnicity / Region', icon: Globe, color: '#ab47bc', desc: 'Region-specific health screening — South Asian, sickle cell/thalassemia, endemic diseases' },
  fertility: { label: 'Fertility & Reproductive', icon: Heart, color: '#ec407a', desc: 'Fertility assessment — pre-conception, male fertility, female fertility' },
};

const HealthPackages = () => {
  const navigate = useNavigate();
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState('');
  const [prescription, setPrescription] = useState(null);
  const prescriptionRef = useRef(null);

  useEffect(() => {
    const check = () => {
      const data = window.__packagesByAxis;
      if (data && Object.keys(data).length > 0) {
        setGrouped(data);
        return true;
      }
      return false;
    };
    if (check()) return;
    const t = setInterval(() => { if (check()) clearInterval(t); }, 200);
    return () => clearInterval(t);
  }, []);

  if (Object.keys(grouped).length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-light)', fontSize: 14 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚕️</div>
        Loading health packages...
        <div style={{ fontSize: 12, marginTop: 8, color: '#aaa' }}>Please visit Diagnostics page first to load test data</div>
      </div>
    );
  }

  const axisOrder = Object.keys(axisMeta);
  const q = search.toLowerCase().trim();

  const matchesSearch = (pkg, axis) => {
    if (!q) return true;
    const meta = axisMeta[axis] || {};
    return pkg.name.toLowerCase().includes(q)
      || pkg.desc.toLowerCase().includes(q)
      || meta.label.toLowerCase().includes(q)
      || pkg.testNames?.some(n => n.toLowerCase().includes(q));
  };

  const filteredGrouped = {};
  axisOrder.filter(a => grouped[a]).forEach(axis => {
    const pkgs = grouped[axis].filter(p => matchesSearch(p, axis));
    if (pkgs.length > 0) filteredGrouped[axis] = pkgs;
  });

  const hasResults = Object.keys(filteredGrouped).length > 0;

  return (
    <div className="page-container">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 50%, #0B7DE5 100%)', padding: '40px 20px 32px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Health Packages</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 20, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Curated health checkup packages across 28 categories — choose what fits your needs
        </p>

        {/* Search bar */}
        <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
          <MagnifyingGlass size={18} style={{ position: 'absolute', left: 18, top: 13, color: '#0F5DA8' }} />
          <input type="text" placeholder="Search packages (e.g., liver, diabetes, heart, senior)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '12px 48px 12px 48px', borderRadius: 50,
              border: 'none', fontSize: 14, outline: 'none', background: '#fff',
              fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }} />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: '#e0e0e0', border: 'none', borderRadius: '50%', width: 24, height: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <X size={14} weight="bold" />
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* Prescription Upload Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #eef4ff, #f5f9ff, #fff)',
          borderRadius: 16, border: '1px solid #c7d9f0', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 24,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <FileText size={22} weight="fill" color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F5DA8', margin: 0 }}>Have a Prescription? Upload Here</h3>
            <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>
              Upload your doctor's prescription and we'll match the right tests for you
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {prescription ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={14} weight="fill" /> {prescription.name.length > 15 ? prescription.name.slice(0, 15) + '…' : prescription.name}
                </span>
                <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }}
                  style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>
                  Remove
                </button>
              </div>
            ) : (
              <button onClick={() => prescriptionRef.current?.click()}
                style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(15,93,168,0.25)',
                }}>
                <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) setPrescription(f); }} />
                📄 Upload Prescription
              </button>
            )}
          </div>
        </div>

        {/* Results info */}
        {q && (
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16 }}>
            {hasResults
              ? `Found ${Object.values(filteredGrouped).flat().length} packages matching "${q}"`
              : `No packages found matching "${q}"`}
          </div>
        )}

        {/* Package groups */}
        {Object.keys(filteredGrouped).length === 0 && q && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
            <MagnifyingGlass size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>Try searching for "liver", "diabetes", "heart", "senior", or browse categories below</p>
            <button onClick={() => setSearch('')} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: '1px solid #0F5DA8', background: '#fff', color: '#0F5DA8', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>
              Clear Search
            </button>
          </div>
        )}

        {Object.keys(filteredGrouped).length === 0 && !q && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚕️</div>
            <p style={{ fontSize: 14 }}>No packages available. Please visit Diagnostics page first.</p>
          </div>
        )}

        {Object.keys(filteredGrouped).map(axis => {
          const meta = axisMeta[axis] || {};
          const Icon = meta.icon || Heartbeat;
          const packages = filteredGrouped[axis];
          return (
            <div key={axis} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} weight="fill" color={meta.color} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, margin: 0 }}>{meta.label}</h2>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0 }}>{meta.desc}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {packages.map(pkg => (
                  <div key={pkg.slug} onClick={() => navigate(`/package/${pkg.slug}`)}
                    style={{
                      background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 16, cursor: 'pointer',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 14, margin: 0, color: meta.color }}>{pkg.name}</h3>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #22C55E, #16a34a)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                        {pkg.discountPct}% off
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-light)', lineHeight: 1.5, marginBottom: 10 }}>{pkg.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>{pkg.testCount} Tests</span>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ddd' }} />
                      <span>Save ₹{pkg.savings.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>₹{pkg.bundlePrice.toLocaleString()}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 6 }}>₹{pkg.totalMrp.toLocaleString()}</span>
                      </div>
                      <CaretRight size={16} color={meta.color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthPackages;
