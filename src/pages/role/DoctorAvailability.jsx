import { useState } from 'react';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState(() => {
    const obj = {};
    DAYS.forEach(d => { obj[d] = [true, true, true, true, true, true]; });
    return obj;
  });

  const toggle = (day, idx) => setAvailability(prev => ({
    ...prev, [day]: prev[day].map((v, i) => i === idx ? !v : v)
  }));

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>⏰ Availability</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Set your weekly consultation slots</p>
      {DAYS.map(day => (
        <div key={day} style={{ ...card, padding: 14 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 8px' }}>{day}</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SLOTS.map((slot, idx) => (
              <button key={slot} onClick={() => toggle(day, idx)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit',
                background: availability[day][idx] ? '#7c3aed' : '#f1f5f9',
                color: availability[day][idx] ? '#fff' : '#94a3b8', fontWeight: 600,
              }}>{slot}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}