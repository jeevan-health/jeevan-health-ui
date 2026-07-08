import React from 'react';
import { Link } from 'react-router-dom';
import SmartSearch from '../components/layout/SmartSearch';

const tests = [
  { letter: 'A', items: ['AFP Test', 'Allergy Test', 'Amylase Test'] },
  { letter: 'B', items: ['Blood Sugar Test', 'Bilirubin Test', 'Vitamin B12 Test'] },
  { letter: 'C', items: ['CBC Test', 'CRP Test', 'Cholesterol Test'] },
  { letter: 'D', items: ['D-Dimer Test', 'Diabetes Test (HbA1c)', 'Dengue Test'] },
  { letter: 'F', items: ['Ferritin Test', 'Folate Test', 'Free T3'] },
  { letter: 'H', items: ['HbA1c Test', 'Hepatitis Test', 'HIV Test'] },
  { letter: 'K', items: ['Kidney Function Test'] },
  { letter: 'L', items: ['Lipid Profile', 'Liver Function Test'] },
  { letter: 'T', items: ['Thyroid Profile', 'Triglycerides Test'] },
  { letter: 'U', items: ['Uric Acid Test'] },
  { letter: 'V', items: ['Vitamin D Test', 'Vitamin B12 Test'] },
];

const diseases = [
  { name: 'Diabetes', tests: 'HbA1c, Fasting Blood Sugar, Lipid Profile' },
  { name: 'Hypertension', tests: 'Lipid Profile, ECG, Kidney Function' },
  { name: 'Thyroid Disorders', tests: 'Thyroid Profile, T3, T4, TSH' },
  { name: 'PCOS', tests: 'Hormone Panel, Thyroid Profile, Lipid Profile' },
  { name: 'Kidney Disease', tests: 'Kidney Function Test, Urinalysis' },
  { name: 'Liver Disease', tests: 'Liver Function Test, Bilirubin' },
  { name: 'Heart Disease', tests: 'Lipid Profile, Cardiac Markers, ECG' },
  { name: 'Vitamin Deficiency', tests: 'Vitamin D, Vitamin B12, Iron Panel' },
];

const symptoms = [
  { name: 'Fatigue', tests: 'CBC, Vitamin B12, Vitamin D, Thyroid Profile, HbA1c' },
  { name: 'Hair Fall', tests: 'Thyroid Profile, Vitamin D, Iron Panel, Hormone Panel' },
  { name: 'Weight Gain', tests: 'Thyroid Profile, Lipid Profile, Blood Sugar' },
  { name: 'Chest Pain', tests: 'ECG, Lipid Profile, Cardiac Markers' },
  { name: 'Fever', tests: 'CBC, CRP, Malaria Test, Dengue Test' },
  { name: 'Joint Pain', tests: 'Uric Acid, RA Factor, Vitamin D' },
  { name: 'Stomach Pain', tests: 'Liver Function, Amylase, Stool Test' },
  { name: 'Dizziness', tests: 'CBC, Blood Sugar, Iron Panel, Thyroid Profile' },
];

export default function HealthLibrary() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', padding: '36px 16px', textAlign: 'center', color: '#fff' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>🩺 Jeevan Health Library</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto 16px' }}>Your trusted source for medical information, diagnostic test details, health tips, and expert guidance.</p>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <SmartSearch placeholder="🔍 Search health topics, tests, symptoms..." />
        </div>
      </div>

      <div className="page-section container">
        <h2 className="section-title">🧪 Tests A-Z</h2>
        <p className="section-subtitle">Individual pages for every diagnostic test with normal ranges, preparation, and cost</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
          {tests.map(g => (
            <div key={g.letter} style={{ background: '#f8f9fa', borderRadius: 12, padding: '12px 14px', border: '1px solid #e8edf2' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1866C9', marginBottom: 6 }}>{g.letter}</div>
              {g.items.map(item => (
                <div key={item} style={{ fontSize: 12, padding: '3px 0', color: 'var(--text-secondary)' }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="page-section" style={{ background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 className="section-title">🦠 Diseases</h2>
          <p className="section-subtitle">Understand common conditions and the tests you need</p>
          <div className="grid-4" style={{ gap: 12, marginTop: 14 }}>
            {diseases.map(d => (
              <div key={d.name} style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>Recommended tests:</div>
                <div style={{ fontSize: 11, color: '#1866C9', fontWeight: 600, lineHeight: 1.5 }}>{d.tests}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section container">
        <h2 className="section-title">🤒 Symptom Checker</h2>
        <p className="section-subtitle">Find possible causes and recommended tests based on your symptoms</p>
        <div className="grid-3" style={{ gap: 12, marginTop: 14 }}>
          {symptoms.map(s => (
            <div key={s.name} style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Possible tests:</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {s.tests.split(', ').map(t => (
                  <span key={t} style={{ background: '#E8F1FC', color: '#1866C9', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>{t}</span>
                ))}
              </div>
              <Link to="/diagnostics" style={{ display: 'inline-block', marginTop: 8, fontSize: 11, color: '#FF3B30', fontWeight: 600, textDecoration: 'none' }}>Check Your Health →</Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '28px 16px', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Need Help Finding the Right Test?</h3>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 14, maxWidth: 400, margin: '0 auto 14px' }}>Upload your prescription or consult with our health advisors for personalized recommendations.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '10px 24px', fontSize: 13 }}>🔵 Book Test Now</Link>
          <Link to="/contact" className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '10px 24px', fontSize: 13 }}>📞 Talk to Advisor</Link>
        </div>
      </div>
    </div>
  );
}
