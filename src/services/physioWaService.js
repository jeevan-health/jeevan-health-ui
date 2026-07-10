const WA_NUMBER = '919700104108';

export function physioWA_bookingConfirmation(booking) {
  const text = `Hi *${booking.name}*! 🙌

Your Physiotherapy Session is Confirmed ✅

━━━━━━━━━━━━━━━━━━
📋 *Booking ID:* ${booking.id}
👤 *Patient:* ${booking.name}
🦴 *Condition:* ${booking.condition}
🏠 *Mode:* ${booking.mode}
👨‍⚕️ *Therapist:* ${booking.therapistName || 'Assigned at visit'}
📅 *Date:* ${booking.date || 'To be scheduled'}
⏰ *Time:* ${booking.time || 'To be scheduled'}
📍 *Location:* ${booking.location}
💰 *Amount:* ₹${booking.amount || '—'}
━━━━━━━━━━━━━━━━━━

*What happens next?*
1️⃣ Our therapist will arrive at your scheduled time
2️⃣ Initial assessment & treatment plan discussion
3️⃣ Therapy session as per your package

Need help? Reply or call us at +91 97001 04108

*Jeevan HealthCare at Home* 🏥`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function physioWA_reminder(booking) {
  const text = `⏰ *Reminder!*

Your physiotherapy session is *tomorrow*!

━━━━━━━━━━━━━━━━━━
👤 *Patient:* ${booking.name}
👨‍⚕️ *Therapist:* ${booking.therapistName || 'Assigned'}
📅 *Date:* ${booking.date}
⏰ *Time:* ${booking.time}
━━━━━━━━━━━━━━━━━━

Reply *YES* to confirm or call +91 97001 04108 to reschedule.

*Jeevan HealthCare at Home* 🏥`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function physioWA_freeConsultation() {
  const text = `Hi! 👋

I want a *Free Physiotherapy Consultation*.

Please call me back at the earliest.

Thanks,
*Jeevan HealthCare User* 🏥`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function sendPhysioNotification(type, booking) {
  const notifications = JSON.parse(localStorage.getItem('jh_physio_notifications') || '[]');
  const notification = {
    id: `notif_${Date.now()}`,
    type,
    bookingId: booking.id,
    patientName: booking.name,
    createdAt: new Date().toISOString(),
    sent: false,
  };
  notifications.push(notification);
  localStorage.setItem('jh_physio_notifications', JSON.stringify(notifications));
}
