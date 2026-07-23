/**
 * Extract the person the test was booked for (patient) vs account holder.
 * Patient is stored on collection_address.patient at checkout, or in notes as
 * "Patient: Name, Age: 65".
 */

function parseAddr(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return typeof raw === 'object' ? raw : {};
}

export function extractPatientFromOrder(order = {}) {
  const addr = parseAddr(order.collection_address || order.collectionAddress || order.delivery_address);
  const p = addr.patient || addr.selectedPatient || null;

  if (p && (p.name || typeof p === 'string')) {
    if (typeof p === 'string') {
      return { name: p, age: null, gender: null, relation: null, id: null };
    }
    return {
      name: p.name || null,
      age: p.age != null && p.age !== '' ? p.age : null,
      gender: p.gender || null,
      relation: p.relation || null,
      id: p.id || null,
    };
  }

  const notes = String(order.notes || '');
  const nameM = notes.match(/Patient:\s*([^|,]+)/i);
  const ageM = notes.match(/Age:\s*(\d+)/i);
  const genderM = notes.match(/Gender:\s*([^|,]+)/i);
  if (nameM) {
    return {
      name: nameM[1].trim(),
      age: ageM ? ageM[1] : null,
      gender: genderM ? genderM[1].trim() : null,
      relation: null,
      id: null,
    };
  }

  return { name: null, age: null, gender: null, relation: null, id: null };
}

/** Human label e.g. "Pochaiah · 65 yrs" */
export function formatPatientLabel(patient, fallback = '—') {
  if (!patient?.name) return fallback;
  const bits = [patient.name];
  if (patient.age != null && patient.age !== '') bits.push(`${patient.age} yrs`);
  if (patient.gender) bits.push(String(patient.gender));
  if (patient.relation && String(patient.relation).toLowerCase() !== 'self') {
    bits.push(patient.relation);
  }
  return bits.join(' · ');
}

/** Parse lab report notes for patient/order metadata */
export function parseReportNotes(notes) {
  if (!notes) return {};
  const s = String(notes);
  const orderM = s.match(/order\s*#?\s*(\d+)/i)
    || s.match(/ORD-(\d+)/i)
    || s.match(/JHC-[A-Z]+-[A-Z]+-0*(\d+)/i);
  const nameM = s.match(/Patient:\s*([^|,]+)/i);
  const ageM = s.match(/Age:\s*(\d+)/i);
  const genderM = s.match(/Gender:\s*([^|,]+)/i);
  return {
    orderId: orderM ? orderM[1] : null,
    patientName: nameM ? nameM[1].trim() : null,
    patientAge: ageM ? ageM[1] : null,
    patientGender: genderM ? genderM[1].trim() : null,
  };
}
