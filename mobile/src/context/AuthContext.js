// OWNER - HEET
// PURPOSE - Provide logged-in role state across the app.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredRole, setStoredRole } from '../services/storage';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stored = await getStoredRole();
        if (!alive) return;
        if (stored && Object.values(ROLES).includes(stored)) setRole(stored);
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
      loading,
      async login(nextRole) {
        setRole(nextRole);
        await setStoredRole(nextRole);
      },
      async logout() {
        setRole(null);
        await setStoredRole(null);
      },
    }),
    [role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

