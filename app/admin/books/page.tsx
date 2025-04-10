'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
  is_available: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/books');
        if (!response.ok) throw new Error('Erro ao carregar livros');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao excluir');

        setBooks(books.filter(book => book.id !== id));
        toast.success('Livro excluído com sucesso!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao excluir');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Lista de Livros</h1>
        <Link
          href="/admin/books/create"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Adicionar Livro
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publicação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(book.published_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    book.is_available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.is_available ? 'Disponível' : 'Indisponível'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/admin/books/${book.id}/edit`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {books.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum livro cadastrado.
          </div>
        )}
      </div>
    </div>
  );
}