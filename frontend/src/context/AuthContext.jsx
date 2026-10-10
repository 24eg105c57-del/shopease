import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shopease_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('shopease_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When initialized, if token exists, optionally verify session
    if (token) {
      authService
        .getCurrentUser()
        .then((res) => {
          if (res.data) {
            setUser((prev) => {
              const updated = {
                ...(prev || {}),
                id: res.data.id,
                name: res.data.name,
                email: res.data.email,
                roles: prev?.roles || [res.data.role],
              };
              localStorage.setItem('shopease_user', JSON.stringify(updated));
              return updated;
            });
          }
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const data = res.data; // JwtResponse
    const userData = {
      id: data.id,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      roles: data.roles || [],
      token: data.token,
    };

    localStorage.setItem('shopease_token', data.token);
    localStorage.setItem('shopease_user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    return await authService.register(formData);
  };

  const logout = () => {
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('shopease_user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin =
    isAuthenticated &&
    Array.isArray(user?.roles) &&
    user.roles.some((r) => r === 'ROLE_ADMIN' || r === 'ADMIN');
  const isCustomer =
    isAuthenticated &&
    Array.isArray(user?.roles) &&
    user.roles.some(
      (r) => r === 'ROLE_CUSTOMER' || r === 'CUSTOMER' || r === 'ROLE_USER'
    );

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isCustomer,
    login,
    register,
    logout,
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
