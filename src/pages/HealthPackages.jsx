import { useNavigate } from 'react-router-dom';
import { Heartbeat, Warning, Shield, User, Heart, Lightbulb, Baby, Suitcase, Pill, Cloud, ForkKnife, Airplane, Briefcase, Coin, Moon, Leaf, Syringe, FirstAid, Globe, Lightning, Clock, CaretRight } from '@phosphor-icons/react';

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
  const grouped = window.__packagesByAxis || {};

  if (Object.keys(grouped).length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)', fontSize: 14 }}>
        Loading packages...
      </div>
    );
  }

  const axisOrder = Object.keys(axisMeta);

  return (
    <div className="page-container">
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 16px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Health Packages</h1>
        <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 24 }}>Curated health checkup packages across 28 categories — choose what fits your needs</p>

        {axisOrder.filter(a => grouped[a]).map(axis => {
          const meta = axisMeta[axis] || {};
          const Icon = meta.icon || Heartbeat;
          const packages = grouped[axis];
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
