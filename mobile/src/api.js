import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export const getApiBaseUrl = () => {
  const extra = Constants?.expoConfig?.extra || {};
  return extra.apiBaseUrl || 'http://10.0.2.2:5000';
};

export const api = axios.create({ baseURL: getApiBaseUrl() });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const absoluteUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = getApiBaseUrl();
  try {
    const u = new URL(path, base);
    return u.toString();
  } catch {
    return base.replace(/\/$/, '') + '/' + String(path).replace(/^\//, '');
  }
};

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  const token = res.data?.token;
  if (token) await SecureStore.setItemAsync('token', token);
  return res.data;
}

export async function logout() {
  await SecureStore.deleteItemAsync('token');
}
