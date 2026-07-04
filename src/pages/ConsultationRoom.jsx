import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, PaperPlaneTilt, Phone, VideoCamera, ChatCircle, CheckCircle, Clock } from '@phosphor-icons/react';
import { getConsultation, sendMessage, startConsultation, endConsultation, getPrescription } from '../services/doctorService';
import useAuthStore from '../store/authStore';

export default function ConsultationRoom() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [consultation, setConsultation] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [ended, setEnded] = useState(false);
  const chatEnd = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        let cons = await getConsultation(appointmentId).then(r => r.data);
        if (!cons || !cons.id) {
          cons = await startConsultation(appointmentId).then(r => r.data);
        }
        setConsultation(cons);
        setMessages(cons.messages || []);
        const pres = await getPrescription(appointmentId).then(r => r.data);
        if (pres && pres.id) setPrescription(pres);
      } catch {} finally { setLoading(false); }
    })();
  }, [appointmentId]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    const msg = newMsg.trim();
    setNewMsg('');
    setMessages(prev => [...prev, { content: msg, sender: 'user', timestamp: new Date().toISOString() }]);
    try {
      const { data } = await sendMessage(appointmentId, msg, 'user');
      setMessages(data.messages || []);
    } catch {}
  };

  const handleEnd = async () => {
    if (!confirm('End this consultation?')) return;
    await endConsultation(appointmentId);
    setEnded(true);
  };

  const formatTime = (ts) => {
    try { return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; }
  };

  if (loading) return <div className="page-section"><div className="card p-10 text-center">Loading consultation...</div></div>;
  if (ended) return (
    <div className="page-section">
      <div className="card p-10 text-center" style={{ maxWidth: 480, margin: '40px auto' }}>
        <CheckCircle size={48} weight="fill" color="#2e7d32" style={{ marginBottom: 12 }} />
        <h2>Consultation Ended</h2>
        <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Your consultation has been completed.</p>
        {prescription && (
          <div className="card" style={{ marginTop: 16, textAlign: 'left', padding: 16 }}>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Prescription</h3>
            {prescription.medicines?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Medicines:</p>
                {prescription.medicines.map((m, i) => (
                  <p key={i} style={{ fontSize: 13, padding: '2px 0' }}>• {m.name} — {m.dosage} {m.duration && `(${m.duration})`}</p>
                ))}
              </div>
            )}
            {prescription.lab_tests?.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Lab Tests:</p>
                {prescription.lab_tests.map((t, i) => <p key={i} style={{ fontSize: 13, padding: '2px 0' }}>• {t}</p>)}
              </div>
            )}
            {prescription.notes && <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 8 }}>Notes: {prescription.notes}</p>}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button onClick={() => navigate('/my-appointments')} className="btn-primary">My Appointments</button>
          <button onClick={() => navigate('/dashboard')} className="btn-outline">Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - var(--utility-height) - var(--header-height))', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/my-appointments')} style={{ color: 'var(--text-secondary)' }}><CaretLeft size={20} /></button>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: 14 }}>Consultation</p>
          <p style={{ fontSize: 12, color: 'var(--text-light)' }}>Appointment #{appointmentId}</p>
        </div>
        <button onClick={handleEnd} style={{
          padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          background: '#fbe9e7', color: '#c62828', border: 'none',
        }}>End</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: '#fff' }}>
        {[
          { key: 'chat', icon: ChatCircle, label: 'Chat' },
          { key: 'video', icon: VideoCamera, label: 'Video' },
          { key: 'audio', icon: Phone, label: 'Audio' },
          { key: 'prescription', icon: CheckCircle, label: 'Prescription' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '10px', textAlign: 'center', fontSize: 12, fontWeight: 600,
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-light)',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'none',
            }}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.length === 0 && (
              <div className="card p-6 text-center" style={{ margin: 'auto' }}>
                <ChatCircle size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                <p style={{ color: 'var(--text-light)', fontSize: 13 }}>Start your consultation by sending a message.</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: 12,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'var(--primary)' : '#fff',
                color: msg.sender === 'user' ? '#fff' : 'var(--text-dark)',
                boxShadow: msg.sender === 'user' ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <p style={{ fontSize: 13, lineHeight: 1.4 }}>{msg.content}</p>
                <p style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>{formatTime(msg.timestamp)}</p>
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: '#fff', display: 'flex', gap: 8 }}>
            <input type="text" value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..." className="input" style={{ flex: 1, padding: '10px 14px' }} />
            <button onClick={handleSend} disabled={!newMsg.trim()}
              className="btn-primary" style={{ padding: '10px 16px', borderRadius: 10 }}>
              <PaperPlaneTilt size={18} weight="bold" />
            </button>
          </div>
        </div>
      )}

      {/* Video / Audio Placeholder */}
      {(activeTab === 'video' || activeTab === 'audio') && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', flexDirection: 'column', gap: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {activeTab === 'video' ? <VideoCamera size={36} color="#fff" /> : <Phone size={36} color="#fff" />}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{activeTab === 'video' ? 'Video call' : 'Audio call'} interface coming soon</p>
          <button style={{
            padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: '#25d366', color: '#fff', border: 'none',
          }}>
            {activeTab === 'video' ? 'Start Video Call' : 'Start Audio Call'}
          </button>
        </div>
      )}

      {/* Prescription Tab */}
      {activeTab === 'prescription' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f5f7fa' }}>
          {!prescription ? (
            <div className="card p-8 text-center">
              <CheckCircle size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
              <p style={{ color: 'var(--text-light)' }}>Prescription not yet issued.</p>
            </div>
          ) : (
            <div className="card p-5">
              <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--primary)' }}>Prescription</h3>
              {prescription.medicines?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Medicines</p>
                  {prescription.medicines.map((m, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      {m.dosage && <span style={{ color: 'var(--text-light)' }}> — {m.dosage}</span>}
                      {m.duration && <span style={{ color: 'var(--text-light)' }}> for {m.duration}</span>}
                      {m.instructions && <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>{m.instructions}</p>}
                    </div>
                  ))}
                </div>
              )}
              {prescription.lab_tests?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Lab Tests</p>
                  {prescription.lab_tests.map((t, i) => (
                    <p key={i} style={{ fontSize: 13, padding: '2px 0' }}>• {t}</p>
                  ))}
                </div>
              )}
              {prescription.notes && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Notes</p>
                  <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{prescription.notes}</p>
                </div>
              )}
              {prescription.follow_up_date && (
                <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 12 }}>
                  <Clock size={14} /> Follow-up: {new Date(prescription.follow_up_date).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
