'use client'
import { useState } from 'react';
import { UserRole } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const [username, setUsername] = useState<UserRole>('student'); // Valor inicial
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação adicional
    if (username !== 'admin' && username !== 'student') {
      setError('Tipo de usuário inválido');
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={username}
        onChange={(e) => setUsername(e.target.value as UserRole)}
        required
      >
        <option value="student">Estudante</option>
        <option value="admin">Administrador</option>
      </select>
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}