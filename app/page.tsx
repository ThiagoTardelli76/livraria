'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  author: string;
  is_available: boolean;
}

export default function HomePage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('http://localhost:8000/api/books');
      const data = await res.json();
      setBooks(data);
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleRent = async (bookId: number) => {
    try {
      const res = await fetch('http://localhost:8000/api/books/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ book_id: bookId })
      });

      if (!res.ok) throw new Error(await res.text());

      // Atualiza o status do livro localmente
      setBooks(books.map(book => 
        book.id === bookId ? { ...book, is_available: false } : book
      ));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao alugar');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Biblioteca Universitária</h1>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            {/* Descrição */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Bem-vindo à nossa Biblioteca</h2>
              <p className="text-gray-600 mb-4">
                A Biblioteca Universitária oferece um vasto acervo de livros acadêmicos e literários 
                para apoio às atividades de ensino, pesquisa e extensão da nossa universidade.
              </p>
              <p className="text-gray-600">
                Nossa missão é proporcionar acesso à informação e incentivar o hábito da leitura 
                entre estudantes e professores.
              </p>
            </div>

            {/* Área de Login */}
            <div className="border-t pt-6">
              <p className="text-gray-700 mb-4">
                Para alugar algum livro, cadastre-se com seu nome completo e email de aluno
              </p>
              <Link 
                href="/login" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Biblioteca Universitária - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}