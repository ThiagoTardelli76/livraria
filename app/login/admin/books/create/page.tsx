'use client';
import BookForm from '@/components/books/BookForm';

export default function CreateBookPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookForm isOpen={false} onClose={function (): void {
        throw new Error('Function not implemented.');
      } } initialData={null} />
    </div>
  );
}