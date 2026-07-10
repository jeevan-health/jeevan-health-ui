import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import {
  nursingCategories, nursingServices, nurseLevels, nurses, nursingPackages,
  equipmentItems, STORAGE_KEYS,
} from '../data/nursingData';

const CATEGORY_EQUIPMENT_MAP = {
  'wound-care': [],
  'injections': [],
  'elderly-care': ['Wheelchair', 'Patient Lift', 'Commode Chair', 'Hospital Bed'],
  'mother-baby': [],
  'post-surgery': ['Wheelchair', 'Commode Chair', 'Nebulizer'],
  'bedside': ['Hospital Bed', 'Patient Lift', 'Commode Chair', 'Oxygen Concentrator'],
  'rehab': ['Wheelchair', 'Patient Lift'],
  'icu-home': ['Oxygen Concentrator', 'Multipara Monitor', 'Suction Machine', 'Hospital Bed'],
  'palliative': ['Hospital Bed', 'Commode Chair', 'Patient Lift'],
};

const C = { primary: '#7C3AED', accent: '#EC4899', bg: '#F5F3FF' };

const STEPS = [
  { id: 'patient', label: 'nurse.step.patient', icon: '👤' },
  { id: 'service', label: 'nurse.step.service', icon: '🩺' },
  { id: 'schedule', label: 'nurse.step.schedule', icon: '📅' },
  { id: 'nurse', label: 'nurse.step.nurse', icon: '👩‍⚕️' },
  { id: 'addons', label: 'nurse.step.addons', icon: '➕' },
  { id: 'payment', label: 'nurse.step.payment', icon: '💳' },
];

const TIME_SLOTS = [
  { label: '6:00 AM - 8:00 AM', value: '6-8' }, { label: '8:00 AM - 10:00 AM', value: '8-10' },
  { label: '10:00 AM - 12:00 PM', value: '10-12' }, { label: '12:00 PM - 2:00 PM', value: '12-14' },
  { label: '2:00 PM - 4:00 PM', value: '14-16' }, { label: '4:00 PM - 6:00 PM', value: '16-18' },
  { label: '6:00 PM - 8:00 PM', value: '18-20' }, { label: '8:00 PM - 10:00 PM', value: '20-22' },
];

const DURATION_OPTIONS = ['15 min', '30 min', '45 min', '60 min', '2 hours', '4 hours', '8 hours', '12 hours', '24 hours'];

const URGENCY_OPTIONS = [
  { id: 'standard', label: 'nurse.standard', desc: 'nurse.standard.desc', color: '#10B981' },
  { id: 'urgent', label: 'nurse.urgent', desc: 'nurse.urgent.desc', color: '#F59E0B' },
  { id: 'emergency', label: 'nurse.emergency', desc: 'nurse.emergency.desc', color: '#EF4444' },
];

const PAYMENT_OPTIONS = [
  { id: 'online', label: 'nurse.pay.online', desc: 'Pay with UPI, Cards, Net Banking', icon: '💳' },
  { id: 'cash', label: 'nurse.pay.cash', desc: 'Pay cash to the nurse after service', icon: '💵' },
  { id: 'insurance', label: 'nurse.pay.insurance', desc: 'Submit insurance claim', icon: '🛡️' },
];

