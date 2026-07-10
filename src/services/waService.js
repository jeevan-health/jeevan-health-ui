const WA_NUMBER = '919700104108';
const NOTIF_KEY = 'jh_vaccination_notifications';

const templates = {
  bookingConfirmation: (data) => {
    return `Hi ${data.patientName || 'there'}! ✅ Your vaccination booking is confirmed at Jeevan HealthCare.

Booking ID: ${data.id}
Vaccine: ${data.vaccineName || data.vaccine}
Date: ${data.appointmentDate || data.date || 'Scheduled'}
Time: ${data.appointmentSlot || 'To be confirmed'}
Service: ${data.serviceType === 'home' ? 'Home Vaccination 🏠' : 'Clinic Visit 🏥'}
Amount: ₹${data.vaccinePrice || 0}

👉 A healthcare professional will contact you shortly.
For queries, reply to this message or call us.

- Jeevan HealthCare at Home`;
  },

  appointmentReminder: (data) => {
    return `⏰ Reminder: Your vaccination appointment is TOMORROW!

Booking ID: ${data.id}
Vaccine: ${data.vaccineName || data.vaccine}
Date: ${data.appointmentDate || data.date}
Time: ${data.appointmentSlot}
Patient: ${data.patientName || data.name}

📌 Please ensure the patient is comfortable and hydrated.
🩺 Our healthcare professional will arrive on time.

- Jeevan HealthCare at Home`;
  },

  postVaccination: (data) => {
    return `🩺 How is ${data.patientName || 'the patient'} feeling after the vaccination?

Common side effects are mild and resolve in 1-2 days:
• Mild fever or chills
• Soreness at injection site
• Fatigue or tiredness

⚠️ Contact us immediately if:
• High fever > 101°F
• Severe allergic reaction
• Any unusual symptoms

Reply or call us for medical guidance.

- Jeevan HealthCare at Home
📞 +91-9700104108`;
  },

  nextDoseReminder: (data) => {
    return `🔔 Your next vaccine dose is due!

Patient: ${data.patientName || data.name}
Vaccine: ${data.vaccineName || data.vaccine}
Due Date: ${data.nextDueDate || 'Coming soon'}
Current Dose: ${data.currentDose || 1} of ${data.totalDoses || 2}

📅 Book your next appointment now:
https://jeevanhealthcare.com/vaccination/book?vaccine=${data.vaccineSlug || ''}

- Jeevan HealthCare at Home`;
  },
};

export function getWALink(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function openWA(message) {
  window.open(getWALink(message), '_blank');
}

export function sendBookingConfirmation(booking) {
  const msg = templates.bookingConfirmation(booking);
  addNotification(booking.id, 'booking_confirmation', 'Booking Confirmation', msg);
  return msg;
}

export function sendAppointmentReminder(booking) {
  const msg = templates.appointmentReminder(booking);
  addNotification(booking.id, 'appointment_reminder', 'Appointment Reminder', msg);
  return msg;
}

export function sendPostVaccinationFollowup(booking) {
  const msg = templates.postVaccination(booking);
  addNotification(booking.id, 'post_vaccination', 'Post-Vaccination Follow-up', msg);
  return msg;
}

export function sendNextDoseReminder(booking, nextDueDate, totalDoses) {
  const msg = templates.nextDoseReminder({ ...booking, nextDueDate, totalDoses });
  addNotification(booking.id, 'next_dose_reminder', 'Next Dose Reminder', msg);
  return msg;
}

export function getTemplates() {
  return templates;
}

function addNotification(bookingId, type, label, message) {
  try {
    const list = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
    list.push({
      id: 'notif-' + Date.now().toString(36),
      bookingId,
      type,
      label,
      message,
      createdAt: new Date().toISOString(),
      sent: false,
    });
    localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
  } catch {}
}

export function getPendingNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); } catch { return []; }
}

export function markNotificationSent(id) {
  try {
    const list = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
    const updated = list.map(n => n.id === id ? { ...n, sent: true } : n);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearNotifications() {
  localStorage.removeItem(NOTIF_KEY);
}

export default templates;
