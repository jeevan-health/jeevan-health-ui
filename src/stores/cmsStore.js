import { create } from 'zustand';

const CMS_KEY = 'jh_cms_content';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const defaults = {
  hero: {
    heading: 'Your Health, Our Priority — Trusted Diagnostics at Your Doorstep',
    subheading: 'Book lab tests from home with free sample collection. 5000+ tests, NABL certified labs, reports in 24 hours.',
    backgroundImage: '',
    ctaText: 'Book Lab Tests',
    ctaLink: '/diagnostics',
    ctaSecondaryText: 'Upload Prescription',
    ctaSecondaryLink: '#upload',
    ctaTertiaryText: 'Book Health Package',
    ctaTertiaryLink: '/health-packages',
    rating: '4.9',
    ratingLabel: '50,000+ Happy Patients',
    statBadges: [
      { icon: '🧪', label: '5000+', sublabel: 'Tests' },
      { icon: '🏠', label: 'Free Home', sublabel: 'Collection' },
      { icon: '🏅', label: 'NABL Certified', sublabel: 'Labs' },
      { icon: '⏱️', label: 'Reports in', sublabel: '24 Hours' },
    ],
    featureIcons: [
      { icon: '👨‍👩‍👧‍👦', label: 'Family' },
      { icon: '🩺', label: 'Doctor' },
      { icon: '💉', label: 'Phlebotomist' },
      { icon: '👴', label: 'Senior Citizen' },
    ],
    active: true,
  },
  trustStrip: {
    items: [
      { label: 'NABL Certified', icon: '🏅' },
      { label: 'Free Home Collection', icon: '🏠' },
      { label: 'Same Day Collection', icon: '📅' },
      { label: 'Secure Payment', icon: '🔒' },
      { label: 'Doctor Support', icon: '🩺' },
      { label: 'Digital Reports', icon: '📄' },
      { label: '24x7 Support', icon: '📞' },
    ],
    active: true,
  },
  services: [
    { id: 'doctor-consultation', icon: '🩺', label: 'Doctor Consultation', description: 'Consult top doctors from home', color: '#3B82F6', link: '/services/doctor-consultation', active: true },
    { id: 'diagnostics', icon: '🔬', label: 'Diagnostics', description: '5000+ lab tests at your doorstep', color: '#10B981', link: '/diagnostics', active: true },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy', description: 'Medicines delivered to your home', color: '#F59E0B', link: '/services/pharmacy', active: true },
    { id: 'nursing', icon: '👩‍⚕️', label: 'Nursing', description: 'Skilled nursing care at home', color: '#8B5CF6', link: '/services/nursing', active: true },
    { id: 'physiotherapy', icon: '🏋️', label: 'Physiotherapy', description: 'Recover with expert physiotherapists', color: '#EC4899', link: '/services/physiotherapy', active: true },
  ],
  stats: [
    { value: 100, suffix: 'K+', label: 'Patients Served', description: 'Trusted by families across India' },
    { value: 5000, suffix: '+', label: 'Tests Available', description: 'Comprehensive diagnostic menu' },
    { value: 150, suffix: '+', label: 'Health Packages', description: 'Curated for every need' },
    { value: 98, suffix: '%', label: 'Satisfaction', description: 'Patient happiness guaranteed' },
    { value: 15, suffix: '+', label: 'Years', description: 'Of excellence in diagnostics' },
    { value: 100, suffix: '+', label: 'Corporate Clients', description: 'Trusted by leading companies' },
  ],
  testimonials: [
    { id: 1, name: 'Priya Sharma', text: 'Excellent service! The phlebotomist arrived on time and was very professional. Reports were delivered digitally within 24 hours. Highly recommend Jeevan Healthcare.', rating: 5, tag: 'Verified Patient', image: '' },
    { id: 2, name: 'Rajesh Kumar', text: 'I have been using Jeevan for all my family health checkups. The home collection service is a lifesaver for my elderly parents. Great experience every time.', rating: 5, tag: 'Regular Customer', image: '' },
    { id: 3, name: 'Anita Desai', text: 'The health packages are very affordable and comprehensive. The online reports are easy to understand with reference ranges clearly marked. Thank you Jeevan team!', rating: 5, tag: 'Verified Patient', image: '' },
    { id: 4, name: 'Vikram Patel', text: 'Outstanding diagnostic services. The NABL accreditation gives me confidence in the results. Doctor consultation after reports is a thoughtful addition.', rating: 4, tag: 'Verified Patient', image: '' },
    { id: 5, name: 'Sunita Reddy', text: 'Very happy with the corporate health camp organized by Jeevan at our office. Over 200 employees benefited. Seamless process from registration to report delivery.', rating: 5, tag: 'Corporate Client', image: '' },
  ],
  faqs: [
    { id: 1, question: 'How do I book a lab test?', answer: 'You can book a lab test by visiting our Diagnostics page, selecting the test you need, choosing a convenient time slot, and our phlebotomist will visit your home for sample collection.' },
    { id: 2, question: 'Is home sample collection free?', answer: 'Yes, home sample collection is completely free for all tests and health packages. Our trained phlebotomists follow strict safety and hygiene protocols.' },
    { id: 3, question: 'How will I receive my reports?', answer: 'Reports are delivered digitally via email and WhatsApp. You can also access them anytime from your patient dashboard on our website.' },
    { id: 4, question: 'Are your labs certified?', answer: 'Yes, all our labs are NABL accredited and follow strict quality control protocols. Our team of expert pathologists ensures accurate and timely results.' },
    { id: 5, question: 'Can I consult a doctor after my reports?', answer: 'Yes, we provide free doctor consultation with every health package. Our specialists will review your reports and provide personalized health advice.' },
  ],
  whyChooseJeevan: {
    stats: [
      { icon: '🏥', value: '10+', label: 'Years', sublabel: 'Of Excellence' },
      { icon: '🏠', value: '2 Lakh+', label: 'Home Collections', sublabel: 'Done Safely' },
      { icon: '🏢', value: '500+', label: 'Corporate Clients', sublabel: 'Trust Us' },
      { icon: '🧪', value: '2000+', label: 'Diagnostic Tests', sublabel: 'Available' },
    ],
    features: [
      { icon: '🏅', title: 'NABL Certified Labs', description: 'All tests are processed in accredited laboratories with stringent quality control.', badge: 'Certified' },
      { icon: '👨‍🔬', title: 'Expert Phlebotomists', description: 'Trained and experienced professionals for painless sample collection.', badge: 'Trained' },
      { icon: '🏠', title: 'Convenient Home Collection', description: 'Free sample collection at your preferred time slot, 7 days a week.', badge: 'Free' },
      { icon: '💰', title: 'Affordable Pricing', description: 'Best prices on all tests and health packages with no hidden charges.', badge: 'Best Price' },
      { icon: '📱', title: 'Digital Reports', description: 'Get your reports on WhatsApp, email, and patient dashboard instantly.', badge: 'Instant' },
      { icon: '🩺', title: 'Doctor Consultation', description: 'Free doctor consultation to help you understand your reports.', badge: 'Free' },
      { icon: '👨‍👩‍👧‍👦', title: 'Complete Family Care', description: 'Comprehensive healthcare solutions for every member of your family.', badge: 'Family' },
      { icon: '🧤', title: 'Safe & Hygienic Collection', description: 'Strict safety protocols including PPE kits and sanitized equipment.', badge: 'Safe' },
    ],
    active: true,
  },
};

