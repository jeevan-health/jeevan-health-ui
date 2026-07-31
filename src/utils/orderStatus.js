/**
 * Client-facing order status labels (Website IA vocabulary).
 * Internal enums stay unchanged — presentation only.
 */

const ORDER_STATUS_LABEL = {
  pending: 'Booked',
  confirmed: 'Booked',
  assigned: 'Assigned',
  sample_collected: 'Sample Collected',
  processing: 'Processing',
  report_ready: 'Report Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

/** Phlebo field status → client label when more specific than order status */
const PHLEBO_STATUS_LABEL = {
  assigned: 'Assigned',
  accepted: 'Assigned',
  en_route: 'On The Way',
  on_the_way: 'On The Way',
  reached: 'On The Way',
  sample_collected: 'Sample Collected',
  sample_rejected: 'Sample issue',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

/**
 * @param {string|null|undefined} status order.status
 * @param {string|null|undefined} [phleboStatus] order.phleboStatus
 */
export function formatOrderStatus(status, phleboStatus) {
  const s = String(status || '').toLowerCase();
  const p = String(phleboStatus || '').toLowerCase();

  if (s === 'assigned' || s === 'confirmed' || s === 'pending') {
    if (p && PHLEBO_STATUS_LABEL[p] && p !== 'assigned' && p !== 'accepted') {
      return PHLEBO_STATUS_LABEL[p];
    }
  }

  return ORDER_STATUS_LABEL[s] || status || '—';
}

export function orderStatusClass(status) {
  return String(status || 'unknown').toLowerCase().replace(/\s+/g, '_');
}
