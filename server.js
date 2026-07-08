const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Seed Data ──
const tests = [
  { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', price: 399, description: 'Measures red blood cells, white blood cells, hemoglobin, platelets, and more to assess overall health.', fasting_required: false },
  { id: 2, name: 'HbA1c', category: 'Diabetes', price: 599, description: 'Measures average blood sugar levels over the past 2-3 months to monitor diabetes control.', fasting_required: false },
  { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', category: 'Thyroid', price: 499, description: 'Evaluates thyroid gland function by measuring T3, T4, and TSH hormone levels.', fasting_required: true },
  { id: 4, name: 'Lipid Profile', category: 'Cardiac', price: 449, description: 'Measures cholesterol, HDL, LDL, and triglycerides to assess heart disease risk.', fasting_required: true },
  { id: 5, name: 'Vitamin D Total', category: 'Vitamins', price: 799, description: 'Measures 25-hydroxyvitamin D levels to assess vitamin D deficiency or excess.', fasting_required: false },
  { id: 6, name: 'Liver Function Test (LFT)', category: 'Full Body', price: 549, description: 'Measures enzymes, proteins, and bilirubin to evaluate liver health and function.', fasting_required: true },
  { id: 7, name: 'Kidney Function Test (KFT)', category: 'Full Body', price: 499, description: 'Measures creatinine, BUN, uric acid, and electrolytes to assess kidney function.', fasting_required: true },
  { id: 8, name: 'Iron Studies', category: 'Anemia', price: 699, description: 'Measures serum iron, ferritin, TIBC, and transferrin saturation to evaluate iron status.', fasting_required: true },
  { id: 9, name: 'Vitamin B12', category: 'Vitamins', price: 699, description: 'Measures vitamin B12 levels to detect deficiency causing anemia or neurological issues.', fasting_required: false },
  { id: 10, name: 'TSH', category: 'Thyroid', price: 349, description: 'Measures thyroid-stimulating hormone as a first-line screening for thyroid disorders.', fasting_required: false },
];

const users = [];

// ── API Endpoints ──

// Tests
app.get('/api/tests', (req, res) => {
  const { q, cat } = req.query;
  let result = tests;
  if (q) result = result.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || (t.category || '').toLowerCase().includes(q.toLowerCase()));
  if (cat) result = result.filter(t => t.category === cat);
  res.json(result);
});

app.get('/api/tests/:id', (req, res) => {
  const t = tests.find(t => t.id === Number(req.params.id));
  t ? res.json(t) : res.status(404).json({ error: 'Test not found' });
});

app.get('/api/categories', (req, res) => {
  const cats = [...new Set(tests.map(t => t.category))].filter(Boolean);
  res.json(cats);
});

// Auth
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length !== 10) return res.status(400).json({ error: 'Valid 10-digit phone required' });
  res.json({ success: true, message: 'OTP sent' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== '123456') return res.status(400).json({ error: 'Invalid OTP' });
  let u = users.find(u => u.phone === phone);
  if (!u) { u = { id: users.length + 1, phone, name: '', email: '' }; users.push(u); }
  res.json({ success: true, token: 'mock-token-' + u.id, user: u });
});

app.get('/api/auth/profile', (req, res) => {
  res.json({ id: 1, phone: '9700104108', name: 'Patient', email: '' });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json([
    { id: 1, test: 'Complete Blood Count (CBC)', status: 'Completed', amount: 299, date: '15 Jun 2026' },
    { id: 2, test: 'HbA1c', status: 'Processing', amount: 599, date: '18 Jun 2026' },
  ]);
});

// Contact
app.post('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Message received' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Jeevan Health API running on port ' + PORT));
