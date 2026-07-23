/**
 * Display order IDs: JHC-{CITY}-{SERVICE}-{#####}
 * Mirrors API orderCode helper for client-side display of legacy rows.
 */

const COMPANY_CODE = 'JHC';

const CITY_CODES = {
  hyderabad: 'HYD',
  secunderabad: 'SEC',
  bengaluru: 'BLR',
  bangalore: 'BLR',
  chennai: 'CHE',
  mumbai: 'MUM',
  delhi: 'DEL',
  'new delhi': 'DEL',
  pune: 'PUN',
  vijayawada: 'VJA',
  warangal: 'WAR',
};

const SERVICE_CODES = {
  diagnostic: 'DIA',
  diagnostics: 'DIA',
  pharmacy: 'MED',
  medicine: 'MED',
  physio: 'PHY',
  physiotherapy: 'PHY',
  nursing: 'NUR',
  vaccination: 'VAC',
  appointment: 'CON',
  consultation: 'CON',
};

function cityCodeFromValue(city) {
  const n = String(city || '').toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!n) return 'HYD';
  if (CITY_CODES[n]) return CITY_CODES[n];
  for (const [key, code] of Object.entries(CITY_CODES)) {
    if (n.includes(key) || key.includes(n)) return code;
  }
  return 'HYD';
}

function cityCodeFromAddress(addr) {
  if (!addr) return 'HYD';
  let a = addr;
  if (typeof a === 'string') {
    try { a = JSON.parse(a); } catch { return 'HYD'; }
  }
  return cityCodeFromValue(a.city || a.City || '');
}

function serviceCodeFromType(type) {
  return SERVICE_CODES[String(type || 'diagnostic').toLowerCase()] || 'DIA';
}

export function formatDisplayOrderId({ id, cityCode = 'HYD', serviceCode = 'DIA', companyCode = COMPANY_CODE } = {}) {
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `${companyCode}-${String(cityCode || 'HYD').toUpperCase()}-${String(serviceCode || 'DIA').toUpperCase()}-${String(Math.trunc(n)).padStart(5, '0')}`;
}

export function resolveDisplayOrderId(order = {}, fallbackType = 'diagnostic') {
  if (order.displayOrderId || order.display_order_id) {
    return order.displayOrderId || order.display_order_id;
  }
  const cityCode = order.cityCode || order.city_code
    || cityCodeFromAddress(order.collection_address || order.collectionAddress || order.address || order.addressDetail);
  const serviceCode = order.serviceCode || order.service_code
    || serviceCodeFromType(order.orderType || order.order_type || fallbackType);
  const id = order.orderId || order.id;
  // Strip ORD- prefix if present
  const numId = String(id || '').replace(/^ORD-/i, '');
  return formatDisplayOrderId({ id: numId, cityCode, serviceCode });
}

export { cityCodeFromAddress, serviceCodeFromType, COMPANY_CODE };
