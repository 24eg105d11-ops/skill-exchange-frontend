import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      // Periodically refresh notification badge every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchUnreadCount = async () => {
    try {
      const data = await api.get('/api/notifications/unread-count');
      if (data && typeof data.unreadCount === 'number') {
        setUnreadNotifications(data.unreadCount);
      }
    } catch {
      // Ignore background badge fetch errors
    }
  };

  const login = async (email, password) => {
    const data = await api.post('/api/auth/login', { email, password });
    const authUser = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(authUser));

    setToken(data.token);
    setUser(authUser);
    fetchUnreadCount();
    return authUser;
  };

  const register = async (registerData) => {
    const data = await api.post('/api/auth/register', registerData);
    const authUser = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(authUser));

    setToken(data.token);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setUnreadNotifications(0);
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ROLE_ADMIN',
    unreadNotifications,
    refreshUnreadCount: fetchUnreadCount,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
