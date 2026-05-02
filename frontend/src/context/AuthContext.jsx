import { createContext, useEffect, useState } from 'react';
import { login as loginService, register as registerService } from '../services/authService';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

const STORAGE_KEY = 'online-exam-auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persistAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: userData, token: authToken }));
  };

  const login = async (credentials) => {
    try {
      const data = await loginService(credentials);
      persistAuth(data, data.token);
      showToast('Logged in successfully', 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (values) => {
    try {
      const data = await registerService(values);
      persistAuth(data, data.token);
      showToast('Registration successful', 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Logged out', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
