import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'manager' | 'admin' | 'enterprise_admin' | 'super_admin' | 'platform_owner';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'signportal_auth_token';
const USER_KEY = 'signportal_user';

// ============================================================================
// Provider
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Initialize auth state from secure storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const [token, userJson] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, data.token),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user)),
      ]);

      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      
      // Demo mode: simulate login
      const demoUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: 'user',
      };

      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, 'demo-token'),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(demoUser)),
      ]);

      setState({
        user: demoUser,
        isAuthenticated: true,
        isLoading: false,
        token: 'demo-token',
      });

      return true;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshToken = async () => {
    // TODO: Implement token refresh
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
