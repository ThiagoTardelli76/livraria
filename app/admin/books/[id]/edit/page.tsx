import BookForm from '@/components/books/BookForm';
import Link from 'next/link';
import { Metadata } from 'next';


interface PageParams {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: 'Editar Livro',
};

export default function EditBookPage({ params }: PageParams) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Livro</h1>
        <Link 
          href="/admin/books" 
          className="text-gray-500 hover:text-gray-700"
        >
          &larr; Voltar para lista
        </Link>
      </div>
      
      <BookForm bookId={params.id} mode="edit" isOpen={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      } } onSubmit={function (data: any): Promise<void> {
        throw new Error('Function not implemented.');
      } } initialData={null} />
    </div>
  );
}