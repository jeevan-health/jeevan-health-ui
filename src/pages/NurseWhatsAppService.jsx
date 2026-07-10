import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { STORAGE_KEYS } from '../data/nursingData';

const C = { primary: '#7C3AED', accent: '#EC4899', bg: '#F5F3FF' };

const WHATSAPP_NUMBER = '919700104108';

const WA_MESSAGES = {
  welcome: 'Welcome to Jeevan Healthcare Nurse at Home! 🏥\n\nHow can we help you today?\n\n1️⃣ Book Nurse\n2️⃣ Emergency Requirement\n3️⃣ Existing Patient\n4️⃣ Talk to Care Manager\n\nReply with the number or visit: https://jeevanhealthcare.com/nurse-at-home',
  bookingReceived: '✅ *Booking Received!*\n\nThank you for choosing Jeevan Nurse at Home.\n\nYour Booking ID: {id}\nService: {service}\nDate: {date}\nTime: {time}\n\nOur care manager will call you within 30 minutes for assessment.',
  nurseAssigned: '👩‍⚕️ *Nurse Assigned!*\n\nYour nurse {nurse} has been assigned for your visit on {date} at {time}.\n\nNurse Details:\nName: {nurse}\nQualification: {qualification}\n\nTrack your visit: https://jeevanhealthcare.com/nurse-at-home/my-visits',
  nurseReaching: '🚗 *Nurse is on the way!*\n\nYour nurse {nurse} is starting their journey to your location.\n\nEstimated arrival: {eta}\n\nTrack live: {mapsLink}',
  careStarted: '🩺 *Care Started!*\n\nYour nurse {nurse} has arrived and started the care session.\n\nWe will share a daily care report at the end of the session.',
  dailyReport: '📋 *Daily Care Report*\n\nPatient: {patient}\nDate: {date}\n\nVitals:\n• BP: {bp}\n• Pulse: {pulse}\n• Temp: {temp}\n• SpO2: {spo2}\n\nCare Summary:\n{summary}\n\nThank you for trusting Jeevan Nurse at Home ❤️',
  paymentReminder: '💳 *Payment Reminder*\n\nDear {patient},\nYour nursing service payment of ₹{amount} is due.\n\nPay online: https://jeevanhealthcare.com/pay/{id}\n\nUPI: jeevanhealth@upi',
  renewalReminder: '🔄 *Service Renewal*\n\nYour nursing care plan is ending soon.\n\nCare Plan: {plan}\nEnd Date: {endDate}\n\nRenew now: https://jeevanhealthcare.com/nurse-at-home/book\n\nOr reply to this message to talk to our team.',
};

const TEMPLATES = [
  { id: 'welcome', label: 'Welcome Message', icon: '👋', msg: WA_MESSAGES.welcome },
  { id: 'bookingReceived', label: 'Booking Received', icon: '✅', msg: WA_MESSAGES.bookingReceived },
  { id: 'nurseAssigned', label: 'Nurse Assigned', icon: '👩‍⚕️', msg: WA_MESSAGES.nurseAssigned },
  { id: 'nurseReaching', label: 'Nurse Reaching Location', icon: '🚗', msg: WA_MESSAGES.nurseReaching },
  { id: 'careStarted', label: 'Care Started', icon: '🩺', msg: WA_MESSAGES.careStarted },
  { id: 'dailyReport', label: 'Daily Care Report', icon: '📋', msg: WA_MESSAGES.dailyReport },
  { id: 'paymentReminder', label: 'Payment Reminder', icon: '💳', msg: WA_MESSAGES.paymentReminder },
  { id: 'renewalReminder', label: 'Service Renewal', icon: '🔄', msg: WA_MESSAGES.renewalReminder },
];

const SEGMENTS = [
  { id: 'new-patients', label: 'New Patients', icon: '🆕', desc: 'Send welcome message to new leads', count: 12 },
  { id: 'upcoming-visits', label: 'Upcoming Visits', icon: '📅', desc: 'Reminders for tomorrow\'s visits', count: 8 },
  { id: 'in-progress', label: 'Active Care', icon: '🩺', desc: 'Patients currently receiving care', count: 5 },
  { id: 'completed', label: 'Completed Visits', icon: '✅', desc: 'Follow-up & feedback requests', count: 24 },
  { id: 'overdue', label: 'Payment Overdue', icon: '💰', desc: 'Patients with pending payments', count: 3 },
];

