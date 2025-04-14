'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Book } from '@/app/dashboard/books/page';



interface BookFormProps {
  bookId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData: Book | null;
  mode?: 'create' | 'edit';
}


export default function BookForm({ bookId, mode = 'create' }: BookFormProps) {
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    published_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (bookId) {
      const fetchBookData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:8000/api/books/${bookId}`);
          
          if (!response.ok) {
            throw new Error('Livro não encontrado');
          }

          const data = await response.json();
          setFormData({
            title: data.title,
            author: data.author,
            published_date: data.published_date.split('T')[0] // Formata a data
          });
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Erro ao carregar');
          router.push('/admin/books');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookData();
    }
  }, [bookId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const url = bookId 
        ? `http://localhost:8000/api/books/${bookId}`
        : 'http://localhost:8000/api/books';
      
      const method = bookId ? 'PUT' : 'POST';
  
      const payload = {
        title: formData.title,
        author: formData.author,
        published_date: new Date(formData.published_date).toISOString()
      };
  
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar livro');
      }
  
      toast.success(`Livro ${bookId ? 'atualizado' : 'adicionado'} com sucesso!`);
      
    
      router.push('/admin/dashboard');
      router.refresh();
  
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6">
      {mode === 'edit' ? 'Editar Livro' : 'Adicionar Livro'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Autor *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data Publicação *</label>
          <input
            type="date"
            name="published_date"
            value={formData.published_date}
            onChange={(e) => setFormData({...formData, published_date: e.target.value})}
            className="mt-1 block w-full p-2 border rounded-md"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 border rounded-md"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}