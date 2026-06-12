'use client';

import { useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('not authenticated');
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      .then(() => {
        window.location.href = '/';
      });
  };

  return { user, loading, logout };
}
