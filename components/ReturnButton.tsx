'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ReturnButton({ 
    loanId, 
    onReturn 
}: { 
    loanId: number, 
    onReturn: () => void 
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleReturn = async () => {
        if (!confirm('Tem certeza que deseja devolver este livro?')) return;
        
        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/loans/${loanId}/return`, 
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao devolver livro');
            }

            toast.success('Livro devolvido com sucesso!');
            onReturn();
        } catch (error) {
            console.error('Erro detalhado:', error);
            toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleReturn}
            disabled={isLoading}
            className={`px-3 py-1 rounded ${
                isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
        >
            {isLoading ? 'Devolvendo...' : 'Devolver Livro'}
        </button>
    );
}