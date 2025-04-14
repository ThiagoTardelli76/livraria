'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface RentButtonProps {
  bookId: number;
  available?: boolean;
  onRentSuccess?: () => void;
}

export default function RentButton({
  bookId,
  available = true,
  onRentSuccess
}: RentButtonProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRent = async () => {
    if (!available || !user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          book_id: bookId,
          student_id: user.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao alugar livro');
      }

      toast.success('Livro alugado com sucesso!');
      onRentSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRent}
      disabled={!available || isLoading}
      className={`px-4 py-2 rounded ${
        (!available || isLoading) ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
      } text-white`}
    >
      {isLoading ? 'Processando...' : available ? 'Alugar' : 'Indisponível'}
    </button>
  );
}