const useCmsStore = create((set, get) => ({
  content: load(CMS_KEY, JSON.stringify(defaults)),

  refresh: () => set({ content: load(CMS_KEY, JSON.stringify(defaults)) }),

  getContent: () => load(CMS_KEY, JSON.stringify(defaults)),

  // Hero
  updateHero: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), hero: { ...get().content.hero, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // Services
  updateService: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.services = content.services.map(s => s.id === id ? { ...s, ...data } : s);
    save(CMS_KEY, content);
    set({ content });
  },

  addService: (service) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.services = [...content.services, { ...service, id: 'svc-' + Date.now().toString(36) }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteService: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.services = content.services.filter(s => s.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // Trust strip
  updateTrustStrip: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), trustStrip: { ...get().content.trustStrip, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // Stats
  updateStats: (stats) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), stats };
    save(CMS_KEY, content);
    set({ content });
  },

  // Testimonials
  updateTestimonial: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.testimonials = content.testimonials.map(t => t.id === id ? { ...t, ...data } : t);
    save(CMS_KEY, content);
    set({ content });
  },

  addTestimonial: (testimonial) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.testimonials = [...content.testimonials, { ...testimonial, id: Date.now(), createdAt: new Date().toISOString() }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteTestimonial: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.testimonials = content.testimonials.filter(t => t.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // FAQs
  updateFaq: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.faqs = content.faqs.map(f => f.id === id ? { ...f, ...data } : f);
    save(CMS_KEY, content);
    set({ content });
  },

  addFaq: (faq) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    const maxId = Math.max(...content.faqs.map(f => f.id), 0);
    content.faqs = [...content.faqs, { ...faq, id: maxId + 1 }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteFaq: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.faqs = content.faqs.filter(f => f.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // Why Choose Jeevan
  updateWhyChoose: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), whyChooseJeevan: { ...get().content.whyChooseJeevan, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // Section visibility (future use)
  toggleSection: (section, active) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content[section]) content[section] = { ...content[section], active };
    save(CMS_KEY, content);
    set({ content });
  },

  // Reset everything to defaults
  resetContent: () => {
    save(CMS_KEY, defaults);
    set({ content: defaults });
  },
}));

export { defaults };
export default useCmsStore;