export default function NurseWhatsAppService() {
  const t = useT();
  const [activeSegment, setActiveSegment] = useState('new-patients');
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [customMessage, setCustomMessage] = useState('');
  const [sentMsg, setSentMsg] = useState('');

  const stats = useMemo(() => ({
    totalCampaigns: 15,
    messagesSent: 342,
    responseRate: '68%',
    bookingsFromWA: 47,
  }), []);

  const template = TEMPLATES.find(tpl => tpl.id === selectedTemplate);
  const displayMessage = customMessage || template?.msg || '';

  const sendMessage = () => {
    setSentMsg(t('nurse.wa.sending', 'Message sent successfully!'));
    setTimeout(() => setSentMsg(''), 3000);
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/nurse-at-home" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← {t('nurse.back', 'Back to Nurse at Home')}</Link>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>💬 {t('nurse.wa.title', 'Nurse at Home – WhatsApp Automation')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: 0 }}>{t('nurse.wa.subtitle', 'Automate patient communication from booking to renewal')}</p>
        </div>
      </div>

      <div className="page-section container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
          {[
            { icon: '📊', label: t('nurse.wa.campaigns', 'Campaigns'), value: stats.totalCampaigns },
            { icon: '💬', label: t('nurse.wa.sent', 'Messages Sent'), value: stats.messagesSent },
            { icon: '📈', label: t('nurse.wa.response', 'Response Rate'), value: stats.responseRate },
            { icon: '📅', label: t('nurse.wa.bookings', 'Bookings from WA'), value: stats.bookingsFromWA },
          ].map(s => (
            <div key={s.label} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {SEGMENTS.map(seg => (
            <button key={seg.id} onClick={() => setActiveSegment(seg.id)}
              style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: activeSegment === seg.id ? C.primary : '#f1f5f9', color: activeSegment === seg.id ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
              {seg.icon} {seg.label} <span style={{ fontSize: 10, opacity: 0.7 }}>({seg.count})</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nurse.wa.templates', 'Message Templates')}</h4>
            <div style={{ display: 'grid', gap: 4 }}>
              {TEMPLATES.map(tpl => (
                <button key={tpl.id} onClick={() => { setSelectedTemplate(tpl.id); setCustomMessage(''); }}
                  style={{ padding: '8px 12px', borderRadius: 6, border: selectedTemplate === tpl.id ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: selectedTemplate === tpl.id ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', fontSize: 11, fontWeight: selectedTemplate === tpl.id ? 700 : 400, color: selectedTemplate === tpl.id ? C.primary : '#475569' }}>
                  {tpl.icon} {tpl.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nurse.wa.preview', 'Message Preview')}</h4>
            <div style={{ padding: 14, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 12, lineHeight: 1.6, color: '#166534', minHeight: 160, whiteSpace: 'pre-wrap' }}>{displayMessage}</div>
            <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)} placeholder={t('nurse.wa.custom', 'Or type a custom message...')} rows={3}
              style={{ width: '100%', marginTop: 8, padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={sendMessage}
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#25d366', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
            💬 {t('nurse.wa.send', 'Send to Segment')}
          </button>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(displayMessage)}`} target="_blank" rel="noopener noreferrer"
            style={{ height: 44, padding: '0 24px', borderRadius: 8, border: '1px solid #25d366', background: '#fff', color: '#25d366', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            📱 {t('nurse.wa.previewWA', 'Preview on WhatsApp')}
          </a>
        </div>

        {sentMsg && <div style={{ padding: '10px 14px', borderRadius: 8, background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 600, marginBottom: 16 }}>{sentMsg}</div>}

        <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nurse.wa.journey', 'Patient WhatsApp Journey')}</h4>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { step: '1', icon: '👋', label: 'Welcome', color: '#3B82F6' },
              { step: '2', icon: '✅', label: 'Booking Received', color: '#10B981' },
              { step: '3', icon: '👩‍⚕️', label: 'Nurse Assigned', color: '#8B5CF6' },
              { step: '4', icon: '🚗', label: 'Nurse Reaching', color: '#F59E0B' },
              { step: '5', icon: '🩺', label: 'Care Started', color: '#EC4899' },
              { step: '6', icon: '📋', label: 'Daily Report', color: '#0D9488' },
              { step: '7', icon: '💳', label: 'Payment', color: '#E11D48' },
              { step: '8', icon: '🔄', label: 'Renewal', color: '#F97316' },
            ].map(item => (
              <div key={item.step} style={{ flex: '1 1 80px', padding: 10, borderRadius: 8, background: `${item.color}10`, border: `1px solid ${item.color}30`, textAlign: 'center' }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>{item.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
