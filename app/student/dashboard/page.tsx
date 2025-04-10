'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import ReturnButton from '@/components/ReturnButton';
import RentButton from '@/components/RentButton';

interface Book {
    id: number;
    title: string;
    author: string;
    is_available: boolean;
}

interface Loan {
    id: number;
    book: Book;
    issue_date: string;
    return_date: string;
}

export default function StudentDashboard() {
    const { user } = useAuth();
    const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
    const [myLoans, setMyLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchStudentData();
        }
    }, [user]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [booksRes, loansRes] = await Promise.all([
                fetch('http://localhost:8000/api/books/available'),
                fetch(`http://localhost:8000/api/loans/active/${user?.id}`)
            ]);
    
            if (!booksRes.ok) throw new Error('Erro ao carregar livros');
            if (!loansRes.ok) throw new Error('Erro ao carregar empréstimos');
    
            const booksData = await booksRes.json();
            const loansData = await loansRes.json();
    
            setAvailableBooks(booksData);
            setMyLoans(loansData);
            
        } catch (err) {
            console.error('Erro detalhado:', err);
            setError('Erro ao carregar dados. Tente recarregar a página.');
        } finally {
            setLoading(false);
        }
    };

    const handleReturnSuccess = (loanId: number) => {
      // Atualiza o estado local removendo o livro devolvido
      setMyLoans(prevLoans => prevLoans.filter(loan => loan.id !== loanId));
      
      // Opcional: Recarrega os dados para garantir consistência
      fetchStudentData();
  };

    if (loading) return <div className="text-center py-8">Carregando dados...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    /* function handleReturnSuccess(id: number): void {
        throw new Error('Function not implemented.');
    } */

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bem-vindo, {user?.name}!</h1>
      
      {/* Seção de Livros Alugados */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Meus Livros Alugados</h2>
        
        {myLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {myLoans.map(loan => (
              <div key={loan.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{loan.book.title}</h3>
                <p className="text-gray-600 mb-1">Autor: {loan.book.author}</p>
                <p className="text-gray-600 mb-1">
                  Data do Empréstimo: {new Date(loan.issue_date).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-gray-600 mb-4">
                  Data de Devolução: {new Date(loan.return_date).toLocaleDateString('pt-BR')}
                </p>
                <ReturnButton 
                  loanId={loan.id} 
                  onReturn={() => handleReturnSuccess(loan.id)} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">Você não possui livros alugados no momento.</p>
          </div>
        )}
      </section>

      {/* Seção de Livros Disponíveis */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Livros Disponíveis</h2>
        
        {availableBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-black">
            {availableBooks.map(book => (
              <div key={book.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-2">Autor: {book.author}</p>
                <p className="text-gray-500 text-sm mb-4">
                  Publicação: {new Date(book.published_date).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex justify-end">
                  <RentButton 
                    bookId={book.id} 
                    onRentSuccess={fetchStudentData} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800">Nenhum livro disponível no momento.</p>
          </div>
        )}
      </section>
    </div>
  );
}