// OWNER - HEET
// PURPOSE - Provide logged-in role state across the app.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredRole, setStoredRole, getStoredToken, setStoredToken } from '../services/storage';
import { ROLES } from '../constants/roles';
import { getResolvedApiBaseUrl } from '../api/liveClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const storedRole = await getStoredRole();
        const storedToken = await getStoredToken();
        if (!alive) return;
        
        if (storedToken && storedRole && Object.values(ROLES).includes(storedRole)) {
          setRole(storedRole);
          setToken(storedToken);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      role,
      username,
      token,
      loading,
      async login(usernameInput, passwordInput) {
        const baseUrl = getResolvedApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput, password: passwordInput })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        
        setRole(data.user.role);
        setUsername(data.user.username);
        setToken(data.token);
        
        await setStoredRole(data.user.role);
        await setStoredToken(data.token);
      },
      async signup(usernameInput, passwordInput, roleInput) {
        const baseUrl = getResolvedApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameInput, password: passwordInput, role: roleInput })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');
        
        setRole(data.user.role);
        setUsername(data.user.username);
        setToken(data.token);
        
        await setStoredRole(data.user.role);
        await setStoredToken(data.token);
      },
      async logout() {
        setRole(null);
        setUsername(null);
        setToken(null);
        await setStoredRole(null);
        await setStoredToken(null);
      },
    }),
    [role, username, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
