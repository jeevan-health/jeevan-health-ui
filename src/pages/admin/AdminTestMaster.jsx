import { useState, useEffect, useMemo } from 'react';
import { seedTests } from '../../data/seedData';
import useAdminStore from '../../stores/adminStore';
import { generateAllTestsData } from '../../utils/generateTestData';
import { useT } from '../../i18n/LanguageProvider';

const STORAGE_KEY = 'jeevan_testMaster';
const CATEGORIES = ['Hematology', 'Diabetes', 'Thyroid', 'Cardiac', 'Vitamins', 'Full Body', 'Anemia', 'Fever', 'Cancer', 'Hormones', 'Allergy', 'Arthritis', 'Pregnancy', 'Liver', 'STD', 'Kidney'];
const SUBCATEGORIES = ['Complete Blood Count', 'Diabetes', 'Thyroid Profile', 'Lipid Profile', 'Vitamin D', 'Vitamin B12', 'Liver Function', 'Kidney Function', 'Urinalysis', 'Coagulation', 'Inflammation', 'Cardiac Risk', 'Cardiac Markers', 'Tumor Markers', 'Infections', 'Hormones', 'Allergy', 'Arthritis', 'Autoimmune', 'Minerals', 'Electrolytes', 'Anemia', 'Cancer Screening', 'Pregnancy', 'Stool Analysis', 'Pancreatic Enzymes', 'Fat Soluble Vitamins', 'Toxicology', 'Blood Bank'];
const DEPARTMENTS = ['Haematology', 'Biochemistry', 'Microbiology', 'Serology', 'Immunology', 'Pathology', 'Clinical Pathology', 'Molecular Biology'];
const BODY_ORGANS = ['Blood', 'Heart', 'Liver', 'Kidney', 'Thyroid', 'Pancreas', 'Bones', 'Muscles', 'Brain', 'Lungs', 'Intestine', 'Skin', 'Immune System', 'Endocrine System'];
const DISEASE_GROUPS = ['Diabetes', 'Thyroid Disorders', 'Heart Disease', 'Liver Disease', 'Kidney Disease', 'Anemia', 'Vitamin Deficiency', 'Cancer', 'Infection', 'Autoimmune', 'Allergy', 'Hormonal', 'Bone & Joint', 'Metabolic'];
const TEST_TYPES = ['Screening', 'Diagnostic', 'Monitoring', 'Preventive'];
const STATUS_OPTIONS = ['Draft', 'Active', 'Inactive', 'Temporarily Unavailable', 'Coming Soon'];
const SAMPLE_TYPES = ['Blood', 'Urine', 'Stool', 'Semen', 'Saliva', 'Swab', 'Tissue', 'CSF', 'Hair', 'Nail'];
const GENDERS = ['Both', 'Male', 'Female'];
const AGE_GROUPS = ['All', 'Child (0-12)', 'Teen (13-19)', 'Adult (20-59)', 'Senior (60+)'];
const REPORT_TIMES = ['6 hrs', '12 hrs', '24 hrs', '48 hrs', '72 hrs', '5-7 days', '7-14 days', 'Immediate'];

const defaultLanguages = () => ({ hindi: '', telugu: '', tamil: '', kannada: '' });
const defaultBiomarkers = () => [{ biomarkerName: '', description: '', bodyFunction: '', clinicalImportance: '', relatedDiseases: '', referenceValues: '' }];
const defaultRefRanges = () => [{ ageGroup: 'All', gender: 'Both', normalRange: '', criticalRange: '', unit: '', interpretation: '' }];
const defaultFaqs = () => [{ question: '', answer: '', order: 1, active: true }];
const emptyTest = () => ({
  testId: '', internalCode: '', lisCode: '', loincCode: '', cptCode: '',
  name: '', fullName: '', scientificName: '', abbreviation: '',
  alternateNames: '', synonyms: '', alsoKnownAs: '',
  languages: defaultLanguages(),
  category: 'Hematology', subcategory: '', department: '', bodyOrgan: '', diseaseGroup: '', gender: 'Both', ageGroup: 'All', testType: 'Diagnostic',
  shortDescription: '', longDescription: '', whatIsThis: '', whyDone: '', whatMeasures: '', clinicalSignificance: '', whoShouldTake: '', symptoms: '', diseases: '',
  preparation: '', fastingRequired: false, sampleType: 'Blood', sampleVolume: '', collectionProcess: '', reportTime: '24 hrs', resultExplanation: '', normalRange: '', riskLevel: '', limitations: '', medicationImpact: '', lifestyleAdvice: '', sampleQualityIssues: '', followUpTests: '',
  biomarkers: defaultBiomarkers(),
  refRanges: defaultRefRanges(),
  mrp: 0, offerPrice: 0, discount: 0, corporatePrice: 0, insurancePrice: 0, b2bPrice: 0, homeCollectionFee: 0, gst: 18,
  bookingAvailable: true, homeCollection: true, locations: '', sampleTypeBooking: 'Blood', reportDeliveryTime: '24 hrs', emergencyAvailable: false,
  relatedTests: '', relatedPackages: '', recommendedFor: '', frequentlyBought: '', crossSell: '',
  faqs: defaultFaqs(),
  seoUrl: '', metaTitle: '', metaDescription: '', keywords: '', schemaMarkup: '', socialImage: '',
  status: 'Draft',
});

