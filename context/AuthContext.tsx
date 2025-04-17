'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = "admin" | "student";

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
  register?: (credentials: any) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isAuthenticated: false,
  loading: true,
  checkAuth: async () => {},
});

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

        const response = await fetch('https://library-api-production-3647.up.railway.app/api/check-auth', {
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

  const login = async (type: 'admin' | 'student', credentials: unknown) => {
    try {
      setLoading(true);
      const endpoint = type === 'admin' ? '/admin/login' : '/student/login';
      
      const response = await fetch(`https://library-api-production-3647.up.railway.app/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text(); // ← Aqui a gente pega a resposta como texto bruto
        console.error('Erro completo do backend:', errorText); // ← Log pra gente ver o que veio
        throw new Error('Erro no login. Veja o console.');
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