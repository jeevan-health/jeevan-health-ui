const LEAD_SOURCES = [
  { key: 'jh_website_leads', label: 'Website', icon: '🌐' },
  { key: 'jh_vaccination_leads', label: 'Vaccination', icon: '💉' },
  { key: 'jh_nurse_leads', label: 'Nursing', icon: '👩‍⚕️' },
  { key: 'jh_physio_leads', label: 'Physiotherapy', icon: '💪' },
];

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export function getAllLeads() {
  const all = [];
  LEAD_SOURCES.forEach(({ key, label, icon }) => {
    const items = load(key);
    items.forEach(item => {
      all.push({
        id: item.id || `${key}_${item.timestamp || Date.now()}`,
        name: item.name || item.patientName || 'Unknown',
        phone: item.phone || item.patientPhone || '',
        email: item.email || item.patientEmail || '',
        service: item.service || item.source || label,
        source: item.source || label,
        sourceKey: key,
        sourceLabel: label,
        sourceIcon: icon,
        query: item.query || item.service || item.notes || '',
        stage: item.stage || 'new',
        notes: item.notes || item.query || '',
        createdAt: item.timestamp || item.createdAt || item.date || new Date().toISOString(),
        city: item.city || '',
        raw: item,
      });
    });
  });
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getLeadSources() {
  return LEAD_SOURCES;
}

export function getLeadCounts() {
  const counts = {};
  LEAD_SOURCES.forEach(({ key, label }) => {
    counts[label] = (load(key) || []).length;
  });
  counts.Total = Object.values(counts).reduce((s, v) => s + v, 0);
  return counts;
}

export function dedupByPhone(leads, crmCustomers) {
  const crmPhones = new Set(crmCustomers.map(c => c.phone?.replace(/\D/g, '')));
  return leads.filter(l => !crmPhones.has(l.phone?.replace(/\D/g, '')));
}

export function convertToCrmCustomer(lead) {
  return {
    name: lead.name,
    phone: lead.phone,
    email: lead.email || '',
    source: lead.source === 'popup' ? 'website' : lead.source === 'chatbot' ? 'whatsapp' : (lead.source || 'website'),
    tags: [lead.sourceLabel || lead.source || 'lead', lead.service || ''].filter(Boolean),
    city: lead.city || '',
    notes: `[${lead.sourceLabel}] ${lead.query || lead.notes || ''}`.trim(),
    createdAt: lead.createdAt,
  };
}
