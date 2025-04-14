'use client';
import BookForm from '@/components/books/BookForm';
import { useState } from 'react';

export default function CreateBookPage() {
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (bookData: any) => {
    // Lógica para criar o livro
    console.log('Dados do livro:', bookData);
    setIsOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BookForm 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={null} // Ou dados iniciais se for edição
      />
    </div>
  );
}