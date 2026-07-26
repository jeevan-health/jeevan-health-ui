import api from './api.js';

export async function sendOtp({ channel, destination }) {
  const { data } = await api.post('/auth/send-otp', { channel, destination });
  return data.data;
}

export async function verifyOtp({ channel, destination, code, name }) {
  const { data } = await api.post('/auth/verify-otp', {
    channel,
    destination,
    code,
    name,
  });
  return data.data;
}

export async function googleLogin(credential) {
  const { data } = await api.post('/auth/google', { credential });
  return data.data;
}

export async function refreshTokens(refreshToken) {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data.data;
}

export async function logout(refreshToken) {
  try {
    await api.post('/auth/logout', { refreshToken });
  } catch {
    /* ignore network errors on logout */
  }
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data.data.user;
}
