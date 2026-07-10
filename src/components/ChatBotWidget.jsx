import { useState, useRef, useEffect } from 'react';
import { useT } from '../i18n/LanguageProvider';
import { trackLead } from '../lib/analytics';
import useCrmStore from '../stores/crmStore';

const WA_NUMBER = '919700104108';
const LEADS_KEY = 'jh_website_leads';
const CHAT_STATE_KEY = 'jh_chatbot_state';

function loadState() {
  try { return JSON.parse(sessionStorage.getItem(CHAT_STATE_KEY) || 'null'); } catch { return null; }
}
function saveState(s) {
  try { sessionStorage.setItem(CHAT_STATE_KEY, JSON.stringify(s)); } catch {}
}
function saveLead(data) {
  try {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    leads.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch {}
}

const SERVICES = [
  { id: 'lab', label: '🔬 Book Lab Test', msg: 'I want to book a lab test at home' },
  { id: 'nursing', label: '👩‍⚕️ Nursing at Home', msg: 'I need nursing care at home' },
  { id: 'physio', label: '💪 Physiotherapy', msg: 'I need physiotherapy at home' },
  { id: 'vaccination', label: '💉 Vaccination at Home', msg: 'I want to book vaccination at home' },
  { id: 'equipment', label: '🛏️ Medical Equipment', msg: 'I want to rent/buy medical equipment' },
  { id: 'other', label: '❓ Other Query', msg: 'I have a general query' },
];

const FLOWS = {
  lab: [
    { bot: 'Great choice! What type of test are you looking for?' },
    { options: ['🩸 Blood Test', '🩸 Diabetes (HbA1c/Glucose)', '🦋 Thyroid', '❤️ Heart / Lipid', '🧬 Full Body Checkup', '🦠 Fever / Infection', 'Other Test'] },
  ],
  nursing: [
    { bot: 'We offer professional nursing care at home. What type of care do you need?' },
    { options: ['🩹 Wound Care / Dressing', '💉 Injection / IV Infusion', '🛏️ Bedside Care / Patient Attendant', '🩺 Catheter / Stoma Care', '🏥 Post-Surgery Care', '👶 Newborn / Mother Care', 'Other Nursing Service'] },
  ],
  physio: [
    { bot: 'Our expert physiotherapists can visit your home. What are you looking for?' },
    { options: ['🔙 Back Pain Treatment', '🦵 Knee Pain / Joint Pain', '🧠 Stroke Rehabilitation', '🏥 Post-Surgery Rehab', '⚽ Sports Injury Recovery', '👵 Elderly / Geriatric Care', 'Other Physio Service'] },
  ],
  vaccination: [
    { bot: 'We provide vaccination at home. Who needs the vaccine?' },
    { options: ['👶 Baby / Child Vaccination', '🧑 Adult Vaccination', '👨‍👩‍👧‍👦 Family / Group Vaccination', '✈️ Travel Vaccines', '💉 Flu / Seasonal Shots', '🏢 Corporate Vaccination', 'Other Vaccine Query'] },
  ],
  equipment: [
    { bot: 'We deliver medical equipment at home. What do you need?' },
    { options: ['💨 Oxygen Concentrator / Cylinder', '🛏️ Hospital Bed / Mattress', '♿ Wheelchair / Walker', '🫁 CPAP / BiPAP Machine', '📟 Patient Monitor / Pulse Oximeter', '🩼 Crutches / Commode Chair', 'Other Equipment'] },
  ],
  other: [
    { bot: 'Sure! I can help with general queries too. Please share your details and our team will get back to you shortly.' },
  ],
};

function getServiceFromMsg(msg) {
  for (const s of SERVICES) {
    if (s.msg === msg) return s;
  }
  return SERVICES[5];
}

function waLink(phone, name, service, query) {
  const text = `Hi Jeevan Health! My name is ${name}. ${query || `I am interested in ${service || 'your services'}.`} Please call me back.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function FlowStep({ step, onOption }) {
  if (step.options) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        {step.options.map(opt => (
          <button key={opt} onClick={() => onOption(opt)} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid #e8edf2', background: '#fff',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#1a1a1a', textAlign: 'left',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderColor = '#1866C9'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf2'; }}>
            {opt}
          </button>
        ))}
      </div>
    );
  }
  return null;
}

export default function ChatBotWidget() {
  const t = useT();
  const saved = loadState();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(saved?.step || 'welcome');
  const [service, setService] = useState(saved?.service || null);
  const [query, setQuery] = useState(saved?.query || '');
  const [name, setName] = useState(saved?.name || '');
  const [phone, setPhone] = useState(saved?.phone || '');
  const [messages, setMessages] = useState(saved?.messages || [{ bot: true, text: '👋 Hi! Welcome to Jeevan HealthCare at Home! How can I help you today?' }]);
  const [submitted, setSubmitted] = useState(saved?.submitted || false);
  const [minimized, setMinimized] = useState(false);
  const chatEnd = useRef(null);
  const detailsTimeout = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    saveState({ step, service, query, name, phone, messages, submitted });
  }, [step, service, query, name, phone, messages, submitted]);

  function addBot(text) {
    setMessages(prev => [...prev, { bot: true, text }]);
  }

  function handleServiceSelect(serviceMsg) {
    const svc = getServiceFromMsg(serviceMsg);
    setService(svc);
    setQuery(serviceMsg);
    setStep('details');
    addBot(`You selected: ${serviceMsg}`);
    detailsTimeout.current = setTimeout(() => {
      addBot('Please share your name and phone number so our team can assist you.');
      setStep('ask_name');
    }, 600);
  }

  function handleNameSubmit(e) {
    e?.preventDefault();
    if (!name.trim()) return;
    setStep('ask_phone');
    addBot(`Thanks, ${name.trim()}!`);
    detailsTimeout.current = setTimeout(() => {
      addBot('What is your phone number?');
    }, 400);
  }

  function handlePhoneSubmit(e) {
    e?.preventDefault();
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) return;
    const leadData = { name: name.trim(), phone: clean, service: service?.id || 'other', query: query || 'General query', source: 'chatbot' };
    saveLead(leadData);
    try { useCrmStore.getState().addCustomer({ name: name.trim(), phone: clean, email: '', source: 'whatsapp', tags: ['chatbot', service?.id || 'other'], city: '', notes: `Chatbot query: ${query || 'General enquiry'}` }); } catch {}
    trackLead('chatbot');
    setSubmitted(true);
    setStep('done');
    addBot(`✅ Thank you, ${name.trim()}! Our team will contact you shortly at ${clean}.`);
    setTimeout(() => {
      addBot('💬 You can also chat with us directly on WhatsApp:');
    }, 800);
  }

  function handleOption(opt) {
    if (step === 'welcome') {
      if (opt === '💬 Chat with Us') {
        addBot('Please select a service:');
        setStep('service');
      } else if (opt === '📞 Call Me Back' || opt === '📱 WhatsApp Me') {
        setStep('details');
        if (opt === '📱 WhatsApp Me') setQuery('I need help via WhatsApp');
        else setQuery('I need a call back');
        detailsTimeout.current = setTimeout(() => {
          addBot('Please share your name and phone number.');
          setStep('ask_name');
        }, 600);
      }
    }
  }

  const welcomeOptions = ['💬 Chat with Us', '📞 Call Me Back', '📱 WhatsApp Me'];

  return (
    <>
      {open && !minimized && (
        <div style={{
          position: 'fixed', bottom: 80, right: 20, width: 340, maxHeight: 480, background: '#fff',
          borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'chatFadeIn 0.25s ease',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
          }} onClick={() => setMinimized(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>💬</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Jeevan HealthCare</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>Online • Avg response &lt; 2 min</div>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setOpen(false); setMinimized(false); }} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%',
              width: 24, height: 24, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: 'inherit',
            }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 8, background: '#f8f9fa', minHeight: 300 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.bot ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
              }}>
                <div style={{
                  background: msg.bot ? '#fff' : '#1866C9', color: msg.bot ? '#1a1a1a' : '#fff',
                  padding: '8px 12px', borderRadius: msg.bot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
                  fontSize: 12, lineHeight: 1.5, boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {step === 'welcome' && messages.length <= 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4, alignSelf: 'flex-start' }}>
                {welcomeOptions.map(opt => (
                  <button key={opt} onClick={() => handleOption(opt)} style={{
                    padding: '8px 14px', borderRadius: 8, border: '1px solid #e8edf2', background: '#fff',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#1a1a1a',
                    fontFamily: 'inherit', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderColor = '#1866C9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf2'; }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {step === 'service' && messages.find(m => m.text === 'Please select a service:') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {SERVICES.map(s => (
                  <button key={s.id} onClick={() => handleServiceSelect(s.msg)} style={{
                    padding: '8px 12px', borderRadius: 8, border: '1px solid #e8edf2', background: '#fff',
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#1a1a1a', textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0f7ff'; e.currentTarget.style.borderColor = '#1866C9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8edf2'; }}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {(step === 'ask_name' || (step === 'details' && messages.find(m => m.text.includes('share your name')))) && !submitted && (
              <form onSubmit={handleNameSubmit} style={{ display: 'flex', gap: 6, marginTop: 4, alignSelf: 'stretch' }}>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required
                  style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', outline: 'none' }}
                />
                <button type="submit" style={{
                  padding: '8px 14px', borderRadius: 8, background: '#1866C9', color: '#fff',
                  border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>OK</button>
              </form>
            )}

            {step === 'ask_phone' && !submitted && (
              <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', gap: 6, marginTop: 4, alignSelf: 'stretch' }}>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Your 10-digit phone number" required pattern="[0-9]{10}"
                  style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'inherit', outline: 'none' }}
                />
                <button type="submit" style={{
                  padding: '8px 14px', borderRadius: 8, background: '#25D366', color: '#fff',
                  border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}>Submit</button>
              </form>
            )}

            {submitted && (
              <div style={{ alignSelf: 'stretch', marginTop: 4 }}>
                <a href={waLink(WA_NUMBER, name, service?.label, query)} target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px', borderRadius: 10, background: '#25D366', color: '#fff',
                  fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'inherit',
                }}>
                  💬 Chat on WhatsApp
                </a>
              </div>
            )}

            <div ref={chatEnd} />
          </div>
        </div>
      )}

      {open && minimized && (
        <div onClick={() => setMinimized(false)} style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 9999, cursor: 'pointer',
          background: '#1866C9', color: '#fff', padding: '8px 14px', borderRadius: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: 12, fontWeight: 600,
          fontFamily: 'inherit', animation: 'chatFadeIn 0.2s ease',
        }}>
          💬 Chat with us
        </div>
      )}

      {!open && (
        <button onClick={() => { setOpen(true); setMinimized(false); }} style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 9999,
          width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', fontSize: 22,
          boxShadow: '0 4px 16px rgba(24, 102, 201, 0.35)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', transition: 'transform 0.2s', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
          💬
        </button>
      )}

      <style>{`
        @keyframes chatFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
