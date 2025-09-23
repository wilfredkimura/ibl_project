import React, { createContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, login as apiLogin } from '../api';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync('token');
      setToken(t || null);
      if (t) {
        try {
          // Prefer server profile for authoritative flags like is_admin
          const res = await api.get('/api/profile');
          setUser(res.data || null);
        } catch {
          try { setUser(jwtDecode(t)); } catch { setUser(null); }
        }
      }
      setLoading(false);
    })();
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    setToken,
    signIn: async (email, password) => {
      const data = await apiLogin(email, password);
      const t = data?.token;
      if (t) {
        setToken(t);
        try {
          const res = await api.get('/api/profile');
          setUser(res.data || null);
        } catch {
          try { setUser(jwtDecode(t)); } catch { setUser(null); }
        }
      }
      return data;
    },
    signOut: async () => {
      await SecureStore.deleteItemAsync('token');
      setToken(null);
      setUser(null);
    },
    isAdmin: !!(user && user.is_admin)
  }), [token, user]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
