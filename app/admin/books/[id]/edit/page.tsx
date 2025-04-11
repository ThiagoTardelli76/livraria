import BookForm from '@/components/books/BookForm';
import Link from 'next/link';

interface SegmentParams {
  id: string;
}

interface PageProps {
  params: SegmentParams;
  searchParams?: any;
}

export default function EditBookPage({ params }: PageProps) {
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
      
      <BookForm bookId={params.id} />
    </div>
  );
}