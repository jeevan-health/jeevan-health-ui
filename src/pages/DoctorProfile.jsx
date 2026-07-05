import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Clock, CaretLeft, CaretDown, CheckCircle, Shield, ChatCircle, VideoCamera, Phone,
  House, User, SealCheck, Certificate, Lightning, Article, CalendarBlank,
} from '@phosphor-icons/react';
import { getDoctor, getDoctorReviews, getBookedSlots, bookAppointment } from '../services/doctorService';
import useAuthStore from '../store/authStore';

const consultModes = [
  {
    value: 'video', label: 'Video Consultation', icon: VideoCamera,
    priceRange: '₹399 – ₹699', duration: '30 min session', features: ['Digital Prescription Included'],
    recommended: true,
  },
  {
    value: 'chat', label: 'Chat Consultation', icon: ChatCircle,
    priceRange: '₹199 – ₹299', duration: 'Instant response', features: ['Free follow-up for 3 days'],
    recommended: false,
  },
  {
    value: 'audio', label: 'Voice Call Consultation', icon: Phone,
    priceRange: '₹299 – ₹499', duration: '15–30 min call', features: ['Prescription included if required'],
    recommended: false,
  },
  {
    value: 'home', label: 'Home Visit Consultation', icon: House,
    priceRange: '₹999 – ₹1999', duration: 'Location based', features: ['Doctor visit at home', 'Same day availability (selected areas)', 'Physical examination included'],
    recommended: false,
  },
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
  const [expandedPricing, setExpandedPricing] = useState(null);

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

  if (loading) return <div className="page-section"><div style={{ textAlign: 'center', padding: 40 }}>Loading...</div></div>;
  if (!doctor) return <div className="page-section"><div style={{ textAlign: 'center', padding: 40 }}>Doctor not found</div></div>;

  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));
  const currentMode = consultModes.find(m => m.value === consultType);

  return (
    <div className="page-section" style={{ paddingBottom: 100 }}>
      <div className="container">

        {/* Back */}
        <button onClick={() => navigate('/doctor-consultation')} style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          color: 'var(--text-light)', marginBottom: 16, background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <CaretLeft size={14} /> Back to Doctors
        </button>

        {booked ? (
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle size={32} weight="fill" color="#2e7d32" />
            </div>
            <h2>Appointment Booked!</h2>
            <p style={{ color: 'var(--text-light)', marginTop: 8 }}>{selectedDate} at {selectedSlot} with {doctor.name}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/my-appointments')} className="btn-primary">View Appointments</button>
              <button onClick={() => navigate('/dashboard')} className="btn-outline">Go to Dashboard</button>
            </div>
          </div>
        ) : (
          <>
            {/* ========== LEFT COLUMN ========== */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>

              {/* LEFT */}
              <div>
                {/* Doctor Header */}
                <div style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', padding: 24, marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 88, height: 88, borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-light), #d4e4f7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      overflow: 'hidden', position: 'relative',
                    }}>
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }} />
                      ) : null}
                      <div style={{
                        display: doctor.image ? 'none' : 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        position: 'absolute', inset: 0,
                        fontSize: 32, fontWeight: 700, color: 'var(--primary)',
                      }}>
                        {doctor.name?.charAt(0)}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 20, margin: 0 }}>{doctor.name}</h2>
                      <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, marginTop: 2 }}>{doctor.specialty}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 2 }}>
                        {doctor.qualifications?.join(', ')}
                      </p>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                          <Star size={16} weight="fill" color="#0B4FA8" /> {doctor.rating}
                          <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({doctor.review_count} Reviews)</span>
                        </span>
                        <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-light)' }}>
                          <Clock size={16} /> {doctor.experience}+ Years Experience
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: '#e8f0fe', color: '#0B4FA8',
                        }}>
                          <SealCheck size={13} weight="fill" /> Verified by Jeevan HealthCare
                        </span>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: '#fef3e2', color: '#e65100',
                        }}>
                          <Certificate size={13} weight="fill" /> Medical Council Registered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div style={{
                    display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap',
                    padding: '12px 16px', background: '#e8f5e9', borderRadius: 'var(--radius)',
                  }}>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32', fontWeight: 600 }}>
                      <Lightning size={16} weight="fill" /> Available Now
                    </span>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32' }}>
                      <Clock size={16} weight="fill" /> Consultation within 30 minutes
                    </span>
                    <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32' }}>
                      <ChatCircle size={16} weight="fill" /> Instant Online Consultation Available
                    </span>
                  </div>
                </div>

                {/* Consultation Modes + Pricing */}
                <div style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 16,
                }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Article size={18} weight="fill" color="#0B4FA8" /> Choose Consultation Type
                    </h3>
                  </div>
                  {consultModes.map(mode => (
                    <div key={mode.value} style={{
                      borderBottom: '1px solid var(--border)',
                      background: consultType === mode.value ? '#e8f0fe' : '#fff',
                      position: 'relative',
                    }}>
                      <button onClick={() => {
                        setConsultType(mode.value);
                        setExpandedPricing(expandedPricing === mode.value ? null : mode.value);
                      }} style={{
                        width: '100%', background: 'none', border: 'none', padding: '14px 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', textAlign: 'left',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: consultType === mode.value ? '#0B4FA8' : '#f0f4f8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: consultType === mode.value ? '#fff' : '#0B4FA8',
                          }}>
                            <mode.icon size={20} weight="fill" />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                              {mode.label}
                              {mode.recommended && (
                                <span style={{
                                  fontSize: 10, background: '#00FFFF', color: '#083d86',
                                  padding: '1px 8px', borderRadius: 50, fontWeight: 700,
                                }}>RECOMMENDED</span>
                              )}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 1 }}>
                              {mode.priceRange} — {mode.duration}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          border: `2px solid ${consultType === mode.value ? '#0B4FA8' : '#ddd'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {consultType === mode.value && (
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0B4FA8' }} />
                          )}
                        </div>
                      </button>
                      {expandedPricing === mode.value && (
                        <div style={{ padding: '0 20px 14px 72px', fontSize: 13, color: 'var(--text-light)' }}>
                          {mode.features.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                              <CheckCircle size={13} weight="fill" color="#2e7d32" /> {f}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Specialization Summary */}
                <div style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', padding: 20, marginBottom: 16,
                }}>
                  <h3 style={{ fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Shield size={18} weight="fill" color="#0B4FA8" /> Specialization Summary
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6, marginBottom: 12 }}>{doctor.about}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {doctor.languages?.map(l => (
                      <span key={l} style={{
                        padding: '4px 12px', background: '#0B4FA8', color: '#fff',
                        borderRadius: 20, fontSize: 12, fontWeight: 600,
                      }}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', padding: 20, marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Star size={18} weight="fill" color="#0B4FA8" /> Patient Reviews ({reviews.length})
                    </h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#0B4FA8' }}>{doctor.rating}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{doctor.review_count} Reviews</div>
                    </div>
                  </div>
                  {reviews.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>No reviews yet.</p>
                  ) : reviews.slice(0, 5).map(r => (
                    <div key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{r.user_name}</span>
                        <div style={{ display: 'flex', gap: 2 }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} weight={i < r.rating ? 'fill' : 'regular'} color={i < r.rating ? '#0B4FA8' : '#ddd'} />
                          ))}
                        </div>
                      </div>
                      {r.feedback && <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>"{r.feedback}"</p>}
                    </div>
                  ))}
                </div>

                {/* Trust Footer */}
                <div style={{
                  background: 'linear-gradient(135deg, #0B4FA8, #0C6BC4)',
                  borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', color: '#fff',
                }}>
                  <Shield size={28} weight="fill" style={{ marginBottom: 8, opacity: 0.8 }} />
                  <h4 style={{ color: '#fff', fontSize: 14, marginBottom: 4 }}>Jeevan HealthCare at Home</h4>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5, maxWidth: 400, margin: '0 auto' }}>
                    India's trusted platform for home healthcare services, doctor consultations, diagnostics, nursing care, and preventive health management.
                  </p>
                </div>
              </div>

              {/* ========== RIGHT COLUMN — BOOKING ========== */}
              <div style={{ position: 'sticky', top: 140 }}>
                <div style={{
                  background: '#fff', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)', padding: 24,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                  <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Article size={18} weight="fill" color="#0B4FA8" /> Book Appointment
                  </h3>

                  {/* Selected Mode Summary */}
                  {currentMode && (
                    <div style={{
                      padding: '10px 14px', background: '#e8f0fe', borderRadius: 'var(--radius)',
                      marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <currentMode.icon size={20} weight="fill" color="#0B4FA8" />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{currentMode.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{currentMode.priceRange} — {currentMode.duration}</div>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 6, display: 'block' }}>
                      <CalendarBlank size={15} weight="fill" style={{ verticalAlign: 'middle', marginRight: 4 }} /> Select Date
                    </label>
                    <input type="date" value={selectedDate} min={getMinDate()}
                      onChange={(e) => setSelectedDate(e.target.value)} className="input" style={{ fontSize: 14 }} />
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 6, display: 'block' }}>
                        <Clock size={15} weight="fill" style={{ verticalAlign: 'middle', marginRight: 4 }} /> Available Slots
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                        {availableSlots.map(slot => (
                          <button key={slot} onClick={() => setSelectedSlot(slot)}
                            style={{
                              padding: '8px 4px', borderRadius: 6,
                              border: `1px solid ${selectedSlot === slot ? '#0B4FA8' : 'var(--border)'}`,
                              background: selectedSlot === slot ? '#0B4FA8' : '#fff',
                              color: selectedSlot === slot ? '#fff' : 'var(--text-body)',
                              fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patient Info */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 6, display: 'block' }}>
                      <User size={15} weight="fill" style={{ verticalAlign: 'middle', marginRight: 4 }} /> Patient Name
                    </label>
                    <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                      placeholder={user?.name || 'Your name'} className="input" style={{ fontSize: 14 }} />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 6, display: 'block' }}>
                      Age (optional)
                    </label>
                    <input type="number" value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="Patient age" className="input" style={{ fontSize: 14 }} />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 6, display: 'block' }}>
                      Symptoms (optional)
                    </label>
                    <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe your symptoms briefly..."
                      className="input" rows={3} style={{ fontSize: 14, resize: 'vertical' }} />
                  </div>

                  <button onClick={handleBook} disabled={booking || !selectedDate || !selectedSlot}
                    className="btn btn-accent" style={{
                      fontSize: 16, padding: '16px', fontWeight: 700,
                      background: '#0B4FA8', color: '#fff', borderRadius: 'var(--radius)',
                      width: '100%', border: 'none', cursor: booking || !selectedDate || !selectedSlot ? 'not-allowed' : 'pointer',
                      opacity: booking || !selectedDate || !selectedSlot ? 0.5 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s',
                    }}>
                    {booking ? 'Booking...' : isAuthenticated ? `Consult Now — ${currentMode?.priceRange || `₹${doctor.fees}`}` : 'Login to Book'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Mobile CTA */}
            <div style={{
              display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
              background: '#fff', borderTop: '1px solid var(--border)',
              padding: '12px 16px', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
            }} className="sticky-mobile-cta">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{doctor.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0B4FA8' }}>{currentMode?.priceRange || `₹${doctor.fees}`}</div>
                </div>
                <button onClick={() => document.querySelector('.booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: '#0B4FA8', color: '#fff', border: 'none', borderRadius: 'var(--radius)',
                    padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                    boxShadow: '0 4px 14px rgba(11,79,168,0.35)',
                  }}>
                  Consult Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-layout, div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          .sticky-mobile-cta { display: block !important; }
        }
      `}</style>
    </div>
  );
}
