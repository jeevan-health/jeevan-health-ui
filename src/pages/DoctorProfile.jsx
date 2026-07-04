import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, CaretLeft, CheckCircle, Shield, ChatCircle, VideoCamera, Phone } from '@phosphor-icons/react';
import { getDoctor, getDoctorReviews, getBookedSlots, bookAppointment } from '../services/doctorService';
import useAuthStore from '../store/authStore';

const consultTypes = [
  { value: 'video', label: 'Video Call', icon: VideoCamera },
  { value: 'audio', label: 'Voice Call', icon: Phone },
  { value: 'chat', label: 'Chat', icon: ChatCircle },
  { value: 'home', label: 'Home Visit', icon: Shield },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 8; h < 20; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const allSlots = generateTimeSlots();

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultType, setConsultType] = useState('video');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: doc }, { data: revs }] = await Promise.all([
          getDoctor(id),
          getDoctorReviews(id),
        ]);
        setDoctor(doc);
        setReviews(revs);
      } catch {} finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      getBookedSlots(id, selectedDate).then(({ data }) => setBookedSlots(data)).catch(() => {});
    }
    setSelectedSlot('');
  }, [selectedDate]);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/signup'); return; }
    setBooking(true);
    try {
      await bookAppointment({
        doctorId: parseInt(id),
        patientName: patientName || user?.name,
        patientAge: patientAge ? parseInt(patientAge) : null,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        type: consultType,
        symptoms,
      });
      setBooked(true);
    } catch {} finally { setBooking(false); }
  };

  if (loading) return <div className="page-section"><div className="card p-10 text-center">Loading...</div></div>;
  if (!doctor) return <div className="page-section"><div className="card p-10 text-center">Doctor not found</div></div>;

  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/doctor-consultation')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Doctors
        </button>

        {booked ? (
          <div className="card p-10 text-center">
            <div style={{ fontSize: 48, color: '#2e7d32', marginBottom: 12 }}><CheckCircle size={48} weight="fill" /></div>
            <h2>Appointment Booked!</h2>
            <p style={{ color: 'var(--text-light)', marginTop: 8 }}>{selectedDate} at {selectedSlot} with {doctor.name}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <button onClick={() => navigate('/my-appointments')} className="btn-primary">View Appointments</button>
              <button onClick={() => navigate('/dashboard')} className="btn-outline">Go to Dashboard</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }} className="profile-layout">
            {/* Doctor Info */}
            <div>
              <div className="card p-6">
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: '50%', background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    fontSize: 32, fontWeight: 700, color: 'var(--primary)',
                  }}>{doctor.name?.charAt(0)}</div>
                  <div>
                    <h2 style={{ fontSize: 20, margin: 0 }}>{doctor.name}</h2>
                    <p style={{ color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{doctor.specialty}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{doctor.qualifications?.join(', ')}</p>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={16} weight="fill" color="#ff6b35" /> {doctor.rating}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-light)' }}>{doctor.review_count} reviews</span>
                      <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={16} /> {doctor.experience} yrs
                      </span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)', marginTop: 8 }}>₹{doctor.fees}</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-body)', marginTop: 16, lineHeight: 1.6 }}>{doctor.about}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {doctor.languages?.map(l => (
                    <span key={l} style={{ padding: '4px 10px', background: 'var(--primary-light)', borderRadius: 12, fontSize: 12, color: 'var(--primary)' }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="card p-6" style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 16, marginBottom: 12 }}>Patient Reviews ({reviews.length})</h3>
                {reviews.length === 0 ? (
                  <p style={{ fontSize: 13, color: 'var(--text-light)' }}>No reviews yet.</p>
                ) : reviews.map(r => (
                  <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{r.user_name}</span>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} weight={i < r.rating ? 'fill' : 'regular'} color={i < r.rating ? '#ff6b35' : '#ddd'} />
                        ))}
                      </div>
                    </div>
                    {r.feedback && <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>{r.feedback}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Section */}
            <div className="card p-6" style={{ position: 'sticky', top: 140 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Book Appointment</h3>

              {/* Consult Type */}
              <div style={{ marginBottom: 16 }}>
                <label>Consultation Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                  {consultTypes.map(t => (
                    <button key={t.value} onClick={() => setConsultType(t.value)}
                      style={{
                        padding: '10px', borderRadius: 8, border: `2px solid ${consultType === t.value ? 'var(--primary)' : 'var(--border)'}`,
                        background: consultType === t.value ? 'var(--primary-light)' : '#fff',
                        color: consultType === t.value ? 'var(--primary)' : 'var(--text-body)',
                        fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>
                      <t.icon size={16} /> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div style={{ marginBottom: 16 }}>
                <label>Select Date</label>
                <input type="date" value={selectedDate} min={getMinDate()}
                  onChange={(e) => setSelectedDate(e.target.value)} className="input" style={{ marginTop: 6 }} />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div style={{ marginBottom: 16 }}>
                  <label>Available Slots</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginTop: 6 }}>
                    {availableSlots.map(slot => (
                      <button key={slot} onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '8px 4px', borderRadius: 6, border: `1px solid ${selectedSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                          background: selectedSlot === slot ? 'var(--primary)' : '#fff',
                          color: selectedSlot === slot ? '#fff' : 'var(--text-body)',
                          fontSize: 12, fontWeight: 500,
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Patient Info */}
              <div style={{ marginBottom: 16 }}>
                <label>Patient Name</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                  placeholder={user?.name || 'Your name'} className="input" style={{ marginTop: 6 }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label>Age (optional)</label>
                <input type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Patient age" className="input" style={{ marginTop: 6 }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label>Symptoms (optional)</label>
                <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms briefly..."
                  className="input" rows={3} style={{ marginTop: 6, resize: 'vertical' }} />
              </div>

              <button onClick={handleBook} disabled={booking || !selectedDate || !selectedSlot}
                className="btn btn-accent" style={{ fontSize: 15, padding: '14px' }}>
                {booking ? 'Booking...' : isAuthenticated ? `Book for ₹${doctor.fees}` : 'Login to Book'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
