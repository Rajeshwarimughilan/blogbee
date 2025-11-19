import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitial = () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user')) || null;
      return { user, token };
    } catch (e) {
      return { user: null, token: null };
    }
  };

  const [auth, setAuth] = useState(getInitial);

  useEffect(() => {
    // keep localStorage in sync
    if (auth.token) {
      localStorage.setItem('token', auth.token);
    } else {
      localStorage.removeItem('token');
    }

    if (auth.user) {
      localStorage.setItem('user', JSON.stringify(auth.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [auth]);

  const login = (user, token) => {
    setAuth({ user, token });
  };

  const logout = () => {
    authService.logout();
    setAuth({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, logout, isAuthenticated: !!auth.token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
