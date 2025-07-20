import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

const STORAGE_KEY = 'photo_complaint_auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      setAuthState(parsedAuth);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      const newAuthState = { user, isAuthenticated: true };
      setAuthState(newAuthState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuthState));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find((u: User) => u.username === username || u.email === email);
    
    if (userExists) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      createdAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const newAuthState = { user: newUser, isAuthenticated: true };
    setAuthState(newAuthState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuthState));
    return true;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem(STORAGE_KEY);
  };

  return { authState, login, register, logout };
};