export default function NurseBookingEnhanced() {
  const t = useT();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSlug = searchParams.get('service');
  const prePlan = searchParams.get('plan');

  const [step, setStep] = useState(preSlug || prePlan ? 1 : 0);
  const [catFilter, setCatFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showAllAddons, setShowAllAddons] = useState(false);

  const [data, setData] = useState({
    service: nursingServices.find(s => s.slug === preSlug) || null,
    nurse: null, noPreference: false,
    patientName: '', patientPhone: '', patientEmail: '', patientAddress: '',
    patientCity: '', patientPincode: '', patientLandmark: '',
    patientAge: '', patientGender: '', medicalNotes: '',
    preferredDate: '', preferredTime: '', duration: '', urgency: 'standard',
    dateOption: 'today',
    condition: '', hospitalName: '', doctorName: '', surgeryDetails: '', currentMedication: '',
    documents: [], paymentMethod: 'online',
    assessmentRequired: true, assessmentNotes: '',
    carePlanDuration: prePlan || '',
    selectedPackage: null,
    equipment: [],
  });
  const [confirmed, setConfirmed] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [crossSellItems, setCrossSellItems] = useState([]);
  const [crossSellDismissed, setCrossSellDismissed] = useState(false);
  const [crossSellAdded, setCrossSellAdded] = useState(false);

  const update = (key, val) => { setData(d => ({ ...d, [key]: val })); setErrors(e => ({ ...e, [key]: null })); };

  const toggleEquipment = (item) => {
    setData(d => {
      const exists = d.equipment.find(e => e.id === item.id);
      if (exists) return { ...d, equipment: d.equipment.filter(e => e.id !== item.id) };
      return { ...d, equipment: [...d.equipment, { ...item, quantity: 1, rentDays: 1 }] };
    });
  };

  const updateEquipment = (id, key, val) => {
    setData(d => ({ ...d, equipment: d.equipment.map(e => e.id === id ? { ...e, [key]: val } : e) }));
  };

  const filteredServices = catFilter === 'all' ? nursingServices : nursingServices.filter(s => s.category === catFilter);

  const filteredNurses = data.service
    ? nurses.filter(n => {
        const matchesSpecialty = n.specialties.includes(data.service.category);
        const matchesLevel = levelFilter === 'all' || n.level === levelFilter;
        return matchesSpecialty && matchesLevel;
      })
    : [];

  const baseRate = nurseLevels.find(l => l.id === 'staff-nurse')?.hourlyRate || 599;
  const getNurseSurcharge = () => {
    if (!data.nurse) return 0;
    const nl = nurseLevels.find(l => l.id === data.nurse.level);
    return nl ? Math.max(0, nl.hourlyRate - baseRate) : 0;
  };
  const surcharge = getNurseSurcharge();
  const equipmentTotal = data.equipment.reduce((sum, e) => sum + e.price * (e.quantity || 1) * (e.rentDays || 1), 0);
  const packageDiscount = data.selectedPackage
    ? (data.service?.price || 0) - (nursingPackages.find(p => p.id === data.selectedPackage)?.price || 0)
    : 0;
  const servicePrice = data.selectedPackage
    ? (nursingPackages.find(p => p.id === data.selectedPackage)?.price || data.service?.price || 0)
    : (data.service?.price || 0);
  const totalAmount = servicePrice + surcharge + equipmentTotal;

  const formatDate = (offset) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
  const todayStr = formatDate(0);

  const dateOptions = [
    { label: t('nurse.today', 'Today'), value: 'today', dateVal: formatDate(0) },
    { label: t('nurse.tomorrow', 'Tomorrow'), value: 'tomorrow', dateVal: formatDate(1) },
    { label: t('nurse.dayafter', 'Day After'), value: 'dayafter', dateVal: formatDate(2) },
    { label: t('nurse.custom', 'Custom Date'), value: 'custom', dateVal: '' },
  ];

  const validateStep = (s) => {
    const errs = {};
    if (s === 0) {
      if (!data.patientName?.trim()) errs.patientName = t('nurse.err.name', 'Name is required');
      if (!/^[0-9]{10}$/.test(data.patientPhone)) errs.patientPhone = t('nurse.err.phone', 'Valid 10-digit mobile is required');
      if (!data.patientEmail?.includes('@')) errs.patientEmail = t('nurse.err.email', 'Valid email is required');
      if (!data.patientAddress?.trim()) errs.patientAddress = t('nurse.err.address', 'Address is required');
      if (!data.patientAge || data.patientAge < 1 || data.patientAge > 150) errs.patientAge = t('nurse.err.age', 'Valid age is required');
      if (!data.patientGender) errs.patientGender = t('nurse.err.gender', 'Gender is required');
    }
    if (s === 1 && !data.service) errs.service = t('nurse.err.service', 'Please select a service');
    if (s === 2) {
      if (!data.preferredDate) errs.preferredDate = t('nurse.err.date', 'Please select a date');
      if (!data.preferredTime) errs.preferredTime = t('nurse.err.time', 'Please select a time slot');
    }
    if (s === 3 && !data.nurse && !data.noPreference) errs.nurse = t('nurse.err.nurse', 'Please select a nurse or choose auto-assign');
    if (s === 5 && !data.paymentMethod) errs.paymentMethod = t('nurse.err.payment', 'Please select a payment method');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(s + 1, 5)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const handleDocUpload = () => {
    setUploadingDoc(true);
    setTimeout(() => {
      const docs = [...data.documents, { id: Date.now(), name: `${t('nurse.document', 'Document')} ${data.documents.length + 1}`, type: 'prescription', uploadedAt: new Date().toISOString() }];
      update('documents', docs);
      setUploadingDoc(false);
    }, 1000);
  };

  const handleConfirm = () => {
    if (!validateStep(5)) return;
    setProcessing(true);
    setTimeout(() => {
      const booking = {
        id: 'NUR-' + Date.now().toString(36).toUpperCase(),
        serviceName: data.service?.name || '',
        servicePrice: servicePrice,
        serviceDuration: data.service?.duration || '',
        nurseName: data.noPreference ? 'Auto-assigned' : (data.nurse?.name || ''),
        nurseLevel: data.nurse?.level || '',
        patientName: data.patientName, patientPhone: data.patientPhone, patientEmail: data.patientEmail,
        patientAddress: data.patientAddress, patientCity: data.patientCity, patientPincode: data.patientPincode,
        patientLandmark: data.patientLandmark,
        patientAge: data.patientAge, patientGender: data.patientGender,
        medicalNotes: data.medicalNotes || '',
        condition: data.condition || '', hospitalName: data.hospitalName || '', doctorName: data.doctorName || '',
        surgeryDetails: data.surgeryDetails || '', currentMedication: data.currentMedication || '',
        documents: data.documents, paymentMethod: data.paymentMethod,
        assessmentRequired: data.assessmentRequired, assessmentNotes: data.assessmentNotes || '',
        carePlanDuration: data.carePlanDuration || '',
        preferredDate: data.preferredDate, preferredTime: data.preferredTime,
        duration: data.duration || data.service?.duration || '',
        urgency: data.urgency,
        selectedPackage: data.selectedPackage,
        equipment: data.equipment,
        packageDiscount, equipmentTotal,
        totalAmount, status: 'Pending Assessment',
        createdAt: new Date().toISOString(),
      };
      const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
      bookings.push(booking);
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
      const leads = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADS) || '[]');
      leads.push({ ...booking, leadId: 'LD-' + Date.now().toString(36).toUpperCase(), stage: 'call-centre', source: 'website-booking' });
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      setConfirmed(booking);
      setProcessing(false);
    }, 1500);
  };

  const getWALink = (booking) => {
    const msg = `Hello Jeevan Health! I have booked a nursing service.%0ABooking ID: ${booking.id}%0AService: ${booking.serviceName}%0ANurse: ${booking.nurseName}%0APatient: ${booking.patientName}%0ADate: ${booking.preferredDate}%0ATime: ${booking.preferredTime}%0AAmount: ₹${booking.totalAmount}`;
    return `https://wa.me/919700104108?text=${encodeURIComponent(msg)}`;
  };

  const suggestedEquipment = useMemo(() => {
    if (!confirmed?.serviceName) return [];
    const svc = nursingServices.find(s => s.name === confirmed.serviceName);
    if (!svc) return [];
    const eqNames = CATEGORY_EQUIPMENT_MAP[svc.category] || [];
    const alreadyBooked = (confirmed.equipment || []).map(e => e.name);
    return equipmentItems.filter(e => eqNames.includes(e.name) && !alreadyBooked.includes(e.name));
  }, [confirmed]);

  const addCrossSellItem = (item) => {
    setCrossSellItems(prev => {
      const exists = prev.find(e => e.id === item.id);
      if (exists) return prev.filter(e => e.id !== item.id);
      return [...prev, { ...item, quantity: 1, rentDays: 1 }];
    });
  };

  const updateCrossSellQty = (id, key, val) => {
    setCrossSellItems(prev => prev.map(e => e.id === id ? { ...e, [key]: val } : e));
  };

  const confirmCrossSell = () => {
    if (crossSellItems.length === 0) { setCrossSellDismissed(true); return; }
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    const updated = bookings.map(b => {
      if (b.id === confirmed.id) {
        const newEquipment = [...(b.equipment || []), ...crossSellItems];
        const newEquipmentTotal = (b.equipmentTotal || 0) + crossSellItems.reduce((s, e) => s + e.price * e.quantity * e.rentDays, 0);
        return { ...b, equipment: newEquipment, equipmentTotal: newEquipmentTotal, totalAmount: (b.totalAmount || 0) + newEquipmentTotal - (b.equipmentTotal || 0) };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    setConfirmed(updated.find(b => b.id === confirmed.id));
    setCrossSellAdded(true);
    setCrossSellItems([]);
  };

  const dismissCrossSell = () => {
    setCrossSellDismissed(true);
    localStorage.setItem('jh_vaccine_cross_sell_dismissed', JSON.stringify({ ...JSON.parse(localStorage.getItem('jh_vaccine_cross_sell_dismissed') || '{}'), [confirmed?.id]: true }));
  };

  const Stepper = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
      {STEPS.map((s, i) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, margin: '0 auto 3px',
              background: i < step ? C.primary : i === step ? C.primary : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8' }}>
              {i < step ? '✓' : s.icon}
            </div>
            <div style={{ fontSize: 8, color: i === step ? C.primary : '#94a3b8', fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap' }}>{t(s.label)}</div>
          </div>
          {i < STEPS.length - 1 && <div style={{ width: 20, height: 2, background: i < step ? C.primary : '#e2e8f0', marginBottom: 14 }} />}
        </div>
      ))}
    </div>
  );

  if (confirmed) {
    return (
      <div className="page-section container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: C.primary, marginBottom: 4 }}>{t('nurse.booking.confirmed', 'Booking Confirmed!')}</h2>
        <p style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>{t('nurse.booking.confirmed.desc', 'Your booking has been received. Our care manager will call you within 30 minutes for assessment.')}</p>
        <div style={{ padding: 16, borderRadius: 12, border: '1px solid #ede9fe', background: '#f5f3ff', marginBottom: 16, textAlign: 'left', fontSize: 12 }}>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.booking.id', 'Booking ID')}:</strong> {confirmed.id}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.service', 'Service')}:</strong> {confirmed.serviceName}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.nurse', 'Nurse')}:</strong> {confirmed.nurseName}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('patient', 'Patient')}:</strong> {confirmed.patientName}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('date', 'Date')}:</strong> {confirmed.preferredDate}</div>
          <div style={{ marginBottom: 6 }}><strong>{t('time', 'Time')}:</strong> {confirmed.preferredTime}</div>
          {confirmed.equipment?.length > 0 && (
            <div style={{ marginBottom: 6 }}><strong>{t('nurse.equipment', 'Equipment')}:</strong> {confirmed.equipment.map(e => e.name).join(', ')}</div>
          )}
          {confirmed.selectedPackage && (
            <div style={{ marginBottom: 6 }}><strong>{t('nurse.package', 'Package')}:</strong> {nursingPackages.find(p => p.id === confirmed.selectedPackage)?.name}</div>
          )}
          <div style={{ marginBottom: 6 }}><strong>{t('nurse.status', 'Status')}:</strong> <span style={{ padding: '2px 8px', borderRadius: 4, background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 600 }}>{confirmed.status}</span></div>
          <div style={{ borderTop: '1px solid #ede9fe', marginTop: 6, paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700 }}>{t('total', 'Total')}</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: C.primary }}>₹{confirmed.totalAmount}</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a' }}>
          📞 {t('nurse.booking.assessment', 'Our care manager will call you for a detailed assessment before assigning a nurse.')}
        </p>

        {/* Cross-sell Widget */}
        {suggestedEquipment.length > 0 && !crossSellDismissed && !crossSellAdded && (
          <div style={{ marginBottom: 16, padding: 16, borderRadius: 12, border: '2px solid #fbbf24', background: '#fffbeb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#92400e' }}>🛒 {t('nurse.crossSell.title', 'Need Equipment Too?')}</h4>
              <button onClick={dismissCrossSell} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#92400e', padding: '0 4px' }}>×</button>
            </div>
            <p style={{ fontSize: 11, color: '#b45309', margin: '0 0 10px' }}>{t('nurse.crossSell.desc', 'Based on your service, you may need:')}</p>
            <div style={{ display: 'grid', gap: 8 }}>
              {suggestedEquipment.map(item => {
                const selected = crossSellItems.find(e => e.id === item.id);
                return (
                  <div key={item.id} style={{ padding: 10, borderRadius: 8, border: selected ? '2px solid #f59e0b' : '1px solid #fde68a', background: selected ? '#fefce8' : '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{item.icon}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: 10, color: '#64748b' }}>₹{item.price}{item.duration}</div>
                        </div>
                      </div>
                      <button onClick={() => addCrossSellItem(item)}
                        style={{ padding: '5px 12px', borderRadius: 6, border: selected ? '1px solid #f59e0b' : 'none', background: selected ? '#fff' : '#f59e0b', color: selected ? '#92400e' : '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: 'inherit' }}>
                        {selected ? t('nurse.remove', 'Remove') : t('nurse.add', 'Add')}
                      </button>
                    </div>
                    {selected && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 8, borderTop: '1px solid #fde68a', paddingTop: 8 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 9, fontWeight: 600, color: '#92400e', display: 'block', marginBottom: 2 }}>{t('nurse.quantity', 'Qty')}</label>
                          <select value={selected.quantity} onChange={e => updateCrossSellQty(item.id, 'quantity', parseInt(e.target.value))}
                            style={{ width: '100%', padding: '4px 6px', borderRadius: 4, border: '1px solid #fde68a', fontSize: 10, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 9, fontWeight: 600, color: '#92400e', display: 'block', marginBottom: 2 }}>{t('nurse.rentDays', 'Days')}</label>
                          <select value={selected.rentDays} onChange={e => updateCrossSellQty(item.id, 'rentDays', parseInt(e.target.value))}
                            style={{ width: '100%', padding: '4px 6px', borderRadius: 4, border: '1px solid #fde68a', fontSize: 10, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
                            {[1, 2, 3, 5, 7, 10, 14, 21, 30].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>₹{item.price * selected.quantity * selected.rentDays}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {crossSellItems.length > 0 && (
              <button onClick={confirmCrossSell}
                style={{ width: '100%', marginTop: 10, padding: '10px 0', borderRadius: 8, border: 'none', background: '#f59e0b', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                🛒 {t('nurse.crossSell.addToBooking', 'Add to Booking')} — ₹{crossSellItems.reduce((s, e) => s + e.price * e.quantity * e.rentDays, 0)}
              </button>
            )}
            {crossSellItems.length === 0 && (
              <button onClick={() => setCrossSellDismissed(true)}
                style={{ width: '100%', marginTop: 6, padding: '8px 0', borderRadius: 8, border: '1px solid #fde68a', background: 'transparent', color: '#92400e', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('nurse.crossSell.noThanks', 'No thanks, I\'m all set')}
              </button>
            )}
          </div>
        )}

        {/* Cross-sell added confirmation */}
        {crossSellAdded && (
          <div style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 12, color: '#166534' }}>
            ✅ {t('nurse.crossSell.added', 'Equipment added to your booking! Our care manager will confirm availability.')}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={getWALink(confirmed)} target="_blank" rel="noopener noreferrer" style={{ height: 44, padding: '0 24px', borderRadius: 8, background: '#25d366', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            💬 {t('nurse.sendWhatsApp', 'Send WhatsApp Confirmation')}
          </a>
          <Link to="/nurse-at-home" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #d0d5dd', color: '#0f172a', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
            ← {t('nurse.back', 'Back to Nurse at Home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{t('nurse.booking.title', 'Book Nurse at Home')}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{t('nurse.booking.subtitle', 'Complete your booking in 6 easy steps')}</p>
      </div>

      <Stepper />

      <div style={{ padding: 24, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
        {/* Step 0: Patient Info & Address */}
        {step === 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nurse.patient.info', 'Patient Information')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.patient.info.desc', 'Tell us about the patient and service address')}</p>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('full.name', 'Full Name')} *</label>
                  <input value={data.patientName} onChange={e => update('patientName', e.target.value)} placeholder={t('nurse.name.placeholder', "Patient's full name")} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientName ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientName && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientName}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('mobile.number', 'Mobile Number')} *</label>
                  <input type="tel" value={data.patientPhone} onChange={e => update('patientPhone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientPhone ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientPhone && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientPhone}</p>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('age', 'Age')} *</label>
                  <input type="number" min={0} max={150} value={data.patientAge} onChange={e => update('patientAge', parseInt(e.target.value) || '')} placeholder="e.g. 35" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAge ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  {errors.patientAge && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAge}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('gender', 'Gender')} *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['male', 'female', 'other'].map(g => (
                      <button key={g} onClick={() => update('patientGender', g)}
                        style={{ flex: 1, padding: '10px 8px', borderRadius: 8, border: data.patientGender === g ? `2px solid ${C.primary}` : '1px solid #d0d5dd', background: data.patientGender === g ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.patientGender === g ? 700 : 400, color: data.patientGender === g ? C.primary : '#334155' }}>
                        {t(g, g.charAt(0).toUpperCase() + g.slice(1))}
                      </button>
                    ))}
                  </div>
                  {errors.patientGender && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientGender}</p>}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('email', 'Email')} *</label>
                <input type="email" value={data.patientEmail} onChange={e => update('patientEmail', e.target.value)} placeholder="email@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientEmail ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                {errors.patientEmail && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientEmail}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('address', 'Address')} *</label>
                <textarea value={data.patientAddress} onChange={e => update('patientAddress', e.target.value)} rows={2} placeholder={t('nurse.address.placeholder', 'Full address with street, area, city')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.patientAddress ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                {errors.patientAddress && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.patientAddress}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.city', 'City')}</label>
                  <input value={data.patientCity} onChange={e => update('patientCity', e.target.value)} placeholder="Hyderabad" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.pincode', 'Pincode')}</label>
                  <input value={data.patientPincode} onChange={e => update('patientPincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="500001" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.landmark', 'Landmark')}</label>
                  <input value={data.patientLandmark} onChange={e => update('patientLandmark', e.target.value)} placeholder="Near..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nurse.medical.background', 'Medical Background')} <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>({t('optional', 'optional')})</span></h4>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input value={data.condition} onChange={e => update('condition', e.target.value)} placeholder={t('nurse.condition.placeholder', 'Disease / Condition')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                    <input value={data.hospitalName} onChange={e => update('hospitalName', e.target.value)} placeholder={t('nurse.hospital.placeholder', 'Hospital Name')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <textarea value={data.medicalNotes} onChange={e => update('medicalNotes', e.target.value)} rows={2} placeholder={t('nurse.medical.notes.placeholder', 'Any allergies, medications, or special instructions...')} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nurse.select.service', 'Select a Service')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.select.service.desc', 'Choose the nursing care service you need')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
              <button onClick={() => setCatFilter('all')}
                style={{ padding: '6px 14px', borderRadius: 16, border: catFilter === 'all' ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: catFilter === 'all' ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: catFilter === 'all' ? 700 : 400, color: catFilter === 'all' ? C.primary : '#334155' }}>
                {t('all', 'All')}
              </button>
              {nursingCategories.map(cat => (
                <button key={cat.id} onClick={() => setCatFilter(cat.slug)}
                  style={{ padding: '6px 14px', borderRadius: 16, border: catFilter === cat.slug ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: catFilter === cat.slug ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              {filteredServices.map(svc => {
                const selected = data.service?.id === svc.id;
                const cat = nursingCategories.find(c => c.slug === svc.category);
                return (
                  <button key={svc.id} onClick={() => { update('service', svc); setErrors(e => ({ ...e, service: null })) }}
                    style={{ padding: 14, borderRadius: 12, border: selected ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: selected ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                    {selected && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: C.primary }}>✓</span>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{svc.name}</div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>₹{svc.price}</div>
                        {svc.originalPrice && <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>₹{svc.originalPrice}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      {cat && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#fdf2f8', color: '#EC4899', fontWeight: 600 }}>{cat.icon} {cat.name}</span>}
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#f0fdf4', color: '#059669', fontWeight: 600 }}>{svc.duration}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{svc.description}</p>
                  </button>
                );
              })}
            </div>
            {errors.service && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.service}</p>}
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nurse.schedule.title', 'Schedule Your Visit')}</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nurse.date', 'Preferred Date')} *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {dateOptions.map(opt => (
                    <button key={opt.value} onClick={() => { update('dateOption', opt.value); update('preferredDate', opt.value === 'custom' ? '' : opt.dateVal) }}
                      style={{ padding: '8px 14px', borderRadius: 8, border: data.dateOption === opt.value ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.dateOption === opt.value ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.dateOption === opt.value ? 700 : 400, color: data.dateOption === opt.value ? C.primary : '#334155' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {data.dateOption === 'custom' && (
                  <input type="date" value={data.preferredDate} onChange={e => update('preferredDate', e.target.value)} min={todayStr} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: errors.preferredDate ? '1.5px solid #dc2626' : '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                )}
                {errors.preferredDate && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredDate}</p>}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nurse.time', 'Preferred Time Slot')} *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot.value} onClick={() => update('preferredTime', slot.value)}
                      style={{ padding: '10px 12px', borderRadius: 8, border: data.preferredTime === slot.value ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.preferredTime === slot.value ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: data.preferredTime === slot.value ? 700 : 400, color: '#0f172a' }}>
                      {slot.label}
                    </button>
                  ))}
                </div>
                {errors.preferredTime && <p style={{ fontSize: 11, color: '#dc2626', margin: '2px 0 0' }}>{errors.preferredTime}</p>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nurse.duration', 'Duration')}</label>
                  <select value={data.duration} onChange={e => update('duration', e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 13, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    {data.service?.duration && <option value={data.service.duration}>{data.service.duration} ({t('nurse.recommended', 'Recommended')})</option>}
                    {DURATION_OPTIONS.filter(d => d !== data.service?.duration).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('nurse.urgency', 'Urgency')}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {URGENCY_OPTIONS.map(u => (
                      <button key={u.id} onClick={() => update('urgency', u.id)}
                        style={{ flex: 1, padding: '10px 6px', borderRadius: 8, border: data.urgency === u.id ? `2px solid ${u.color}` : '1px solid #e2e8f0', background: data.urgency === u.id ? `${u.color}10` : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', fontSize: 10, fontWeight: data.urgency === u.id ? 700 : 400 }}>
                        <div style={{ color: data.urgency === u.id ? u.color : '#0f172a' }}>{t(u.label)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#92400e', cursor: 'pointer' }}>
                  <input type="checkbox" checked={data.assessmentRequired} onChange={e => update('assessmentRequired', e.target.checked)} style={{ accentColor: C.primary }} />
                  {t('nurse.assessment.required', 'I need a care assessment call before service')}
                </label>
                {data.assessmentRequired && (
                  <textarea value={data.assessmentNotes} onChange={e => update('assessmentNotes', e.target.value)} rows={2}
                    placeholder={t('nurse.assessment.notes', 'Any specific requirements for the assessment call...')}
                    style={{ width: '100%', marginTop: 8, padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Nurse Selection */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nurse.select.nurse', 'Choose Your Nurse')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.select.nurse.desc', 'Select a nurse or let us assign the best available')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              <button onClick={() => setLevelFilter('all')}
                style={{ padding: '5px 12px', borderRadius: 12, border: levelFilter === 'all' ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: levelFilter === 'all' ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 10, fontWeight: levelFilter === 'all' ? 700 : 400, color: levelFilter === 'all' ? C.primary : '#334155' }}>
                {t('all', 'All')}
              </button>
              {nurseLevels.map(lvl => (
                <button key={lvl.id} onClick={() => setLevelFilter(lvl.id)}
                  style={{ padding: '5px 12px', borderRadius: 12, border: levelFilter === lvl.id ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: levelFilter === lvl.id ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 10, fontWeight: levelFilter === lvl.id ? 700 : 400, color: levelFilter === lvl.id ? C.primary : '#334155' }}>
                  {lvl.name}
                </button>
              ))}
            </div>
            {filteredNurses.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: 20 }}>{t('nurse.no.nurses', 'No nurses available for this service. Please try a different service.')}</p>
            ) : (
              <div style={{ display: 'grid', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
                {filteredNurses.map(n => {
                  const selected = data.nurse?.id === n.id;
                  const lvl = nurseLevels.find(l => l.id === n.level);
                  return (
                    <button key={n.id} onClick={() => { update('nurse', n); update('noPreference', false) }}
                      style={{ padding: 14, borderRadius: 12, border: selected ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: selected ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                      {selected && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: C.primary }}>✓</span>}
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 32 }}>{n.image}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{n.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                            {n.qualifications} · {n.experience} {t('nurse.years.exp', 'years exp')}
                            {lvl && <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 6, background: lvl.color + '20', color: lvl.color, fontWeight: 600, fontSize: 10 }}>{lvl.name}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                            <span>⭐ {n.rating} · {n.sessions} sessions</span>
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.languages.join(', ')}</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {n.availability.map((a, i) => (
                              <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8, background: '#fef3c7', color: '#d97706', fontWeight: 500 }}>📅 {a}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <button onClick={() => { update('nurse', null); update('noPreference', true) }}
              style={{ width: '100%', marginTop: 10, padding: '12px 16px', borderRadius: 10, border: data.noPreference ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.noPreference ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: data.noPreference ? C.primary : '#0f172a' }}>{t('nurse.auto.assign', 'No preference — Assign automatically')}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('nurse.auto.assign.desc', 'We will assign the best available nurse for your service')}</div>
            </button>
            {errors.nurse && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 8 }}>{errors.nurse}</p>}
          </div>
        )}

        {/* Step 4: Add-ons — Equipment + Package */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{t('nurse.addons.title', 'Add-ons & Upgrades')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('nurse.addons.desc', 'Add equipment rental or choose a package')}</p>

            {/* Package Upsell */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('nurse.packages.title', 'Save with Packages')}</h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {nursingPackages.map(pkg => {
                  const selected = data.selectedPackage === pkg.id;
                  const savings = pkg.originalPrice - pkg.price;
                  return (
                    <button key={pkg.id} onClick={() => update('selectedPackage', selected ? null : pkg.id)}
                      style={{ padding: 12, borderRadius: 10, border: selected ? `2px solid #F59E0B` : '1px solid #e2e8f0', background: selected ? '#fffbeb' : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', position: 'relative' }}>
                      {pkg.popular && <span style={{ position: 'absolute', top: -6, right: 8, padding: '2px 8px', borderRadius: 6, background: '#F59E0B', color: '#fff', fontSize: 9, fontWeight: 700 }}>{t('nurse.popular', 'Popular')}</span>}
                      {selected && <span style={{ position: 'absolute', top: 8, right: 8, fontSize: 16, color: '#F59E0B' }}>✓</span>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{pkg.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{pkg.description}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B' }}>₹{pkg.price}</div>
                          {savings > 0 && <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>Save ₹{savings}</div>}
                        </div>
                      </div>
                      <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {pkg.includes.map((item, i) => (
                          <span key={i} style={{ fontSize: 10, padding: '1px 8px', borderRadius: 4, background: '#f0fdf4', color: '#059669' }}>✓ {item}</span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equipment Cross-sell */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('nurse.equipment.title', 'Rent Medical Equipment')}</h4>
                <button onClick={() => setShowAllAddons(!showAllAddons)} style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, padding: 0 }}>
                  {showAllAddons ? t('nurse.showLess', 'Show less') : t('nurse.showAll', 'Show all')}
                </button>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {(showAllAddons ? equipmentItems : equipmentItems.slice(0, 4)).map(item => {
                  const selected = data.equipment.find(e => e.id === item.id);
                  return (
                    <div key={item.id} style={{ padding: 12, borderRadius: 10, border: selected ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: selected ? C.bg : '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: selected ? 8 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 24 }}>{item.icon}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>{item.description}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: C.primary }}>₹{item.price}<span style={{ fontSize: 10, fontWeight: 400, color: '#94a3b8' }}>{item.duration}</span></span>
                          <button onClick={() => toggleEquipment(item)}
                            style={{ padding: '6px 14px', borderRadius: 6, border: selected ? `1px solid ${C.primary}` : 'none', background: selected ? '#fff' : C.primary, color: selected ? C.primary : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                            {selected ? t('nurse.remove', 'Remove') : t('nurse.add', 'Add')}
                          </button>
                        </div>
                      </div>
                      {selected && (
                        <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 2 }}>{t('nurse.quantity', 'Qty')}</label>
                            <select value={selected.quantity} onChange={e => updateEquipment(item.id, 'quantity', parseInt(e.target.value))} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
                              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 10, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 2 }}>{t('nurse.rentDays', 'Days')}</label>
                            <select value={selected.rentDays} onChange={e => updateEquipment(item.id, 'rentDays', parseInt(e.target.value))} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none' }}>
                              {[1, 2, 3, 5, 7, 10, 14, 21, 30].map(n => <option key={n} value={n}>{n} {t('nurse.days', 'day(s)')}</option>)}
                            </select>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>₹{item.price * selected.quantity * selected.rentDays}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Payment & Confirm */}
        {step === 5 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>{t('nurse.payment.title', 'Payment & Confirm')}</h3>

            {/* Summary Card */}
            <div style={{ padding: 16, borderRadius: 12, background: C.bg, border: `1px solid ${C.primary}20`, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 10 }}>{t('nurse.review.summary', 'Booking Summary')}</div>
              <div style={{ display: 'grid', gap: 6 }}>
                <SummaryRow label={t('patient', 'Patient')} value={data.patientName} />
                <SummaryRow label={t('address', 'Address')} value={data.patientAddress} />
                <SummaryRow label={t('nurse.service', 'Service')} value={data.service?.name} />
                <SummaryRow label={t('nurse.duration', 'Duration')} value={data.duration || data.service?.duration} />
                <SummaryRow label={t('date', 'Date')} value={data.preferredDate} />
                <SummaryRow label={t('time', 'Time')} value={TIME_SLOTS.find(s => s.value === data.preferredTime)?.label || data.preferredTime} />
                <SummaryRow label={t('nurse.nurse', 'Nurse')} value={data.noPreference ? 'Auto-assigned' : data.nurse?.name} />
                {data.equipment.length > 0 && (
                  <SummaryRow label={t('nurse.equipment', 'Equipment')} value={data.equipment.map(e => `${e.name} x${e.quantity} (${e.rentDays}d)`).join(', ')} />
                )}
                {data.selectedPackage && (
                  <SummaryRow label={t('nurse.package', 'Package')} value={nursingPackages.find(p => p.id === data.selectedPackage)?.name} />
                )}
              </div>
              <div style={{ borderTop: `1px solid ${C.primary}20`, marginTop: 10, paddingTop: 10 }}>
                <SummaryRow label={t('nurse.service.charge', 'Service Charge')} value={`₹${servicePrice}`} />
                {surcharge > 0 && <SummaryRow label={t('nurse.nurse.surcharge', 'Nurse Level Surcharge')} value={`+ ₹${surcharge}`} />}
                {equipmentTotal > 0 && <SummaryRow label={t('nurse.equipment.total', 'Equipment Rental')} value={`+ ₹${equipmentTotal}`} />}
                {data.selectedPackage && packageDiscount > 0 && (
                  <SummaryRow label={t('nurse.package.discount', 'Package Discount')} value={`- ₹${packageDiscount}`} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, borderTop: `1px solid ${C.primary}30`, marginTop: 6, paddingTop: 8 }}>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{t('total', 'Total')}</span>
                  <span style={{ fontWeight: 800, color: C.primary }}>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{t('nurse.payment.method', 'Payment Method')}</h4>
            <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
              {PAYMENT_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => update('paymentMethod', opt.id)}
                  style={{ padding: 14, borderRadius: 10, border: data.paymentMethod === opt.id ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: data.paymentMethod === opt.id ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{t(opt.label)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{opt.desc}</div>
                  </div>
                  {data.paymentMethod === opt.id && <span style={{ marginLeft: 'auto', fontSize: 20, color: C.primary }}>✓</span>}
                </button>
              ))}
            </div>
            {errors.paymentMethod && <p style={{ fontSize: 11, color: '#dc2626', marginBottom: 8 }}>{errors.paymentMethod}</p>}

            <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', margin: 0 }}>
              {t('nurse.disclaimer', 'By confirming, you agree to our terms of service and cancellation policy. A care manager will contact you for assessment.')}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={prev} disabled={step === 0}
          style={{ height: 44, padding: '0 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: step === 0 ? '#f8f9fa' : '#fff', color: step === 0 ? '#ccc' : '#0f172a', cursor: step === 0 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          ← {t('back', 'Back')}
        </button>
        {step < 5 ? (
          <button onClick={next}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {t('continue', 'Continue')} →
          </button>
        ) : (
          <button onClick={handleConfirm} disabled={processing}
            style={{ height: 44, padding: '0 28px', borderRadius: 8, border: 'none', background: processing ? '#94a3b8' : `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: '#fff', cursor: processing ? 'wait' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
            {processing ? t('processing', 'Processing...') : `${t('nurse.confirm.booking', 'Confirm Booking')} ₹${totalAmount}`}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
      <span style={{ color: '#64748b' }}>{label}</span>
      <span style={{ fontWeight: 600, color: '#0f172a', textAlign: 'right', marginLeft: 12 }}>{value || '-'}</span>
    </div>
  );
}
