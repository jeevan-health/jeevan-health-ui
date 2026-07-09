import { useState, useEffect } from 'react';
import useCmsStore from '../../stores/cmsStore';

const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const labelStyle = { fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4, fontWeight: 500 };
const sectionCard = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function AdminCMS() {
  const content = useCmsStore(s => s.content);
  const updateHero = useCmsStore(s => s.updateHero);
  const updateTrustStrip = useCmsStore(s => s.updateTrustStrip);
  const updateService = useCmsStore(s => s.updateService);
  const addService = useCmsStore(s => s.addService);
  const deleteService = useCmsStore(s => s.deleteService);
  const addTestimonial = useCmsStore(s => s.addTestimonial);
  const updateTestimonial = useCmsStore(s => s.updateTestimonial);
  const deleteTestimonial = useCmsStore(s => s.deleteTestimonial);
  const addFaq = useCmsStore(s => s.addFaq);
  const updateFaq = useCmsStore(s => s.updateFaq);
  const deleteFaq = useCmsStore(s => s.deleteFaq);
  const resetContent = useCmsStore(s => s.resetContent);

  const [tab, setTab] = useState('hero');

  const h = content.hero || {};

  const FormField = ({ label, children }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  const TABS = [
    { id: 'hero', label: 'Hero' },
    { id: 'services', label: 'Services' },
    { id: 'diagnostics', label: 'Diagnostics' },
    { id: 'trust', label: 'Trust Strip' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faqs', label: 'FAQs' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 13, color: '#64748b' }}>Control what visitors see on the public website</div>
        <button onClick={() => { if (confirm('Reset all website content to defaults?')) resetContent(); }}
          style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#dc2626' }}>
          Reset to Defaults
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none',
            background: tab === t.id ? '#0f172a' : 'transparent',
            color: tab === t.id ? '#fff' : '#64748b',
            cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: tab === t.id ? 600 : 400,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* HERO SECTION */}
      {tab === 'hero' && <HeroSection data={h} updateHero={updateHero} inputStyle={inputStyle} FormField={FormField} sectionCard={sectionCard} />}

      {/* SERVICES */}
      {tab === 'services' && <ServicesSection services={content.services || []} updateService={updateService} addService={addService} deleteService={deleteService} inputStyle={inputStyle} FormField={FormField} sectionCard={sectionCard} />}

      {/* TRUST STRIP */}
      {tab === 'trust' && <TrustSection data={content.trustStrip || {}} updateTrustStrip={updateTrustStrip} inputStyle={inputStyle} FormField={FormField} sectionCard={sectionCard} />}

      {/* TESTIMONIALS */}
      {tab === 'testimonials' && <TestimonialsSection testimonials={content.testimonials || []} addTestimonial={addTestimonial} updateTestimonial={updateTestimonial} deleteTestimonial={deleteTestimonial} inputStyle={inputStyle} FormField={FormField} sectionCard={sectionCard} />}

      {/* DIAGNOSTICS */}
      {tab === 'diagnostics' && <DiagnosticsSection content={content} cms={useCmsStore.getState()} inputStyle={inputStyle} FormField={FormField} sectionCard={sectionCard} />}

      {/* FAQS */}
      {tab === 'faqs' && <FaqsSection faqs={content.faqs || []} addFaq={addFaq} updateFaq={updateFaq} deleteFaq={deleteFaq} inputStyle={inputStyle} FormField={FormField} sectionCard={sectionCard} />}
    </div>
  );
}

/* HERO */
function HeroSection({ data, updateHero, inputStyle, FormField, sectionCard }) {
  const [d, setD] = useState(data);
  useEffect(() => { setD(data); }, [data]);
  const save = () => updateHero(d);

  return (
    <div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Hero Banner</h4>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Heading"><input value={d.heading} onChange={e => setD({ ...d, heading: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Background Image URL"><input value={d.backgroundImage} onChange={e => setD({ ...d, backgroundImage: e.target.value })} style={inputStyle} placeholder="Leave empty for gradient" /></FormField>
          <div style={{ gridColumn: '1 / -1' }}><FormField label="Subheading"><textarea rows={2} value={d.subheading} onChange={e => setD({ ...d, subheading: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></FormField></div>
          <FormField label="CTA Text"><input value={d.ctaText} onChange={e => setD({ ...d, ctaText: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="CTA Link"><input value={d.ctaLink} onChange={e => setD({ ...d, ctaLink: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Secondary CTA Text"><input value={d.ctaSecondaryText} onChange={e => setD({ ...d, ctaSecondaryText: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Secondary CTA Link"><input value={d.ctaSecondaryLink} onChange={e => setD({ ...d, ctaSecondaryLink: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Tertiary CTA Text"><input value={d.ctaTertiaryText} onChange={e => setD({ ...d, ctaTertiaryText: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Tertiary CTA Link"><input value={d.ctaTertiaryLink} onChange={e => setD({ ...d, ctaTertiaryLink: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Rating Number"><input value={d.rating} onChange={e => setD({ ...d, rating: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Rating Label"><input value={d.ratingLabel} onChange={e => setD({ ...d, ratingLabel: e.target.value })} style={inputStyle} /></FormField>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={d.active !== false} onChange={e => setD({ ...d, active: e.target.checked })} style={{ accentColor: '#3b82f6' }} />
            Section Visible
          </label>
        </div>
        <button onClick={save} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>Save Hero Section</button>
      </div>
    </div>
  );
}

/* SERVICES */
function ServicesSection({ services, updateService, addService, deleteService, inputStyle, FormField, sectionCard }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ icon: '', label: '', description: '', color: '#3B82F6', link: '', active: true });

  const handleAdd = () => {
    if (!form.label) return;
    addService(form);
    setShowAdd(false);
    setForm({ icon: '', label: '', description: '', color: '#3B82F6', link: '', active: true });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>{services.length} services</span>
        <button onClick={() => setShowAdd(true)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ Add Service</button>
      </div>
      {services.map(s => (
        <div key={s.id} style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div><div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.label}</div><div style={{ fontSize: 12, color: '#64748b' }}>{s.description}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <label style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <input type="checkbox" checked={s.active !== false} onChange={e => updateService(s.id, { active: e.target.checked })} style={{ accentColor: '#3b82f6' }} /> Active
              </label>
              <button onClick={() => { const l = prompt('New label:', s.label); if (l) updateService(s.id, { label: l }); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>Edit</button>
              <button onClick={() => { if (confirm(`Delete "${s.label}"?`)) deleteService(s.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Del</button>
            </div>
          </div>
        </div>
      ))}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Add Service</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Emoji icon (e.g. 🩺)" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} style={inputStyle} />
              <input placeholder="Service Name *" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} style={inputStyle} />
              <input placeholder="Short description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inputStyle} />
              <input placeholder="Hex color (e.g. #3B82F6)" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={inputStyle} />
              <input placeholder="Link path (e.g. /diagnostics)" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* TRUST STRIP */
function TrustSection({ data, updateTrustStrip, inputStyle, FormField, sectionCard }) {
  const [items, setItems] = useState(data.items || []);
  useEffect(() => { setItems(data.items || []); }, [data]);

  const save = () => updateTrustStrip({ ...data, items });

  const updateItem = (idx, field, value) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  };

  const addItem = () => setItems([...items, { icon: '🏅', label: 'New Badge' }]);
  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  return (
    <div style={sectionCard}>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Trust Strip Badges</h4>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} style={{ ...inputStyle, width: 60 }} />
          <input value={item.label} onChange={e => updateItem(i, 'label', e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
      ))}
      <button onClick={addItem} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b', marginTop: 8 }}>+ Add Badge</button>
      <div style={{ marginTop: 12 }}><button onClick={save} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>Save Trust Strip</button></div>
    </div>
  );
}

/* TESTIMONIALS */
function TestimonialsSection({ testimonials, addTestimonial, updateTestimonial, deleteTestimonial, inputStyle, FormField, sectionCard }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', text: '', rating: 5, tag: 'Verified Patient', image: '' });

  const handleAdd = () => {
    if (!form.name || !form.text) return;
    addTestimonial(form);
    setShowAdd(false);
    setForm({ name: '', text: '', rating: 5, tag: 'Verified Patient', image: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>{testimonials.length} testimonials</span>
        <button onClick={() => setShowAdd(true)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ Add Testimonial</button>
      </div>
      {testimonials.map(t => (
        <div key={t.id} style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{t.name}</div>
              <div style={{ fontSize: 11, color: '#f59e0b' }}>{'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>"{t.text}"</div>
              <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, background: '#f1f5f9', color: '#64748b' }}>{t.tag}</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { const n = prompt('Name:', t.name); if (n) updateTestimonial(t.id, { name: n }); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>Edit</button>
              <button onClick={() => { if (confirm('Delete?')) deleteTestimonial(t.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Del</button>
            </div>
          </div>
        </div>
      ))}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 440, maxWidth: '90vw' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Add Testimonial</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Patient Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <textarea rows={3} placeholder="Testimonial text *" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" min={1} max={5} placeholder="Rating (1-5)" value={form.rating} onChange={e => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} style={{ ...inputStyle, width: 100 }} />
                <input placeholder="Tag (e.g. Verified Patient)" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
              </div>
              <input placeholder="Photo URL (optional)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={inputStyle} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* FAQS */
function FaqsSection({ faqs, addFaq, updateFaq, deleteFaq, inputStyle, FormField, sectionCard }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '' });

  const handleAdd = () => {
    if (!form.question || !form.answer) return;
    addFaq(form);
    setShowAdd(false);
    setForm({ question: '', answer: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>{faqs.length} FAQs</span>
        <button onClick={() => setShowAdd(true)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ Add FAQ</button>
      </div>
      {faqs.map(f => (
        <div key={f.id} style={sectionCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{f.question}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{f.answer}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginLeft: 12 }}>
              <button onClick={() => { const q = prompt('Question:', f.question); if (q) updateFaq(f.id, { question: q }); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>Edit</button>
              <button onClick={() => { if (confirm('Delete?')) deleteFaq(f.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Del</button>
            </div>
          </div>
        </div>
      ))}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 440, maxWidth: '90vw' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Add FAQ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Question *" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} style={inputStyle} />
              <textarea rows={3} placeholder="Answer *" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* DIAGNOSTICS */
function DiagnosticsSection({ content, cms, inputStyle, FormField, sectionCard }) {
  const diag = content.diagnostics || {};
  const [pageSettings, setPageSettings] = useState({
    pageTitle: diag.pageTitle, pageSubtitle: diag.pageSubtitle, bannerHeading: diag.bannerHeading,
    bannerText: diag.bannerText, bannerCta: diag.bannerCta, freeHomeCollectionTag: diag.freeHomeCollectionTag,
  });
  const [showCatAdd, setShowCatAdd] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', icon: '', description: '' });

  useEffect(() => {
    setPageSettings({
      pageTitle: diag.pageTitle, pageSubtitle: diag.pageSubtitle, bannerHeading: diag.bannerHeading,
      bannerText: diag.bannerText, bannerCta: diag.bannerCta, freeHomeCollectionTag: diag.freeHomeCollectionTag,
    });
  }, [diag.pageTitle, diag.pageSubtitle, diag.bannerHeading, diag.bannerText, diag.bannerCta, diag.freeHomeCollectionTag]);

  const savePageSettings = () => cms.updateDiagnostics(pageSettings);

  const handleAddCat = () => {
    if (!catForm.name) return;
    cms.addDiagnosticsCategory(catForm);
    setShowCatAdd(false);
    setCatForm({ name: '', icon: '', description: '' });
  };

  return (
    <div>
      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Page Settings</h4>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <FormField label="Page Title"><input value={pageSettings.pageTitle} onChange={e => setPageSettings({ ...pageSettings, pageTitle: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Free Home Collection Tag"><input value={pageSettings.freeHomeCollectionTag} onChange={e => setPageSettings({ ...pageSettings, freeHomeCollectionTag: e.target.value })} style={inputStyle} /></FormField>
          <div style={{ gridColumn: '1 / -1' }}><FormField label="Page Subtitle"><textarea rows={2} value={pageSettings.pageSubtitle} onChange={e => setPageSettings({ ...pageSettings, pageSubtitle: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></FormField></div>
          <FormField label="Banner Heading"><input value={pageSettings.bannerHeading} onChange={e => setPageSettings({ ...pageSettings, bannerHeading: e.target.value })} style={inputStyle} /></FormField>
          <FormField label="Banner CTA Text"><input value={pageSettings.bannerCta} onChange={e => setPageSettings({ ...pageSettings, bannerCta: e.target.value })} style={inputStyle} /></FormField>
          <div style={{ gridColumn: '1 / -1' }}><FormField label="Banner Text"><textarea rows={2} value={pageSettings.bannerText} onChange={e => setPageSettings({ ...pageSettings, bannerText: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></FormField></div>
        </div>
        <button onClick={savePageSettings} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>Save Page Settings</button>
      </div>

      <div style={sectionCard}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 16px' }}>Price Range Filters</h4>
        {(diag.priceRanges || []).map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <input value={r.label} onChange={e => cms.updatePriceRange(i, { label: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
            <input type="number" value={r.min} onChange={e => cms.updatePriceRange(i, { min: Number(e.target.value) })} style={{ ...inputStyle, width: 100 }} />
            <input type="number" value={r.max} onChange={e => cms.updatePriceRange(i, { max: Number(e.target.value) })} style={{ ...inputStyle, width: 100 }} />
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>{(diag.categories || []).filter(c => c.active !== false).length} active of {(diag.categories || []).length} categories</span>
          <button onClick={() => setShowCatAdd(true)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ Add Category</button>
        </div>
        {(diag.categories || []).map(cat => (
          <div key={cat.id} style={sectionCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}>{cat.icon || '🧪'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{cat.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <label style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><input type="checkbox" checked={cat.active !== false} onChange={e => cms.updateDiagnosticsCategory(cat.id, { active: e.target.checked })} style={{ accentColor: '#3b82f6' }} /> Active</label>
                <button onClick={() => { const n = prompt('Name:', cat.name); if (n) cms.updateDiagnosticsCategory(cat.id, { name: n }); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12 }}>Edit</button>
                <button onClick={() => { if (confirm(`Delete "${cat.name}"?`)) cms.deleteDiagnosticsCategory(cat.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Del</button>
              </div>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <input placeholder="Icon emoji" value={cat.icon || ''} onChange={e => cms.updateDiagnosticsCategory(cat.id, { icon: e.target.value })} style={{ ...inputStyle, width: 80 }} />
              <input placeholder="Hero image URL" value={cat.heroImage || ''} onChange={e => cms.updateDiagnosticsCategory(cat.id, { heroImage: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
            </div>
          </div>
        ))}
      </div>

      {showCatAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowCatAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw' }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Add Category</h4>
            <input placeholder="Category Name *" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
            <input placeholder="Icon emoji (e.g. 🩸)" value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} style={{ ...inputStyle, marginBottom: 10 }} />
            <textarea rows={2} placeholder="Short description" value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical', marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCatAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleAddCat} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
