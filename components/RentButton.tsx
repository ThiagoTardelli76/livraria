'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function RentButton({ bookId, onRentSuccess }: { 
    bookId: number,
    onRentSuccess?: () => void 
}) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleRent = async () => {
        if (!user) {
            toast.error('Faça login para alugar livros');
            return;
        }

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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao alugar livro');
            }

            toast.success('Livro alugado com sucesso!');
            onRentSuccess?.();
            
        } catch (error) {
            console.error('Erro detalhado:', error);
            toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleRent}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
                isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
            } text-white`}
        >
            {isLoading ? 'Processando...' : 'Alugar'}
        </button>
    );
}