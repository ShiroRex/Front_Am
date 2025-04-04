import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { isAuthenticated, logout, getCurrentUser } from '../Services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<boolean>(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const auth = isAuthenticated();
      setAuthState(auth);
      
      if (auth) {
        try {
          const userData = await getCurrentUser();
          setUser(userData.user);
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          handleLogout();
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setAuthState(true);
    
    // Obtener información del usuario después de login
    getCurrentUser()
      .then(userData => {
        setUser(userData.user);
      })
      .catch(error => {
        console.error('Error al obtener datos del usuario después de login:', error);
      });
  };

  const handleLogout = () => {
    logout();
    setAuthState(false);
    setUser(null);
  };

  const value = {
    isAuthenticated: authState,
    user,
    login: handleLogin,
    logout: handleLogout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};