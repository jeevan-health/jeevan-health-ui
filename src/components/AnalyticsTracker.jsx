import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { pageView, trackBooking, trackLead } from '../lib/analytics';

const BOOKING_KEYS = ['jh_nursing_bookings', 'jh_vaccination_bookings', 'jh_physio_bookings'];
const EQUIPMENT_CART_KEY = 'jh_equipment_cart';

function getKnownBookingCounts() {
  const counts = {};
  for (const key of BOOKING_KEYS) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      counts[key] = data.length;
    } catch { counts[key] = 0; }
  }
  return counts;
}

function getEquipmentCartCount() {
  try {
    const data = JSON.parse(localStorage.getItem(EQUIPMENT_CART_KEY) || '[]');
    return data.length;
  } catch { return 0; }
}

export default function AnalyticsTracker() {
  const loc = useLocation();
  const prevCounts = useRef(getKnownBookingCounts());
  const prevEquipCount = useRef(getEquipmentCartCount());

  useEffect(() => {
    pageView(loc.pathname);
  }, [loc.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getKnownBookingCounts();
      for (const key of BOOKING_KEYS) {
        if (current[key] > prevCounts.current[key]) {
          const serviceName = key.replace('jh_', '').replace('_bookings', '');
          trackBooking(serviceName, { count: current[key] - prevCounts.current[key] });
        }
      }
      prevCounts.current = current;

      const equipCount = getEquipmentCartCount();
      if (equipCount > prevEquipCount.current) {
        trackBooking('equipment', { count: equipCount - prevEquipCount.current });
      }
      prevEquipCount.current = equipCount;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
