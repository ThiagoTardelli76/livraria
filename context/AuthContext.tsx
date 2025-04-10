'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email?: string;
  type: 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (type: 'admin' | 'student', credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verifica autenticação ao carregar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setUser(null);
            return;
        }

        const response = await fetch('http://localhost:8000/api/check-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data.user);
        } else {
            localStorage.removeItem('authToken');
            setUser(null);
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
        setUser(null);
    }
};

  const login = async (type: 'admin' | 'student', credentials: any) => {
    try {
      setLoading(true);
      const endpoint = type === 'admin' ? '/admin/login' : '/student/login';
      
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const data = await response.json();
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        type: type
      };

      // Armazena token e dados do usuário
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(data.token);
      setUser(userData);

      // Redireciona conforme o tipo de usuário
      const redirectPath = type === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      router.push(redirectPath);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}