import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  CaretLeft, Flask, CheckCircle, Clock, MapPin, Phone, WhatsappLogo,
  FileText, Heartbeat, Warning, Shield, User, Sparkle, ShoppingCart,
  Plus, Minus, Star, ArrowRight, X, CaretDown,
} from '@phosphor-icons/react';
import { getTestBySlug, getTestEducation } from '../data/testEducation';
import { seedTests } from '../data/seedData';

const sectionIcons = {
  overview: Heartbeat,
  whoShouldTake: User,
  parameters: Flask,
  preparation: Clock,
  sample: MapPin,
  reports: FileText,
  interpretation: Warning,
  accuracy: Shield,
  safety: Heartbeat,
  faq: FileText,
};

function Section({ icon: Icon, title, children, open, onToggle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: 'var(--text-dark)', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={18} color="#0F5DA8" />}
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
  return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg || '#e8f0fe', color: color || '#0F5DA8', display: 'inline-block' }}>{label}</span>;
}

export default function TestDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [education, setEducation] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jeevan_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const found = getTestBySlug(slug);
    if (found) {
      setTest(found);
      setEducation(getTestEducation(found));
    }
  }, [slug]);

  const addToCart = () => {
    if (!test) return;
    setCart(prev => {
      if (prev.find(i => i.id === test.id || i.name === test.name)) return prev;
      const updated = [...prev, { ...test, qty: 1 }];
      localStorage.setItem('jeevan_cart', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      return updated;
    });
  };

  const removeFromCart = () => {
    if (!test) return;
    setCart(prev => {
      const updated = prev.filter(i => i.id !== test.id && i.name !== test.name);
      localStorage.setItem('jeevan_cart', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cart-updated'));
      return updated;
    });
  };

  const inCart = test && cart.some(i => i.id === test.id || i.name === test.name);

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

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 760, paddingBottom: 100 }}>

        {/* Back */}
        <button onClick={() => navigate('/diagnostics')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: '12px 0' }}>
          <CaretLeft size={14} /> Back to Diagnostics
        </button>

        {/* Full Name + Abbreviation + Alt Names */}
        <div style={{ background: 'linear-gradient(135deg, #0F5DA8 0%, #1565C0 50%, #1a73e8 100%)', borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: '#FFD54F', color: '#0F5DA8', padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>INDIVIDUAL TEST</span>
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

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginBottom: 16 }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Price</span>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#e53935', marginTop: 2 }}>{'\u20B9'}{test.offerPrice || test.price}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Report Time</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2e7d32', marginTop: 2 }}>{education.reportTime}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Collection</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F5DA8', marginTop: 2 }}>Free Home</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-light)' }}>Fasting</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: test.fasting_required ? '#e65100' : '#2e7d32', marginTop: 2 }}>{test.fasting_required ? 'Required' : 'Not Required'}</div>
          </div>
        </div>

        {/* What is this test */}
        <Section title="What Is This Test?" icon={Heartbeat} open={openSections.whatIs} onToggle={() => toggle('whatIs')}>
          <p style={{ margin: '0 0 8px' }}>{education.whatIsThis}</p>
          <p style={{ margin: 0, color: 'var(--text-light)' }}>
            This test is {test.category?.toLowerCase() || 'a diagnostic'} test that provides valuable insights into your health status.
            It helps healthcare providers {test.fasting_required ? 'assess specific health markers that require fasting for accurate measurement' : 'evaluate your current health status through non-invasive blood analysis'}.
          </p>
        </Section>

        {/* Who Should Take */}
        <Section title="Who Should Take This Test?" icon={User} open={openSections.who} onToggle={() => toggle('who')}>
          <ListItems items={education.whoShouldTake} />
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#e8f0fe', borderRadius: 8, fontSize: 11, color: '#0F5DA8' }}>
            <strong>Recommendation:</strong> If you identify with any of the above criteria, this test is relevant for you. Consult your doctor for personalized advice.
          </div>
        </Section>

        {/* Parameters */}
        <Section title="Parameters Measured" icon={Flask} open={openSections.params} onToggle={() => toggle('params')}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--text-light)' }}>The following parameters are analyzed as part of this test:</p>
          <ListItems items={education.parameters} />
        </Section>

        {/* Preparation */}
        <Section title="Preparation & Fasting Instructions" icon={Clock} open={openSections.prep} onToggle={() => toggle('prep')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{education.fastingRequired ? 'Fasting Required' : 'No Fasting Required'}</p>
          <p style={{ margin: '0 0 8px' }}>{education.preparation}</p>
          {education.fastingRequired && (
            <div style={{ padding: '8px 12px', background: '#fff3e0', borderRadius: 8, fontSize: 11, color: '#e65100', marginTop: 8 }}>
              <strong>Important:</strong> Please follow the preparation instructions carefully to ensure accurate test results. Water is allowed during fasting unless specified otherwise.
            </div>
          )}
        </Section>

        {/* Sample Collection */}
        <Section title="Sample Collection Process" icon={MapPin} open={openSections.sample} onToggle={() => toggle('sample')}>
          <p style={{ margin: '0 0 8px' }}>Your comfort and safety are our priority. Here's how the process works:</p>
          <ListItems items={education.sampleProcess} />
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#e8f5e9', borderRadius: 8, fontSize: 11, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={14} weight="fill" /> Free home sample collection included with every test
          </div>
        </Section>

        {/* Report Timeline */}
        <Section title="Report Delivery Timeline" icon={FileText} open={openSections.reports} onToggle={() => toggle('reports')}>
          <p style={{ margin: '0 0 6px' }}><strong>Expected report time:</strong> {education.reportTime}</p>
          <p style={{ margin: '0 0 8px' }}>{education.reportDelivery}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            <Tag label={`Reports in ${education.reportTime}`} color="#2e7d32" bg="#e8f5e9" />
            <Tag label="WhatsApp Delivery" color="#25d366" bg="#e8f5e9" />
            <Tag label="Email Delivery" color="#0F5DA8" bg="#e8f0fe" />
            <Tag label="Download PDF" color="#7c3aed" bg="#f5f3ff" />
          </div>
        </Section>

        {/* Interpretation */}
        <Section title="Understanding Your Results" icon={Warning} open={openSections.interpretation} onToggle={() => toggle('interpretation')}>
          <ListItems items={education.interpretation} />
          <div style={{ marginTop: 10, padding: '8px 12px', background: '#fff3e0', borderRadius: 8, fontSize: 11, color: '#e65100' }}>
            <strong>Disclaimer:</strong> Test results should always be reviewed by a qualified healthcare provider. Self-diagnosis based on test results is not recommended.
          </div>
        </Section>

        {/* Accuracy & Trust */}
        <Section title="Medical Accuracy & Trust" icon={Shield} open={openSections.accuracy} onToggle={() => toggle('accuracy')}>
          <p style={{ margin: '0 0 8px' }}>{education.accuracy}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
            <Tag label="NABL Certified" color="#0F5DA8" />
            <Tag label="ISO Compliant" color="#2e7d32" bg="#e8f5e9" />
            <Tag label="Doctor Reviewed" color="#7c3aed" bg="#f5f3ff" />
            <Tag label="Digital Reports" color="#e65100" bg="#fff3e0" />
          </div>
        </Section>

        {/* Safety */}
        <Section title="Safety & Comfort" icon={Heartbeat} open={openSections.safety} onToggle={() => toggle('safety')}>
          <ListItems items={education.safety} />
        </Section>

        {/* Frequency */}
        <Section title="How Often Should You Take This Test?" icon={Clock} open={openSections.frequency} onToggle={() => toggle('frequency')}>
          <p style={{ margin: 0 }}>{education.frequency}</p>
        </Section>

        {/* FAQs */}
        <Section title={`Frequently Asked Questions`} icon={FileText} open={openSections.faq} onToggle={() => toggle('faq')}>
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

        {/* Similar Tests */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flask size={16} color="#0F5DA8" /> Related Tests
          </h3>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {seedTests.filter(t => t.category === test.category && t.id !== test.id).slice(0, 8).map(t => (
              <Link key={t.id} to={`/test/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: '#f8f9fa', border: '1px solid #e8edf2', color: 'var(--text-dark)', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flask size={12} color="#0F5DA8" /> {t.name.length > 28 ? t.name.slice(0, 28) + '...' : t.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href={`tel:+919700104108`} style={{ width: 40, height: 40, borderRadius: '50%', background: '#0F5DA8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Phone size={18} weight="fill" color="#fff" />
        </a>
        <a href={`https://wa.me/919700104108?text=${encodeURIComponent('Hi! I want to know more about ' + education.fullName + ' (' + education.abbreviation + ') test')}`} target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <WhatsappLogo size={18} weight="fill" color="#fff" />
        </a>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{education.fullName}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#e53935' }}>{'\u20B9'}{test.offerPrice || test.price}</div>
        </div>
        <button onClick={() => navigate('/diagnostics')} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#f0f0f0', color: 'var(--text-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          View All Tests
        </button>
        <button onClick={inCart ? removeFromCart : addToCart} style={{ padding: '9px 20px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: inCart ? '#fee2e2' : '#FF3B30', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, boxShadow: inCart ? 'none' : '0 4px 14px rgba(255,59,48,0.3)' }}>
          {inCart ? <><Minus size={14} /> Remove</> : <><Plus size={14} /> Add to Cart</>}
        </button>
      </div>
    </div>
  );
}
