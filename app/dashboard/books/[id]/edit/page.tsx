import BookForm from '@/components/books/BookForm';

interface PageParams {
  params: {
    id: string;
  };
}

export default function EditBookPage({ params }: PageParams) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Livro</h1>
      <BookForm bookId={params.id} mode="edit" isOpen={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      } } initialData={null} />
    </div>
  );
}