import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopsphere_user');
    return saved ? JSON.parse(saved) : {
      id: 2,
      name: 'Jane Doe',
      email: 'customer@shopsphere.com',
      role: 'ROLE_CUSTOMER'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopsphere_token') || '');

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res && res.data) {
      const authData = res.data;
      const userData = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
        phone: authData.phone
      };
      setUser(userData);
      setToken(authData.token);
      localStorage.setItem('shopsphere_user', JSON.stringify(userData));
      localStorage.setItem('shopsphere_token', authData.token);
      return userData;
    }
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    if (res && res.data) {
      const authData = res.data;
      const userData = {
        id: authData.id,
        name: authData.name,
        email: authData.email,
        role: authData.role,
        phone: authData.phone
      };
      setUser(userData);
      setToken(authData.token);
      localStorage.setItem('shopsphere_user', JSON.stringify(userData));
      localStorage.setItem('shopsphere_token', authData.token);
      return userData;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('shopsphere_user');
    localStorage.removeItem('shopsphere_token');
  };

  const switchDemoRole = (role) => {
    if (role === 'ROLE_ADMIN') {
      const adminUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@shopsphere.com',
        role: 'ROLE_ADMIN'
      };
      setUser(adminUser);
      localStorage.setItem('shopsphere_user', JSON.stringify(adminUser));
    } else {
      const custUser = {
        id: 2,
        name: 'Jane Doe',
        email: 'customer@shopsphere.com',
        role: 'ROLE_CUSTOMER'
      };
      setUser(custUser);
      localStorage.setItem('shopsphere_user', JSON.stringify(custUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, switchDemoRole, isAdmin: user?.role === 'ROLE_ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
