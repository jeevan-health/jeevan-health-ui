import api from './api.js';

export async function listFamily() {
  const { data } = await api.get('/family');
  return data.data.members || [];
}

export async function addFamilyMember(payload) {
  const { data } = await api.post('/family', payload);
  return data.data.member;
}

export async function removeFamilyMember(id) {
  await api.delete(`/family/${id}`);
}
