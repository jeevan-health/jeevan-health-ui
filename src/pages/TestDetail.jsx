import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getTestBySlug, getTestEducation } from '../data/testEducation';
import { seedTests } from '../data/seedData';
import useCartStore from '../stores/cartStore';
import useUploadModal from '../stores/uploadModalStore';

function Section({ icon, title, children, open, onToggle, id }) {
  return (
    <div id={id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10, scrollMarginTop: 80 }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title}
        </span>
        <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>{children}</div>}
    </div>
  );
}

function ListItems({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 12, lineHeight: 1.5 }}>{item}</li>
      ))}
    </ul>
  );
}

function Tag({ label, color, bg }) {
  return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg || '#e8f0fe', color: color || '#1866C9', display: 'inline-block' }}>{label}</span>;
}

function InfoItem({ icon, label, value, valueColor, bold, strikethrough }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 9, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: bold ? 700 : 600, color: valueColor || '#1a1a1a', textDecoration: strikethrough ? 'line-through' : 'none' }}>{value}</div>
      </div>
    </div>
  );
}

function InfoBox({ children, bg, color, icon }) {
  return (
    <div style={{ marginTop: 8, padding: '8px 12px', background: bg || '#e8f0fe', borderRadius: 8, fontSize: 11, color: color || '#555', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

function Pill({ children, active, color }) {
  return (
    <button style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${active ? (color || '#1866C9') : '#ddd'}`, background: active ? `${color || '1866C9'}15` : '#fff', color: active ? (color || '#1866C9') : '#888', fontSize: 11, cursor: 'pointer', fontWeight: active ? 600 : 400, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

const slugify = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function TestDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [education, setEducation] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [addedRecs, setAddedRecs] = useState([]);
  const [faqFilter, setFaqFilter] = useState('all');
  const cartItems = useCartStore(s => s.items);
  const addItem = useCartStore(s => s.addItem);
  const removeItem = useCartStore(s => s.removeItem);

  useEffect(() => {
    const found = getTestBySlug(slug);
    if (found) {
      setTest(found);
      const edu = getTestEducation(found);
      setEducation(edu);
      document.title = edu?.seo?.metaTitle || `${found.name} | Jeevan HealthCare at Home`;
    }
  }, [slug]);

  const inCart = test && cartItems.some(i => i.id === test.id || i.name === test.name);

  const toggleCart = () => {
    if (!test) return;
    if (inCart) removeItem(test.id, 'test');
    else addItem({ id: test.id, name: test.name, price: test.price, offerPrice: test.offerPrice, type: 'test' });
  };

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const related = test ? seedTests.filter(t => t.category === test.category && t.id !== test.id).slice(0, 6) : [];
  const packages = test ? seedTests.filter(t => t.subcategory === 'Health Packages' && t.category === test.category).slice(0, 3) : [];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${education?.fullName || test?.name} - Book at home ₹${test?.offerPrice || test?.price} | Jeevan HealthCare at Home`;

  if (!test || !education) {
    return (
      <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
          <span style={{ fontSize: 48 }}>🔬</span>
          <p style={{ color: '#999', marginTop: 12 }}>Test not found</p>
          <button onClick={() => navigate('/diagnostics')} className="btn btn-primary" style={{ marginTop: 16 }}>Back to Diagnostics</button>
        </div>
      </div>
    );
  }

  const w = education.whatIsThis;
  const catColorMap = {
    'Hematology': '#e11d48', 'Diabetes': '#0891b2', 'Thyroid': '#7c3aed', 'Cardiac': '#dc2626',
    'Full Body': '#2563eb', 'Liver': '#16a34a', 'Fever': '#ea580c', 'Hormones': '#d946ef',
    'Vitamins': '#0d9488', 'Anemia': '#b91c1c', 'Cancer': '#86198f', 'Arthritis': '#78716c',
    'Pregnancy': '#db2777', 'Allergy': '#65a30d', 'STD': '#4f46e5',
  };
  const theme = catColorMap[test.category] || '#1866C9';

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingBottom: 120, margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => navigate('/diagnostics')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: '12px 0' }}>
          ← Back to Diagnostics
        </button>

        {/* ===== 1. TEST IDENTITY ===== */}
        <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Tag label={test.category || 'Diagnostic'} bg={`${theme}15`} color={theme} />
          {test.fasting_required && <Tag label="Fasting Required" bg="#fff3e0" color="#e65100" />}
          {test.subcategory && <Tag label={test.subcategory} bg="#f5f5f5" color="#666" />}
        </div>

        {/* ===== 2. HERO SECTION ===== */}
        <div style={{ background: `linear-gradient(135deg, ${theme} 0%, ${theme}dd 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>🩸</span>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{education.fullName}</h1>
              {education.scientificName && (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>
                  <strong>Scientific Name:</strong> {education.scientificName}
                </p>
              )}
            </div>
          </div>

          {education.synonyms.length > 0 && (
            <div style={{ marginTop: 4, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Also Known As: </span>
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{education.synonyms.join(' · ')}</span>
            </div>
          )}

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '8px 0 12px', lineHeight: 1.5 }}>
            {test.description}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, fontSize: 11 }}>
            <span>⭐ 4.8 Rating</span>
            <span>👥 15,000+ Bookings</span>
            <span>🏠 Home Collection Available</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              {test.mrp && test.mrp > (test.offerPrice || test.price) && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through' }}>MRP: ₹{test.mrp}</div>
              )}
              <div style={{ fontSize: 28, fontWeight: 800 }}>₹{test.offerPrice || test.price}</div>
              {test.mrp && test.mrp > (test.offerPrice || test.price) && (
                <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Save ₹{test.mrp - (test.offerPrice || test.price)}</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>⏱</span>
              <span style={{ fontSize: 12 }}>{education.reportTime}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>🩸</span>
              <span style={{ fontSize: 12 }}>Blood</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <button onClick={toggleCart} className="btn btn-primary" style={{ background: '#FF3B30', border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', boxShadow: '0 4px 14px rgba(255,59,48,0.3)' }}>
              {inCart ? '✓ In Cart' : '📋 Book Now'}
            </button>
            <button onClick={() => useUploadModal.getState().setOpen(true)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit' }}>
              📤 Upload Prescription
            </button>
          </div>
        </div>

        {/* ===== 3. QUICK INFO CARDS ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6, marginBottom: 14 }}>
          {education.infoCards.map((card, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{card.icon}</div>
              <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{card.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* ===== 4. WHAT IS THIS TEST ===== */}
        <Section icon="🩺" title="Test Overview" open={openSections.overview} onToggle={() => toggle('overview')}>
          <p style={{ margin: '0 0 10px', fontWeight: 500, fontSize: 13 }}>{w.purpose}</p>
          <p style={{ margin: '0 0 10px' }}><strong>What is this test?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{test.description}</p>
          <InfoBox icon="✅" bg="#e8f5e9" color="#2e7d32">{w.screeningOrDiagnostic}</InfoBox>
        </Section>

        {/* ===== 5. WHY IS THIS DONE ===== */}
        <Section icon="❓" title="Why Is This Test Done?" open={openSections.whyDone} onToggle={() => toggle('whyDone')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Purpose of this test:</p>
          <ListItems items={w.whyDone} />
          <InfoBox icon="✅" bg="#e8f0fe" color="#1866C9">Regular testing helps in early detection and better health outcomes.</InfoBox>
        </Section>

        {/* ===== 6. WHAT DOES IT MEASURE ===== */}
        <Section icon="🔬" title="What Does This Test Measure?" open={openSections.measure} onToggle={() => toggle('measure')}>
          <p style={{ margin: '0 0 8px' }}>{w.whatItMeasures}</p>
          {education.biomarker && (
            <div style={{ marginTop: 8, padding: '10px 12px', background: '#f8f9fa', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Measured Biomarker:</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme }}>{education.biomarker.name}</div>
            </div>
          )}
        </Section>

        {/* ===== 7. BIOMARKER INFORMATION ===== */}
        {education.biomarker && (
          <Section icon="🧬" title="Biomarker Information" open={openSections.biomarker} onToggle={() => toggle('biomarker')}>
            <div style={{ padding: '10px 12px', background: '#f8f9fa', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: theme, marginBottom: 4 }}>{education.biomarker.name}</div>
              <p style={{ margin: '0 0 6px', fontSize: 12 }}><strong>What is {education.biomarker.name}?</strong></p>
              <p style={{ margin: '0 0 8px', fontSize: 12 }}>{education.biomarker.what}</p>
              <p style={{ margin: '0 0 4px', fontSize: 12 }}><strong>Why is it important?</strong></p>
              <p style={{ margin: 0, fontSize: 12 }}>{education.biomarker.why}</p>
            </div>
          </Section>
        )}

        {/* ===== 8. WHO SHOULD TAKE THIS TEST ===== */}
        <Section icon="👤" title="Who Should Take This Test?" open={openSections.who} onToggle={() => toggle('who')}>
          <ListItems items={education.whoShouldTake} />
          {education.whoShouldTakeDetailed && (
            <div style={{ marginTop: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Recommended for:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {education.whoShouldTakeDetailed.patientGroups?.map((g, i) => (
                  <span key={i} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: `${theme}10`, color: theme, fontWeight: 500 }}>{g.group}</span>
                ))}
              </div>
            </div>
          )}
          <InfoBox icon="✅" bg="#e8f5e9" color="#2e7d32">Doctors recommend this test for routine health monitoring and early detection.</InfoBox>
        </Section>

        {/* ===== 9. SYMPTOMS ===== */}
        {education.symptoms.length > 0 && (
          <Section icon="⚠️" title="Symptoms Related To This Test" open={openSections.symptoms} onToggle={() => toggle('symptoms')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>If you experience any of these symptoms, this test may help identify the cause:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {education.symptoms.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                  <span style={{ color: '#e65100' }}>⚠</span>
                  <span style={{ fontSize: 12 }}>{s}</span>
                </div>
              ))}
            </div>
            <InfoBox icon="💡" bg="#fff3e0" color="#e65100">Having these symptoms doesn't always mean disease. Consult a doctor for proper evaluation.</InfoBox>
          </Section>
        )}

        {/* ===== 10. DISEASES / CONDITIONS ===== */}
        {education.relatedDiseases.length > 0 && (
          <Section icon="🏥" title="Related Diseases & Conditions" open={openSections.diseases} onToggle={() => toggle('diseases')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>This test helps evaluate the following conditions:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {education.relatedDiseases.map((d, i) => (
                <span key={i} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: '#fef2f2', color: '#dc2626', fontWeight: 500 }}>{d}</span>
              ))}
            </div>
          </Section>
        )}

        {/* ===== 11. TEST PREPARATION ===== */}
        <Section icon="📋" title="Test Preparation" open={openSections.prep} onToggle={() => toggle('prep')}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{education.fastingRequired ? '🌙 Fasting Required' : '🍽️ No Fasting Required'}</span>
          </div>
          <p style={{ margin: '0 0 10px' }}>{education.preparation}</p>
          {education.fastingRequired ? (
            <InfoBox icon="⚠️" bg="#fff3e0" color="#e65100">Follow fasting instructions carefully. Water is allowed. Avoid tea, coffee, smoking, and food during fasting.</InfoBox>
          ) : (
            <InfoBox icon="✅" bg="#e8f5e9" color="#2e7d32">No special preparation needed. Take the test at any time of day.</InfoBox>
          )}
        </Section>

        {/* ===== 12. SAMPLE COLLECTION PROCESS ===== */}
        <Section icon="📦" title="Sample Collection Process" open={openSections.sample} onToggle={() => toggle('sample')}>
          <p style={{ margin: '0 0 12px' }}>Your comfort and safety are our priority. Here is how the process works:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 10 }}>
            {education.sampleProcessSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < education.sampleProcessSteps.length - 1 ? '1px dashed #eee' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${theme}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{step.step}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{step.desc}</div>
                </div>
                {i < education.sampleProcessSteps.length - 1 && (
                  <span style={{ marginLeft: 'auto', color: '#ccc', fontSize: 16 }}>↓</span>
                )}
              </div>
            ))}
          </div>
          <InfoBox icon="✅" bg="#e8f5e9" color="#2e7d32">Free home sample collection included. Choose your preferred time slot — morning, afternoon, or evening.</InfoBox>
        </Section>

        {/* ===== 13. RESULT INTERPRETATION ===== */}
        <Section icon="📊" title="Result Interpretation" open={openSections.interpretation} onToggle={() => toggle('interpretation')}>
          {education.normalRange && (
            <div style={{ marginBottom: 12, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: `${theme}10` }}>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #eee' }}>Category</th>
                    <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #eee' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(education.normalRange).filter(([k]) => k !== 'label').map(([key, val]) => (
                    <tr key={key}>
                      <td style={{ padding: '5px 10px', borderBottom: '1px solid #f5f5f5', fontWeight: 500, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td style={{ padding: '5px 10px', borderBottom: '1px solid #f5f5f5' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <ListItems items={education.resultInterpretation} />
          <InfoBox icon="⚠️" bg="#fff3e0" color="#e65100">Never self-diagnose based on test results. Always consult a qualified healthcare provider.</InfoBox>
        </Section>

        {/* ===== 14. NORMAL REFERENCE RANGE ===== */}
        <Section icon="📏" title="Normal Reference Range" open={openSections.refRange} onToggle={() => toggle('refRange')}>
          <p style={{ margin: '0 0 8px' }}>Reference ranges may vary slightly between laboratories. The following are standard reference ranges:</p>
          {education.normalRange && (
            <div style={{ padding: '10px 12px', background: '#f8f9fa', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{education.normalRange.label || 'Reference Range'}</div>
              {Object.entries(education.normalRange).filter(([k]) => k !== 'label').map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 11, borderBottom: '1px solid #eee' }}>
                  <span style={{ textTransform: 'capitalize', color: '#666' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
          <InfoBox icon="💡" bg="#e8f0fe" color="#1866C9">Always interpret your results in consultation with a doctor who knows your medical history.</InfoBox>
        </Section>

        {/* ===== 15. RISK LEVEL ===== */}
        {education.riskLevels.length > 0 && (
          <Section icon="🚦" title="Risk Level Assessment" open={openSections.risk} onToggle={() => toggle('risk')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {education.riskLevels.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: r.color === 'green' ? '#f0fdf4' : r.color === 'orange' ? '#fff7ed' : '#fef2f2', border: `1px solid ${r.color === 'green' ? '#bbf7d0' : r.color === 'orange' ? '#fed7aa' : '#fecaca'}` }}>
                  <span style={{ fontSize: 20 }}>{r.color === 'green' ? '🟢' : r.color === 'orange' ? '🟡' : '🔴'}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: r.color === 'green' ? '#166534' : r.color === 'orange' ? '#9a3412' : '#991b1b' }}>{r.level}</div>
                    <div style={{ fontSize: 11, color: '#666' }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ===== 16. WHAT IF ABNORMAL ===== */}
        <Section icon="⚠️" title="What If Result Is Abnormal?" open={openSections.abnormal} onToggle={() => toggle('abnormal')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Understanding abnormal results:</p>
          <p style={{ margin: '0 0 10px' }}>{education.abnormalMeaning}</p>
          <InfoBox icon="💡" bg="#fff3e0" color="#e65100">Abnormal results do not always mean disease. Many factors including diet, medications, and stress can affect results.</InfoBox>
        </Section>

        {/* ===== 17. WHEN TO CONSULT DOCTOR ===== */}
        <Section icon="👨‍⚕️" title="When To Consult A Doctor?" open={openSections.consult} onToggle={() => toggle('consult')}>
          <p style={{ margin: '0 0 8px' }}>Consult a doctor if:</p>
          <ListItems items={education.whenToConsultDoctor} />
          <InfoBox icon="📞" bg="#e8f5e9" color="#2e7d32">Jeevan HealthCare at Home provides free doctor consultation with every test.</InfoBox>
        </Section>

        {/* ===== 18. TEST LIMITATIONS ===== */}
        {education.limitations.length > 0 && (
          <Section icon="🚫" title="Test Limitations" open={openSections.limitations} onToggle={() => toggle('limitations')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>Important considerations for accurate interpretation:</p>
            <ListItems items={education.limitations} />
            <InfoBox icon="💡" bg="#f3e8ff" color="#7c3aed">Your doctor will consider these limitations when interpreting your results.</InfoBox>
          </Section>
        )}

        {/* ===== 19. MEDICATION INFLUENCE ===== */}
        {education.medicationInfluence.length > 0 && (
          <Section icon="💊" title="Medication Influence" open={openSections.medications} onToggle={() => toggle('medications')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>The following medications may affect test results:</p>
            <ListItems items={education.medicationInfluence} />
            <InfoBox icon="⚠️" bg="#fff3e0" color="#e65100">Always inform your doctor about all medications, supplements, and herbal products you are taking.</InfoBox>
          </Section>
        )}

        {/* ===== 20. LIFESTYLE FACTORS ===== */}
        {education.lifestyleFactors.length > 0 && (
          <Section icon="🏃" title="Lifestyle Factors" open={openSections.lifestyle} onToggle={() => toggle('lifestyle')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>Lifestyle choices that can affect your results:</p>
            <ListItems items={education.lifestyleFactors} />
            <InfoBox icon="💪" bg="#e8f5e9" color="#2e7d32">Healthy lifestyle choices can improve your health parameters over time.</InfoBox>
          </Section>
        )}

        {/* ===== 21. SAMPLE QUALITY ISSUES ===== */}
        {education.sampleQualityIssues.length > 0 && (
          <Section icon="🔍" title="Sample Quality & Accuracy" open={openSections.quality} onToggle={() => toggle('quality')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>Results may vary due to:</p>
            <ListItems items={education.sampleQualityIssues} />
            <InfoBox icon="✅" bg="#e8f0fe" color="#1866C9">Our labs follow strict quality control protocols to ensure accurate results.</InfoBox>
          </Section>
        )}

        {/* ===== 22. COMPARE SIMILAR TESTS ===== */}
        {education.comparableTests.length > 0 && (
          <Section icon="⚖️" title="Compare Similar Tests" open={openSections.compare} onToggle={() => toggle('compare')}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: `${theme}10` }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #eee' }}>Test</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid #eee' }}>Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {education.comparableTests.map((ct, i) => (
                    <tr key={i}>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #f5f5f5', fontWeight: 600 }}>{ct.name}</td>
                      <td style={{ padding: '6px 10px', borderBottom: '1px solid #f5f5f5', color: '#666' }}>{ct.diff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ===== 23. RELATED TESTS ===== */}
        {related.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔗</span> Related Tests
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {related.map(t => (
                <Link key={t.id} to={`/test/${slugify(t.name)}`}
                  style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: '#f8f9fa', border: '1px solid #e8edf2', color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 12 }}>🧪</span> {t.name.length > 25 ? t.name.slice(0, 25) + '...' : t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== 24. RECOMMENDED PACKAGES ===== */}
        {packages.length > 0 && (
          <div style={{ background: '#fff8e1', borderRadius: 14, border: '1px solid #ffe082', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📦</span> Recommended Packages
            </h3>
            {packages.map(p => (
              <Link key={p.id} to={`/package/${slugify(p.name)}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>⭐ {p.name}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>₹{p.offerPrice || p.price}</div>
                </div>
                <span style={{ fontSize: 11, color: '#e65100', fontWeight: 600 }}>View →</span>
              </Link>
            ))}
          </div>
        )}

        {/* ===== 25. FAQ SECTION ===== */}
        <Section icon="❓" title="Frequently Asked Questions" open={openSections.faq} onToggle={() => toggle('faq')}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            <Pill active={faqFilter === 'all'} onClick={() => setFaqFilter('all')}>All</Pill>
            <Pill active={faqFilter === 'general'} onClick={() => setFaqFilter('general')}>General</Pill>
            <Pill active={faqFilter === 'preparation'} onClick={() => setFaqFilter('preparation')}>Preparation</Pill>
            <Pill active={faqFilter === 'procedure'} onClick={() => setFaqFilter('procedure')}>Procedure</Pill>
            <Pill active={faqFilter === 'results'} onClick={() => setFaqFilter('results')}>Results</Pill>
            <Pill active={faqFilter === 'booking'} onClick={() => setFaqFilter('booking')}>Booking</Pill>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {education.faqs.filter(f => faqFilter === 'all' || f.c === faqFilter).map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e8edf2', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setOpenSections(prev => ({ ...prev, [`faq_${i}`]: !prev[`faq_${i}`] }))} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>
                  {faq.q}
                  <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: openSections[`faq_${i}`] ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
                </button>
                {openSections[`faq_${i}`] && (
                  <div style={{ padding: '0 12px 10px', fontSize: 11, color: '#888', lineHeight: 1.5 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 26. SOCIAL SHARING ===== */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 14, marginBottom: 10 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px', color: '#888' }}>📤 Share this test</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>💬</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>f</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none', color: '#fff' }}>𝕏</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>in</a>
            <button onClick={() => { navigator.clipboard?.writeText(shareUrl); }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'inherit' }}>🔗</button>
          </div>
        </div>

        {/* ===== 27. TEST SPEC CARD ===== */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ background: 'linear-gradient(135deg, #0b2a4a 0%, #1a4a7a 100%)', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>🔬</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{education.fullName}</div>
                {education.scientificName && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{education.scientificName}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {education.abbreviation && <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>{education.abbreviation}</span>}
              <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>{test.category}</span>
              {test.subcategory && <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>{test.subcategory}</span>}
            </div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <InfoItem icon="💰" label="Offer Price" value={`₹${test.offerPrice || test.price}`} valueColor="#e53935" bold />
              <InfoItem icon="🏷️" label="MRP" value={test.mrp && test.mrp > (test.offerPrice || test.price) ? `₹${test.mrp}` : '—'} valueColor={test.mrp && test.mrp > (test.offerPrice || test.price) ? '#999' : '#ccc'} strikethrough={test.mrp && test.mrp > (test.offerPrice || test.price)} />
              <InfoItem icon="⏱️" label="Report Time" value={test.report_time || '24 hours'} />
              <InfoItem icon="🩸" label="Sample Type" value={test.sample_type || 'Blood'} />
              {education.fastingRequired !== undefined && (
                <InfoItem icon="🍽️" label="Fasting" value={education.fastingRequired ? 'Required' : 'Not Required'} valueColor={education.fastingRequired ? '#e65100' : '#2e7d32'} />
              )}
              <InfoItem icon="🏠" label="Home Collection" value="Free" valueColor="#2e7d32" />
              <InfoItem icon="🏅" label="Accreditation" value="NABL Certified" valueColor="#1565c0" />
              <InfoItem icon="📊" label="Test Type" value={test.category === 'Cardiac' || test.category === 'Diabetes' || test.category === 'Thyroid' ? 'Monitoring' : 'Diagnostic'} />
              <InfoItem icon="🔄" label="Report Delivery" value="WhatsApp, Email & App" />
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 10, paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: '#888' }}>
                <strong style={{ color: '#555' }}>Savings:</strong> {test.mrp && test.mrp > (test.offerPrice || test.price) ? `₹${test.mrp - (test.offerPrice || test.price)} (${Math.round((1 - (test.offerPrice || test.price) / test.mrp) * 100)}% off)` : 'Best Price'}
              </div>
              <div style={{ fontSize: 10, color: '#aaa' }}>🛡️ Safe & Hygienic</div>
            </div>
          </div>
        </div>

        {/* ===== 28. SEO STRUCTURED DATA ===== */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalTest',
            name: education.fullName,
            description: test.description,
            url: typeof window !== 'undefined' ? window.location.href : '',
            about: test.category,
            offers: {
              '@type': 'Offer',
              price: test.offerPrice || test.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          })
        }} />
      </div>

      {/* ===== STICKY MOBILE BOOKING BAR ===== */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{education.abbreviation || education.fullName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#e53935' }}>₹{test.offerPrice || test.price}</span>
            {test.mrp && test.mrp > (test.offerPrice || test.price) && (
              <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{test.mrp}</span>
            )}
            <span style={{ fontSize: 10, color: '#2e7d32', fontWeight: 600 }}>Free Collection</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: '#1866C9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <button onClick={toggleCart} className="btn btn-primary" style={{ background: '#FF3B30', border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', boxShadow: '0 4px 14px rgba(255,59,48,0.3)', whiteSpace: 'nowrap' }}>
          {inCart ? '✓ In Cart' : '📋 Book Now'}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-section { padding: 0; }
          .container { padding-left: 12px; padding-right: 12px; }
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 6px 8px; }
        .btn-primary { transition: all 0.2s; border-radius: 10px; cursor: pointer; font-family: inherit; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}