import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  CaretLeft, Flask, CheckCircle, Clock, Phone, WhatsappLogo,
  FileText, Heartbeat, Star, ArrowRight, CaretDown,
  Plus, Minus, Sparkle, User,
} from '@phosphor-icons/react';
import { getTestBySlug, getTestEducation } from '../data/testEducation';
import { seedTests } from '../data/seedData';
import useCartStore from '../stores/cartStore';
import { getRelatedTests, getRelatedDiseases, getRelatedPackages } from '../utils/testRecommendations';

function Section({ icon: Icon, title, children, open, onToggle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: 'var(--text-dark)', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={18} color="#1866C9" />}
          {title}
        </span>
        <CaretDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, color: '#999' }} />
      </button>
      {open && <div style={{ padding: '0 16px 16px', fontSize: 12, color: 'var(--text-body)', lineHeight: 1.6 }}>{children}</div>}
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

function InfoBox({ children, bg, color, icon: Icon }) {
  return (
    <div style={{ marginTop: 8, padding: '8px 12px', background: bg || '#e8f0fe', borderRadius: 8, fontSize: 11, color: color || '#1866C9', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {Icon && <Icon size={14} weight="fill" style={{ flexShrink: 0, marginTop: 1 }} />}
      <span>{children}</span>
    </div>
  );
}

export default function TestDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [education, setEducation] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [addedRecs, setAddedRecs] = useState([]);
  const cartItems = useCartStore(s => s.items);
  const addItem = useCartStore(s => s.addItem);
  const removeItem = useCartStore(s => s.removeItem);

  useEffect(() => {
    const found = getTestBySlug(slug);
    if (found) {
      setTest(found);
      setEducation(getTestEducation(found));
    }
  }, [slug]);

  const inCart = test && cartItems.some(i => i.id === test.id || i.name === test.name);
  const related = test ? getRelatedTests(test.name) : [];
  const diseases = test ? getRelatedDiseases(test.name) : [];
  const packages = test ? getRelatedPackages(test.name, seedTests) : [];

  const toggleCart = () => {
    if (!test) return;
    if (inCart) removeItem(test.id, 'test');
    else addItem({ id: test.id, name: test.name, price: test.price || test.mrp, offerPrice: test.offerPrice, type: 'test' });
  };

  const addRelated = (t) => {
    addItem({ id: t.id, name: t.name, price: t.price || t.mrp, offerPrice: t.offerPrice, type: 'test' });
    setAddedRecs(prev => [...prev, t.id]);
  };

  const slugify = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (!test || !education) {
    return (
      <div className="page-section">
        <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
          <Flask size={48} color="#ccc" />
          <p style={{ color: 'var(--text-light)', marginTop: 12 }}>Test not found</p>
          <button onClick={() => navigate('/diagnostics')} className="btn-primary" style={{ marginTop: 16 }}>
            Back to Diagnostics
          </button>
        </div>
      </div>
    );
  }

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const w = education.whatIsThis;

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 760, paddingBottom: 100 }}>

        {/* Back */}
        <button onClick={() => navigate('/diagnostics')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: '12px 0' }}>
          <CaretLeft size={14} /> Back to Diagnostics
        </button>

        {/* FULL TEST NAME + ABBREVIATION + ALTERNATE NAMES */}
        <div style={{ background: 'linear-gradient(135deg, #1866C9 0%, #0F4A96 100%)', borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: '#FFD54F', color: '#1866C9', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>INDIVIDUAL TEST</span>
            {test.fasting_required && <span style={{ background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 6, fontSize: 10 }}>Fasting Required</span>}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 4px', letterSpacing: -0.3 }}>
            {education.fullName}
          </h1>
          {education.abbreviation && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '0 0 4px' }}>
              Abbreviation: <strong>{education.abbreviation}</strong>
            </p>
          )}
          {education.alternateNames.length > 0 && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Also Known As: {education.alternateNames.join(', ')}
            </p>
          )}
        </div>

        {/* QUICK STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginBottom: 16 }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Price</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#e53935', marginTop: 2 }}>{'\u20B9'}{test.offerPrice || test.price}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Reports In</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32', marginTop: 2 }}>{education.reportTime}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Collection</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1866C9', marginTop: 2 }}>Free Home</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Duration</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', marginTop: 2 }}>{education.duration}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Fasting</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: test.fasting_required ? '#e65100' : '#2e7d32', marginTop: 2 }}>{test.fasting_required ? 'Required' : 'Not Required'}</div>
          </div>
        </div>

        {/* 1. WHAT IS THIS TEST */}
        <Section icon={Heartbeat} title="What Is This Test?" open={openSections.whatIs} onToggle={() => toggle('whatIs')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{w.purpose}</p>
          <InfoBox icon={CheckCircle} bg="#e8f0fe" color="#1866C9">{w.screeningOrDiagnostic}</InfoBox>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Why Is This Test Done?</div>
            <ListItems items={w.whyDone} />
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>What Health Conditions Can It Detect?</div>
            <ListItems items={w.conditionsDetected} />
          </div>
        </Section>

        {/* 2. WHO SHOULD TAKE THIS TEST */}
        <Section icon={User} title="Who Should Take This Test?" open={openSections.who} onToggle={() => toggle('who')}>
          <ListItems items={education.whoShouldTake} />
          <InfoBox bg="#e8f5e9" color="#2e7d32" icon={CheckCircle}>
            Yes, this test is relevant to you if you identify with any of the above criteria. Doctors recommend this test for routine health monitoring.
          </InfoBox>
        </Section>

        {/* 3. PARAMETERS MEASURED */}
        <Section icon={Flask} title="What Does This Test Check?" open={openSections.params} onToggle={() => toggle('params')}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--text-light)' }}>The following parameters are analyzed as part of this test:</p>
          <ListItems items={education.parameters} />
          <InfoBox bg="#f3e8ff" color="#7c3aed" icon={CheckCircle}>
            Showing transparency in test parameters builds trust. Every parameter is measured using NABL-certified lab equipment.
          </InfoBox>
        </Section>

        {/* 4. PREPARATION & FASTING */}
        <Section icon={Clock} title="Preparation & Fasting Instructions" open={openSections.prep} onToggle={() => toggle('prep')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{education.fastingRequired ? 'Fasting Required' : 'No Fasting Required'}</p>
          <p style={{ margin: '0 0 8px' }}>{education.preparation}</p>
          {education.fastingRequired && (
            <InfoBox bg="#fff3e0" color="#e65100" icon={Warning}>
              Follow fasting instructions carefully for accurate results. Water is allowed during fasting. Avoid tea, coffee, smoking, and food during the fasting period. Continue regular medications unless your doctor advises otherwise.
            </InfoBox>
          )}
          {!education.fastingRequired && (
            <InfoBox bg="#e8f5e9" color="#2e7d32" icon={CheckCircle}>
              No special preparation needed. You can take this test at any time of day without prior fasting. Continue your regular routine.
            </InfoBox>
          )}
        </Section>

        {/* 5. SAMPLE COLLECTION PROCESS */}
        <Section icon={MapPin} title="Sample Collection Process" open={openSections.sample} onToggle={() => toggle('sample')}>
          <p style={{ margin: '0 0 8px' }}>Your comfort and safety are our priority. Here is how the process works:</p>
          <ListItems items={education.sampleProcess} />
          <InfoBox bg="#e8f5e9" color="#2e7d32" icon={CheckCircle}>
            Free home sample collection included with every test. Choose your preferred time slot — morning, afternoon, or evening.
          </InfoBox>
        </Section>

        {/* 6. TEST DURATION & CONVENIENCE */}
        <Section icon={Clock} title="Test Duration & Convenience" open={openSections.duration} onToggle={() => toggle('duration')}>
          <ListItems items={[
            `The blood collection takes about ${education.duration}`,
            'The entire home visit is completed within 15-20 minutes',
            'Can be completed in a single visit — no repeat appointments needed',
            'Home sample collection is available at your preferred time slot',
            'No need to travel or wait in queues — we come to you',
            'Results delivered digitally on WhatsApp, Email, and App',
          ]} />
          <InfoBox bg="#e8f0fe" color="#1866C9" icon={CheckCircle}>
            One visit, no waiting, complete convenience. Book online and we take care of the rest.
          </InfoBox>
        </Section>

        {/* 7. REPORT DELIVERY */}
        <Section icon={FileText} title="Report Delivery Timeline" open={openSections.reports} onToggle={() => toggle('reports')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Expected in:</span>
            <Tag label={education.reportTime} color="#2e7d32" bg="#e8f5e9" />
          </div>
          <p style={{ margin: '0 0 8px' }}>{education.reportDelivery}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            <Tag label="WhatsApp Delivery" color="#25d366" bg="#e8f5e9" />
            <Tag label="Email Delivery" color="#1866C9" bg="#e8f0fe" />
            <Tag label="Mobile App" color="#7c3aed" bg="#f5f3ff" />
            <Tag label="Download PDF" color="#e65100" bg="#fff3e0" />
            <Tag label="Doctor Reviewed" color="#2e7d32" bg="#e8f5e9" />
          </div>
          <InfoBox bg="#fff3e0" color="#e65100" icon={Clock}>
            If your report is delayed beyond the expected time, contact our support team via WhatsApp or phone for an immediate update.
          </InfoBox>
        </Section>

        {/* 8. INTERPRETATION OF RESULTS */}
        <Section icon={Warning} title="Understanding Your Results" open={openSections.interpretation} onToggle={() => toggle('interpretation')}>
          <ListItems items={education.interpretation} />
          <InfoBox bg="#fff3e0" color="#e65100" icon={Warning}>
            Never self-diagnose based on test results. Always consult a qualified healthcare provider for proper interpretation of your report.
          </InfoBox>
        </Section>

        {/* 9. MEDICAL ACCURACY & TRUST */}
        <Section icon={Shield} title="Medical Accuracy & Trust" open={openSections.accuracy} onToggle={() => toggle('accuracy')}>
          <p style={{ margin: '0 0 8px' }}>{education.accuracy}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            <Tag label="NABL Certified" color="#1866C9" />
            <Tag label="ISO Compliant" color="#2e7d32" bg="#e8f5e9" />
            <Tag label="Doctor Reviewed" color="#7c3aed" bg="#f5f3ff" />
            <Tag label="Digital Reports" color="#e65100" bg="#fff3e0" />
            <Tag label="Quality Control" color="#1866C9" bg="#e8f0fe" />
          </div>
          <InfoBox bg="#e8f0fe" color="#1866C9" icon={Shield}>
            All samples processed at NABL-certified labs with automated analyzers and rigorous quality control protocols for reliable results.
          </InfoBox>
        </Section>

        {/* 10. FREQUENCY OF TESTING */}
        <Section icon={Clock} title="How Often Should You Take This Test?" open={openSections.frequency} onToggle={() => toggle('frequency')}>
          <p style={{ margin: 0 }}>{education.frequency}</p>
        </Section>

        {/* 11. CUSTOMIZATION */}
        <Section icon={Flask} title="Customization & Test Combinations" open={openSections.customization} onToggle={() => toggle('customization')}>
          <p style={{ margin: '0 0 6px' }}><strong>Can this test be combined with others?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{education.customization.canCombine}</p>
          <p style={{ margin: '0 0 6px' }}><strong>Are there advanced versions?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{education.customization.advancedVersions}</p>
          <p style={{ margin: '0 0 6px' }}><strong>Can a doctor recommend this test?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{education.customization.doctorRecommendation}</p>
          <p style={{ margin: '0 0 6px' }}><strong>Can I add more parameters?</strong></p>
          <p style={{ margin: '0 0 6px' }}>{education.customization.addMoreParameters}</p>
          <InfoBox bg="#e8f0fe" color="#1866C9" icon={CheckCircle}>
            Add this test to your cart and browse other tests to build a comprehensive health checkup package.
          </InfoBox>
        </Section>

        {/* 12. SAFETY & COMFORT */}
        <Section icon={Heartbeat} title="Safety & Comfort" open={openSections.safety} onToggle={() => toggle('safety')}>
          <ListItems items={education.safety} />
          <InfoBox bg="#e8f5e9" color="#2e7d32" icon={CheckCircle}>
            Your safety is our priority. All phlebotomists follow strict hygiene protocols with sterile, single-use equipment.
          </InfoBox>
        </Section>

        {/* 13. COST & BOOKING */}
        <Section icon={Coin} title="Cost & Booking Information" open={openSections.cost} onToggle={() => toggle('cost')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#e53935' }}>{education.cost.price}</span>
            <Tag label="No Hidden Charges" color="#2e7d32" bg="#e8f5e9" />
            <Tag label="Free Home Collection" color="#1866C9" bg="#e8f0fe" />
          </div>
          <p style={{ margin: '0 0 6px' }}><strong>Is home collection free?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{education.cost.homeCollection}</p>
          <p style={{ margin: '0 0 6px' }}><strong>Why is this test affordable?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{education.cost.whyAffordable}</p>
          <p style={{ margin: '0 0 6px' }}><strong>How do I book this test?</strong></p>
          <p style={{ margin: '0 0 10px' }}>{education.cost.howToBook}</p>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Payment Methods:</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {education.cost.paymentMethods.map((m, i) => (
                <Tag key={i} label={m} color="#1866C9" bg="#e8f0fe" />
              ))}
            </div>
          </div>
        </Section>

        {/* 14. POST-TEST GUIDANCE */}
        <Section icon={FileText} title="Post-Test Guidance" open={openSections.postTest} onToggle={() => toggle('postTest')}>
          <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--text-light)' }}>
            Follow these steps after receiving your test report:
          </p>
          <ListItems items={education.postTestGuidance} />
          <InfoBox bg="#e8f0fe" color="#1866C9" icon={CheckCircle}>
            Jeevan HealthCare provides free doctor consultation with every test. We are here to support you through your health journey.
          </InfoBox>
        </Section>

        {/* FAQ SECTION */}
        <Section icon={FileText} title="Frequently Asked Questions" open={openSections.faq} onToggle={() => toggle('faq')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {education.faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e8edf2', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setOpenSections(prev => ({ ...prev, [`faq_${i}`]: !prev[`faq_${i}`] }))} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: 'var(--text-dark)', textAlign: 'left' }}>
                  {faq.q}
                  <CaretDown size={10} style={{ transform: openSections[`faq_${i}`] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, color: '#999' }} />
                </button>
                {openSections[`faq_${i}`] && (
                  <div style={{ padding: '0 12px 10px', fontSize: 11, color: 'var(--text-light)', lineHeight: 1.5 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* AI RECOMMENDATIONS */}
        {related.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #F5FAFF, #fff)', borderRadius: 16, border: '1px solid #e0e8f0', padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Sparkle size={16} color="#1866C9" weight="fill" />
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>🩺 Recommended by Jeevan Health Assistant</h3>
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.4 }}>
              Based on the test you're viewing, these related tests are commonly ordered together. Consult a doctor for personalized recommendations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {related.slice(0, 5).map(r => {
                const t = seedTests.find(s => s.name === r.name);
                if (!t) return null;
                const added = addedRecs.includes(t.id) || cartItems.some(i => i.id === t.id);
                const stars = '⭐'.repeat(r.priority - 2);
                return (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#fff', borderRadius: 10, border: '1px solid #e8edf2' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#E8F1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>🧪</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 1 }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                        {stars} {r.reason}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#1866C9', marginTop: 2 }}>₹{t.offerPrice || t.price}</div>
                    </div>
                    <button onClick={() => addRelated(t)} disabled={added}
                      style={{ padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, background: added ? '#dcfce7' : '#1866C9', color: added ? '#166534' : '#fff', border: 'none', cursor: added ? 'default' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      {added ? '✓ Added' : '+ Add Test'}
                    </button>
                  </div>
                );
              })}
            </div>

            {diseases.length > 0 && (
              <div style={{ marginTop: 12, padding: '10px', background: '#fff', borderRadius: 10, border: '1px solid #e8edf2' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>🦠 This test helps evaluate:</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {diseases.map(d => (
                    <span key={d} style={{ fontSize: 10, background: '#FEF2F2', color: '#dc2626', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            {packages.length > 0 && (
              <div style={{ marginTop: 10, background: '#FFF8E1', borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E65100', marginBottom: 6 }}>📦 Recommended Packages</div>
                {packages.map(p => (
                  <Link key={p.name} to={`/package/${slugify(p.name)}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>⭐ {p.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{p.testCount} Tests · ₹{p.bundlePrice}</div>
                    </div>
                    <span style={{ fontSize: 10, color: '#E65100', fontWeight: 600 }}>View →</span>
                  </Link>
                ))}
              </div>
            )}

            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 10, padding: '8px', background: '#E8F1FC', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#1866C9', textDecoration: 'none' }}>
              <User size={14} /> Not sure? Consult a Doctor for personalized recommendations
            </Link>
          </div>
        )}

        {/* RELATED TESTS */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flask size={16} color="#1866C9" /> Related Tests
          </h3>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {seedTests.filter(t => t.category === test.category && t.id !== test.id).slice(0, 8).map(t => (
              <Link key={t.id} to={`/test/${slugify(t.name)}`}
                style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: '#f8f9fa', border: '1px solid #e8edf2', color: 'var(--text-dark)', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flask size={12} color="#1866C9" /> {t.name.length > 28 ? t.name.slice(0, 28) + '...' : t.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: '#1866C9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Phone size={18} weight="fill" color="#fff" />
        </a>
        <a href={`https://wa.me/919700104108?text=${encodeURIComponent('Hi! I want to know more about ' + education.fullName + ' (' + (education.abbreviation || '') + ') test')}`} target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <WhatsappLogo size={18} weight="fill" color="#fff" />
        </a>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{education.fullName}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#e53935' }}>{'\u20B9'}{test.offerPrice || test.price}</div>
        </div>
        <button onClick={() => navigate('/diagnostics')} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#f0f0f0', color: 'var(--text-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          All Tests
        </button>
        <button onClick={toggleCart} style={{ padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: inCart ? '#fee2e2' : '#FF3B30', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, boxShadow: inCart ? 'none' : '0 4px 14px rgba(255,59,48,0.3)' }}>
          {inCart ? <><Minus size={14} /> Remove</> : <><Plus size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}
