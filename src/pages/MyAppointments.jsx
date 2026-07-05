import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Calendar, Clock, Phone, VideoCamera, ChatCircle, House, XCircle } from '@phosphor-icons/react';
import { getMyAppointments, cancelAppointment } from '../services/doctorService';

const statusStyles = {
  scheduled: { bg: '#e8f0fe', color: '#0B4FA8' },
  confirmed: { bg: '#e8f5e9', color: '#2e7d32' },
  in_progress: { bg: '#fff3e0', color: '#e65100' },
  completed: { bg: '#f5f5f5', color: '#757575' },
  cancelled: { bg: '#fbe9e7', color: '#c62828' },
};

const typeIcons = { video: VideoCamera, audio: Phone, chat: ChatCircle, home: House, clinic: Calendar };

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try { const { data } = await getMyAppointments(); setAppointments(data); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await cancelAppointment(id);
    load();
  };

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Dashboard
        </button>
        <h1>My Appointments</h1>

        {loading ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>
            <Calendar size={40} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-light)' }}>No appointments yet.</p>
            <button onClick={() => navigate('/doctor-consultation')} className="btn-primary" style={{ marginTop: 16 }}>Book a Doctor</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
            {appointments.map(apt => {
              const Icon = typeIcons[apt.type] || Calendar;
              const st = statusStyles[apt.status] || statusStyles.scheduled;
              return (
                <div key={apt.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontSize: 18, fontWeight: 700, color: 'var(--primary)',
                  }}>{apt.doctor_name?.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: 15, margin: 0 }}>{apt.doctor_name}</h3>
                      <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{apt.specialty}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                        background: st.bg, color: st.color,
                      }}>{apt.status.replace('_', ' ')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={14} /> {new Date(apt.appointment_date).toLocaleDateString('en-IN')}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {apt.time_slot}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon size={14} /> {apt.type}
                      </span>
                      <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{apt.fees}</span>
                    </div>
                    {apt.symptoms && <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>Symptoms: {apt.symptoms}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {apt.status === 'completed' && (
                      <button onClick={() => navigate(`/consultation/${apt.id}`)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>View</button>
                    )}
                    {['scheduled', 'confirmed'].includes(apt.status) && (
                      <button onClick={() => handleCancel(apt.id)} style={{
                        padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                        color: '#c62828', background: '#fbe9e7', border: 'none',
                      }}>
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                    {apt.status === 'scheduled' && (
                      <button onClick={() => navigate(`/consultation/${apt.id}`)} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>Join</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