const loadData = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
};
const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

export default function AdminTestMaster() {
  const t = useT();
  const getCatalog = useAdminStore(s => s.getCatalog);
  const catalog = useMemo(() => getCatalog(), []);
  const [extendedData, setExtendedData] = useState({});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: 'all', status: 'all', dept: 'all', sampleType: 'all' });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTest());
  const [activeSection, setActiveSection] = useState('identity');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setExtendedData(loadData()); }, []);

  const allTests = useMemo(() => {
    const seedMap = {};
    catalog.forEach(t => { seedMap[t.id] = t; });
    const ids = new Set([...catalog.map(t => t.id), ...Object.keys(extendedData).map(Number).filter(n => !isNaN(n))]);
    return Array.from(ids).map(id => {
      const base = seedMap[id] || {};
      const ext = extendedData[id];
      return { ...base, ...ext, id };
    }).filter(t => t.name);
  }, [catalog, extendedData]);

  const filtered = useMemo(() => allTests.filter(t => {
    if (search && !t.name?.toLowerCase().includes(search.toLowerCase()) && !(t.fullName || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    if (filters.dept !== 'all' && t.department !== filters.dept) return false;
    if (filters.sampleType !== 'all' && t.sampleType !== filters.sampleType) return false;
    return true;
  }), [allTests, search, filters]);

  const persist = (id, data) => {
    const next = { ...extendedData, [id]: { ...extendedData[id], ...data } };
    setExtendedData(next);
    saveData(next);
    if (catalog.find(t => t.id === id)) {
      const { name, price, offerPrice, description, category, fasting_required, report_time } = data;
      if (name || price || offerPrice || description || category || fasting_required !== undefined || report_time) {
        useAdminStore.getState().saveTestOverride(id, { ...(name ? { name } : {}), ...(price ? { price: Number(price) } : {}), ...(offerPrice ? { offerPrice: Number(offerPrice) } : {}), ...(description ? { description } : {}), ...(category ? { category } : {}), ...(fasting_required !== undefined ? { fasting_required } : {}), ...(report_time ? { report_time } : {}) });
      }
    }
  };

  const openEdit = (test) => {
    const mapped = {
      ...emptyTest(),
      testId: test.id?.toString() || '',
      internalCode: test.internalCode || '',
      lisCode: test.lisCode || '', loincCode: test.loincCode || '', cptCode: test.cptCode || '',
      name: test.name || '', fullName: test.fullName || '', scientificName: test.scientificName || '', abbreviation: test.abbreviation || '',
      alternateNames: test.alternateNames || '', synonyms: test.synonyms || '', alsoKnownAs: test.alsoKnownAs || '',
      languages: test.languages || defaultLanguages(),
      category: test.category || 'Hematology', subcategory: test.subcategory || '', department: test.department || '', bodyOrgan: test.bodyOrgan || '', diseaseGroup: test.diseaseGroup || '',
      gender: test.gender || 'Both', ageGroup: test.ageGroup || 'All', testType: test.testType || 'Diagnostic',
      shortDescription: test.shortDescription || '', longDescription: test.longDescription || '',
      whatIsThis: test.whatIsThis || '', whyDone: test.whyDone || '', whatMeasures: test.whatMeasures || '',
      clinicalSignificance: test.clinicalSignificance || '', whoShouldTake: test.whoShouldTake || '', symptoms: test.symptoms || '', diseases: test.diseases || '',
      preparation: test.preparation_instructions || test.preparation || '', fastingRequired: test.fasting_required || false,
      sampleType: test.sampleType || 'Blood', sampleVolume: test.sampleVolume || '', collectionProcess: test.collectionProcess || '',
      reportTime: test.report_time || '24 hrs', resultExplanation: test.resultExplanation || '', normalRange: test.normalRange || '',
      riskLevel: test.riskLevel || '', limitations: test.limitations || '', medicationImpact: test.medicationImpact || '',
      lifestyleAdvice: test.lifestyleAdvice || '', sampleQualityIssues: test.sampleQualityIssues || '', followUpTests: test.followUpTests || '',
      biomarkers: test.biomarkers?.length ? test.biomarkers : defaultBiomarkers(),
      refRanges: test.refRanges?.length ? test.refRanges : defaultRefRanges(),
      mrp: test.mrp || test.price || 0, offerPrice: test.offerPrice || 0, discount: test.discount || 0,
      corporatePrice: test.corporatePrice || 0, insurancePrice: test.insurancePrice || 0, b2bPrice: test.b2bPrice || 0,
      homeCollectionFee: test.homeCollectionFee || 0, gst: test.gst || 18,
      bookingAvailable: test.bookingAvailable !== false, homeCollection: test.homeCollection !== false,
      locations: test.locations || '', sampleTypeBooking: test.sampleTypeBooking || 'Blood',
      reportDeliveryTime: test.reportDeliveryTime || '24 hrs', emergencyAvailable: test.emergencyAvailable || false,
      relatedTests: test.relatedTests || '', relatedPackages: test.relatedPackages || '',
      recommendedFor: test.recommendedFor || '', frequentlyBought: test.frequentlyBought || '', crossSell: test.crossSell || '',
      faqs: test.faqs?.length ? test.faqs : defaultFaqs(),
      seoUrl: test.seoUrl || '', metaTitle: test.metaTitle || '', metaDescription: test.metaDescription || '',
      keywords: test.keywords || '', schemaMarkup: test.schemaMarkup || '', socialImage: test.socialImage || '',
      status: test.status || 'Active',
    };
    setForm(mapped);
    setEditingId(test.id);
    setActiveSection('identity');
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSave = () => {
    const id = editingId || Date.now();
    const data = { ...form };
    data.price = Number(data.offerPrice) || Number(data.mrp) || 0;
    data.preparation_instructions = data.preparation;
    data.fasting_required = data.fastingRequired;
    data.report_time = data.reportTime;
    if (!data.name) { alert('${t('admin.test_master.name_required', 'Test name is required')}'); return; }
    persist(id, data);
    setShowForm(false);
    setEditingId(null);
  };

  const handleNew = () => {
    setForm(emptyTest());
    setEditingId(null);
    setActiveSection('identity');
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm('${t('admin.test_master.delete_confirm', 'Delete this test?')}')) return;
    const next = { ...extendedData };
    delete next[id];
    setExtendedData(next);
    saveData(next);
  };

  const handleDuplicate = (test) => {
    const data = { ...test, name: test.name + t('admin.test_master.copy', ' (Copy)') };
    const id = Date.now();
    persist(id, data);
  };

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const updateNested = (obj, key, value) => setForm(f => ({ ...f, [obj]: { ...f[obj], [key]: value } }));

  const sections = [
    { id: 'identity', label: 'Test Identity', icon: '🆔' },
    { id: 'classification', label: 'Classification', icon: '📂' },
    { id: 'content', label: 'Website Content', icon: '✍️' },
    { id: 'education', label: 'Patient Education', icon: '📖' },
    { id: 'biomarkers', label: 'Biomarker Management', icon: '🧬' },
    { id: 'refRanges', label: 'Reference Ranges', icon: '📏' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'booking', label: 'Booking Settings', icon: '📅' },
    { id: 'marketing', label: 'Related Marketing', icon: '📣' },
    { id: 'faqs', label: 'FAQ Management', icon: '❓' },
    { id: 'seo', label: 'SEO Management', icon: '🔍' },
    { id: 'status', label: 'Test Status', icon: '✅' },
  ];

  if (showForm) return renderForm();
  return renderList();

  function renderForm() {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => setShowForm(false)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>← Back</button>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#0f172a', flex: 1 }}>{editingId ? `${t('admin.test_master.edit_label', 'Edit:')} ${form.name || 'New Test'}` : t('admin.test_master.add_new', 'Add New Test')}</h2>
          <button onClick={handleSave} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>💾 Save Test</button>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16, padding: '4px 0', borderBottom: '1px solid #e2e8f0' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: activeSection === s.id ? '#1866C9' : '#f1f5f9', color: activeSection === s.id ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 20 }}>
          {activeSection === 'identity' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s1_test_identity', 'SECTION 1: Test Identity')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Test ID" value={form.testId} onChange={v => updateForm('testId', v)} />
                <Field label="Internal Test Code" value={form.internalCode} onChange={v => updateForm('internalCode', v)} />
                <Field label="LIS Code" value={form.lisCode} onChange={v => updateForm('lisCode', v)} />
                <Field label="LOINC Code" value={form.loincCode} onChange={v => updateForm('loincCode', v)} />
                <Field label="CPT Code" value={form.cptCode} onChange={v => updateForm('cptCode', v)} />
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Test Name *" value={form.name} onChange={v => updateForm('name', v)} required />
                <Field label="Full Test Name" value={form.fullName} onChange={v => updateForm('fullName', v)} />
                <Field label="Scientific Name" value={form.scientificName} onChange={v => updateForm('scientificName', v)} />
              </div>
              <Field label="Abbreviation" value={form.abbreviation} onChange={v => updateForm('abbreviation', v)} />
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: 0 }}>Alternate Names</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="Alternate Names" value={form.alternateNames} onChange={v => updateForm('alternateNames', v)} />
                <Field label="Synonyms" value={form.synonyms} onChange={v => updateForm('synonyms', v)} />
                <Field label="Also Known As" value={form.alsoKnownAs} onChange={v => updateForm('alsoKnownAs', v)} />
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <h4 style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: 0 }}>Regional Languages</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                <Field label="Hindi" value={form.languages.hindi} onChange={v => updateNested('languages', 'hindi', v)} />
                <Field label="Telugu" value={form.languages.telugu} onChange={v => updateNested('languages', 'telugu', v)} />
                <Field label="Tamil" value={form.languages.tamil} onChange={v => updateNested('languages', 'tamil', v)} />
                <Field label="Kannada" value={form.languages.kannada} onChange={v => updateNested('languages', 'kannada', v)} />
              </div>
            </div>
          )}

          {activeSection === 'classification' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s2_classification', 'SECTION 2: Classification')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Select label="Category" value={form.category} onChange={v => updateForm('category', v)} options={CATEGORIES} />
                <Select label="Sub Category" value={form.subcategory} onChange={v => updateForm('subcategory', v)} options={SUBCATEGORIES} />
                <Select label="Department" value={form.department} onChange={v => updateForm('department', v)} options={DEPARTMENTS} />
                <Select label="Body Organ" value={form.bodyOrgan} onChange={v => updateForm('bodyOrgan', v)} options={BODY_ORGANS} />
                <Select label="Disease Group" value={form.diseaseGroup} onChange={v => updateForm('diseaseGroup', v)} options={DISEASE_GROUPS} />
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <Label>Gender</Label>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {GENDERS.map(g => (
                      <button key={g} onClick={() => updateForm('gender', g)}
                        style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `2px solid ${form.gender === g ? '#1866C9' : '#e2e8f0'}`, background: form.gender === g ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: form.gender === g ? 600 : 400, fontFamily: 'inherit', color: form.gender === g ? '#1866C9' : '#64748b' }}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Age Group</Label>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {AGE_GROUPS.map(a => (
                      <button key={a} onClick={() => updateForm('ageGroup', a)}
                        style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `2px solid ${form.ageGroup === a ? '#1866C9' : '#e2e8f0'}`, background: form.ageGroup === a ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 10, fontWeight: form.ageGroup === a ? 600 : 400, fontFamily: 'inherit', color: form.ageGroup === a ? '#1866C9' : '#64748b' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Test Type</Label>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {TEST_TYPES.map(t => (
                      <button key={t} onClick={() => updateForm('testType', t)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: `2px solid ${form.testType === t ? '#1866C9' : '#e2e8f0'}`, background: form.testType === t ? '#eff6ff' : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: form.testType === t ? 600 : 400, fontFamily: 'inherit', color: form.testType === t ? '#1866C9' : '#64748b' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'content' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s3_content', 'SECTION 3: Website Content')}</h3>
              <TextArea label="Short Description" value={form.shortDescription} onChange={v => updateForm('shortDescription', v)} rows={2} />
              <TextArea label="Long Description" value={form.longDescription} onChange={v => updateForm('longDescription', v)} rows={4} />
              <TextArea label="What is this Test?" value={form.whatIsThis} onChange={v => updateForm('whatIsThis', v)} rows={3} />
              <TextArea label="Why is this Test Done?" value={form.whyDone} onChange={v => updateForm('whyDone', v)} rows={3} />
              <TextArea label="What Does This Measure?" value={form.whatMeasures} onChange={v => updateForm('whatMeasures', v)} rows={3} />
              <TextArea label="Clinical Significance" value={form.clinicalSignificance} onChange={v => updateForm('clinicalSignificance', v)} rows={3} />
              <TextArea label="Who Should Take This Test?" value={form.whoShouldTake} onChange={v => updateForm('whoShouldTake', v)} rows={3} />
              <TextArea label="Symptoms Related" value={form.symptoms} onChange={v => updateForm('symptoms', v)} rows={2} />
              <TextArea label="Diseases Related" value={form.diseases} onChange={v => updateForm('diseases', v)} rows={2} />
            </div>
          )}

          {activeSection === 'education' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s4_education', 'SECTION 4: Patient Education')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <input type="checkbox" checked={form.fastingRequired} onChange={e => updateForm('fastingRequired', e.target.checked)} /> Fasting Required
                  </label>
                </div>
                <Select label="Sample Type" value={form.sampleType} onChange={v => updateForm('sampleType', v)} options={SAMPLE_TYPES} />
                <Field label="Sample Volume" value={form.sampleVolume} onChange={v => updateForm('sampleVolume', v)} />
                <Select label="Report Time" value={form.reportTime} onChange={v => updateForm('reportTime', v)} options={REPORT_TIMES} />
              </div>
              <TextArea label="Preparation Instructions" value={form.preparation} onChange={v => updateForm('preparation', v)} rows={2} />
              <TextArea label="Collection Process" value={form.collectionProcess} onChange={v => updateForm('collectionProcess', v)} rows={2} />
              <TextArea label="Result Explanation" value={form.resultExplanation} onChange={v => updateForm('resultExplanation', v)} rows={3} />
              <TextArea label="Normal Range" value={form.normalRange} onChange={v => updateForm('normalRange', v)} rows={2} />
              <TextArea label="Risk Level" value={form.riskLevel} onChange={v => updateForm('riskLevel', v)} rows={2} />
              <TextArea label="Limitations" value={form.limitations} onChange={v => updateForm('limitations', v)} rows={2} />
              <TextArea label="Medication Impact" value={form.medicationImpact} onChange={v => updateForm('medicationImpact', v)} rows={2} />
              <TextArea label="Lifestyle Advice" value={form.lifestyleAdvice} onChange={v => updateForm('lifestyleAdvice', v)} rows={2} />
              <TextArea label="Sample Quality Issues" value={form.sampleQualityIssues} onChange={v => updateForm('sampleQualityIssues', v)} rows={2} />
              <TextArea label="Follow-up Tests" value={form.followUpTests} onChange={v => updateForm('followUpTests', v)} rows={2} />
            </div>
          )}

          {activeSection === 'biomarkers' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s5_biomarkers', 'SECTION 5: Biomarker Management')}</h3>
              {form.biomarkers.map((b, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>Biomarker #{i + 1}</span>
                    <button onClick={() => {
                      const arr = form.biomarkers.filter((_, idx) => idx !== i);
                      updateForm('biomarkers', arr);
                    }} style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Field label="Biomarker Name" value={b.biomarkerName} onChange={v => { const arr = [...form.biomarkers]; arr[i] = { ...arr[i], biomarkerName: v }; updateForm('biomarkers', arr); }} />
                    <Field label="Reference Values" value={b.referenceValues} onChange={v => { const arr = [...form.biomarkers]; arr[i] = { ...arr[i], referenceValues: v }; updateForm('biomarkers', arr); }} />
                    <div style={{ gridColumn: 'span 2' }}>
                      <TextArea label="Description" value={b.description} onChange={v => { const arr = [...form.biomarkers]; arr[i] = { ...arr[i], description: v }; updateForm('biomarkers', arr); }} rows={2} />
                    </div>
                    <TextArea label="Body Function" value={b.bodyFunction} onChange={v => { const arr = [...form.biomarkers]; arr[i] = { ...arr[i], bodyFunction: v }; updateForm('biomarkers', arr); }} rows={2} />
                    <TextArea label="Clinical Importance" value={b.clinicalImportance} onChange={v => { const arr = [...form.biomarkers]; arr[i] = { ...arr[i], clinicalImportance: v }; updateForm('biomarkers', arr); }} rows={2} />
                    <TextArea label="Related Diseases" value={b.relatedDiseases} onChange={v => { const arr = [...form.biomarkers]; arr[i] = { ...arr[i], relatedDiseases: v }; updateForm('biomarkers', arr); }} rows={2} style={{ gridColumn: 'span 2' }} />
                  </div>
                </div>
              ))}
              <button onClick={() => updateForm('biomarkers', [...form.biomarkers, defaultBiomarkers()[0]])}
                style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>
                + Add Biomarker
              </button>
            </div>
          )}

          {activeSection === 'refRanges' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s6_ref_ranges', 'SECTION 6: Reference Range Management')}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Define age-wise and gender-wise reference ranges.</p>
              {form.refRanges.map((r, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>Range #{i + 1}</span>
                    <button onClick={() => { const arr = form.refRanges.filter((_, idx) => idx !== i); updateForm('refRanges', arr); }}
                      style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <Select label="Age Group" value={r.ageGroup} onChange={v => { const arr = [...form.refRanges]; arr[i] = { ...arr[i], ageGroup: v }; updateForm('refRanges', arr); }} options={['All', '0-18 Years', '19-60 Years', '60+ Years']} />
                    <Select label="Gender" value={r.gender} onChange={v => { const arr = [...form.refRanges]; arr[i] = { ...arr[i], gender: v }; updateForm('refRanges', arr); }} options={['Both', 'Male', 'Female']} />
                    <Field label="Unit" value={r.unit} onChange={v => { const arr = [...form.refRanges]; arr[i] = { ...arr[i], unit: v }; updateForm('refRanges', arr); }} />
                    <Field label="Normal Range" value={r.normalRange} onChange={v => { const arr = [...form.refRanges]; arr[i] = { ...arr[i], normalRange: v }; updateForm('refRanges', arr); }} />
                    <Field label="Critical Range" value={r.criticalRange} onChange={v => { const arr = [...form.refRanges]; arr[i] = { ...arr[i], criticalRange: v }; updateForm('refRanges', arr); }} />
                    <Field label="Interpretation" value={r.interpretation} onChange={v => { const arr = [...form.refRanges]; arr[i] = { ...arr[i], interpretation: v }; updateForm('refRanges', arr); }} />
                  </div>
                </div>
              ))}
              <button onClick={() => updateForm('refRanges', [...form.refRanges, defaultRefRanges()[0]])}
                style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>
                + Add Reference Range
              </button>
            </div>
          )}

          {activeSection === 'pricing' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s7_pricing', 'SECTION 7: Pricing Management')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <Field label="MRP (₹)" value={form.mrp} onChange={v => updateForm('mrp', Number(v))} type="number" />
                <Field label="Offer Price (₹)" value={form.offerPrice} onChange={v => updateForm('offerPrice', Number(v))} type="number" />
                <Field label="Discount %" value={form.discount} onChange={v => updateForm('discount', Number(v))} type="number" />
                <Field label="Corporate Price (₹)" value={form.corporatePrice} onChange={v => updateForm('corporatePrice', Number(v))} type="number" />
                <Field label="Insurance Price (₹)" value={form.insurancePrice} onChange={v => updateForm('insurancePrice', Number(v))} type="number" />
                <Field label="B2B Price (₹)" value={form.b2bPrice} onChange={v => updateForm('b2bPrice', Number(v))} type="number" />
                <Field label="Home Collection Fee (₹)" value={form.homeCollectionFee} onChange={v => updateForm('homeCollectionFee', Number(v))} type="number" />
                <Field label="GST (%)" value={form.gst} onChange={v => updateForm('gst', Number(v))} type="number" />
              </div>
              {form.mrp > 0 && form.offerPrice > 0 && (
                <div style={{ padding: '10px 14px', background: form.discount > 0 ? '#ecfdf5' : '#fffbeb', borderRadius: 8, fontSize: 12 }}>
                  {form.discount > 0
                    ? `✅ You save ₹${form.mrp - form.offerPrice} (${form.discount}% off)`
                    : `ℹ️ Discount: ${Math.round((1 - form.offerPrice / form.mrp) * 100)}% — Update discount field to match`}
                </div>
              )}
            </div>
          )}

          {activeSection === 'booking' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s8_booking', 'SECTION 8: Booking Settings')}</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={form.bookingAvailable} onChange={e => updateForm('bookingAvailable', e.target.checked)} /> Booking Available
                </label>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={form.homeCollection} onChange={e => updateForm('homeCollection', e.target.checked)} /> Home Collection
                </label>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={form.emergencyAvailable} onChange={e => updateForm('emergencyAvailable', e.target.checked)} /> Emergency Available
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <TextArea label="Available Locations (one per line)" value={form.locations} onChange={v => updateForm('locations', v)} rows={3} />
                <Select label="Sample Type (Booking)" value={form.sampleTypeBooking} onChange={v => updateForm('sampleTypeBooking', v)} options={SAMPLE_TYPES} />
                <Select label="Report Delivery Time" value={form.reportDeliveryTime} onChange={v => updateForm('reportDeliveryTime', v)} options={REPORT_TIMES} />
              </div>
            </div>
          )}

          {activeSection === 'marketing' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s9_marketing', 'SECTION 9: Related Marketing')}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <TextArea label="Related Tests (comma separated)" value={form.relatedTests} onChange={v => updateForm('relatedTests', v)} rows={2} />
                <TextArea label="Related Packages (comma separated)" value={form.relatedPackages} onChange={v => updateForm('relatedPackages', v)} rows={2} />
                <TextArea label="Recommended For" value={form.recommendedFor} onChange={v => updateForm('recommendedFor', v)} rows={2} />
                <TextArea label="Frequently Bought Together" value={form.frequentlyBought} onChange={v => updateForm('frequentlyBought', v)} rows={2} />
                <TextArea label="Cross Selling Tests" value={form.crossSell} onChange={v => updateForm('crossSell', v)} rows={2} />
              </div>
            </div>
          )}

          {activeSection === 'faqs' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s10_faqs', 'SECTION 10: FAQ Management')}</h3>
              {form.faqs.map((f, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: 14, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>FAQ #{i + 1}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <input type="checkbox" checked={f.active} onChange={e => { const arr = [...form.faqs]; arr[i] = { ...arr[i], active: e.target.checked }; updateForm('faqs', arr); }} /> Active
                      </label>
                      <button onClick={() => { const arr = form.faqs.filter((_, idx) => idx !== i); updateForm('faqs', arr); }}
                        style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Remove</button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <Field label="Question" value={f.question} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], question: v }; updateForm('faqs', arr); }} />
                    <TextArea label="Answer" value={f.answer} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], answer: v }; updateForm('faqs', arr); }} rows={2} />
                    <Field label="Display Order" value={f.order} onChange={v => { const arr = [...form.faqs]; arr[i] = { ...arr[i], order: Number(v) }; updateForm('faqs', arr); }} type="number" />
                  </div>
                </div>
              ))}
              <button onClick={() => updateForm('faqs', [...form.faqs, defaultFaqs()[0]])}
                style={{ padding: '8px 16px', borderRadius: 8, border: '2px dashed #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#64748b', fontFamily: 'inherit' }}>
                + Add FAQ
              </button>
            </div>
          )}

          {activeSection === 'seo' && (
            <div style={{ display: 'grid', gap: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s11_seo', 'SECTION 11: SEO Management')}</h3>
              <Field label="SEO URL" value={form.seoUrl} onChange={v => updateForm('seoUrl', v)} placeholder="/test/hba1c" />
              <Field label="Meta Title" value={form.metaTitle} onChange={v => updateForm('metaTitle', v)} />
              <TextArea label="Meta Description" value={form.metaDescription} onChange={v => updateForm('metaDescription', v)} rows={2} />
              <TextArea label="Keywords (comma separated)" value={form.keywords} onChange={v => updateForm('keywords', v)} rows={2} />
              <TextArea label="Schema Markup (JSON-LD)" value={form.schemaMarkup} onChange={v => updateForm('schemaMarkup', v)} rows={4} />
              <Field label="Social Share Image URL" value={form.socialImage} onChange={v => updateForm('socialImage', v)} />
            </div>
          )}

          {activeSection === 'status' && (
            <div style={{ display: 'grid', gap: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>${t('admin.test_master.s12_status', 'SECTION 12: Test Status')}</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {STATUS_OPTIONS.map(s => {
                  const colors = { Draft: { bg: '#f1f5f9', text: '#64748b' }, Active: { bg: '#dcfce7', text: '#16a34a' }, Inactive: { bg: '#fee2e2', text: '#dc2626' }, 'Temporarily Unavailable': { bg: '#fef3c7', text: '#d97706' }, 'Coming Soon': { bg: '#dbeafe', text: '#2563eb' } };
                  const c = colors[s] || { bg: '#f1f5f9', text: '#64748b' };
                  return (
                    <button key={s} onClick={() => updateForm('status', s)}
                      style={{ padding: '10px 18px', borderRadius: 10, border: `3px solid ${form.status === s ? c.text : '#e2e8f0'}`, background: form.status === s ? c.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', minWidth: 100 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{s}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderList() {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t('admin.test_master.test_mgmt', 'Test Management')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Manage all {filtered.length} tests — Master data for the entire platform</p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 180, maxWidth: 280, fontSize: 13, padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontFamily: 'inherit', outline: 'none' }} />
          <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">{t('admin.test_master.all_categories', 'All Categories')}</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff' }}>
            <option value="all">{t('admin.test_master.all_status', 'All Status')}</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleNew} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1866C9', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>+ {t('admin.test_master.add_test', 'Add Test')}</button>
          <button onClick={() => {
            if (!confirm(`Generate complete data for all ${seedTests.length} tests? This will overwrite existing data.`)) return;
            const data = generateAllTestsData();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setExtendedData(data);
            alert(`Generated complete data for ${Object.keys(data).length} tests!`);
          }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>⚡ Generate All</button>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>{t('admin.test_master.test_name_header', 'Test Name')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>{t('admin.test_master.category_header', 'Category')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>{t('admin.test_master.price_header', 'Price')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: 11 }}>{t('admin.test_master.report_header', 'Report')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: 11 }}>{t('admin.test_master.status_header', 'Status')}</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: 11 }}>{t('admin.test_master.actions_header', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const statusColor = { Draft: '#64748b', Active: '#16a34a', Inactive: '#dc2626', 'Temporarily Unavailable': '#d97706', 'Coming Soon': '#2563eb' }[t.status] || '#64748b';
                const statusBg = { Draft: '#f1f5f9', Active: '#dcfce7', Inactive: '#fee2e2', 'Temporarily Unavailable': '#fef3c7', 'Coming Soon': '#dbeafe' }[t.status] || '#f1f5f9';
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8' }}>#{t.id}</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{t.category}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>₹{t.offerPrice || t.price}</div>
                      {t.mrp > (t.offerPrice || t.price) && <div style={{ fontSize: 10, color: '#94a3b8', textDecoration: 'line-through' }}>₹{t.mrp}</div>}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569', fontSize: 11 }}>{t.report_time || '24 hrs'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: statusBg, color: statusColor }}>{t.status || 'Active'}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <ActionBtn label="View" color="#1866C9" onClick={() => openEdit(t)} />
                        <ActionBtn label="Copy" color="#7c3aed" onClick={() => handleDuplicate(t)} />
                        <ActionBtn label="Del" color="#dc2626" onClick={() => handleDelete(t.id)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>{t('admin.test_master.no_tests', 'No tests found matching your filters')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 3 }}>{label}{required && ' *'}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 3 }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 3 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 3 }}>{children}</div>;
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick}
      style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${color}30`, background: `${color}08`, color, cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}
