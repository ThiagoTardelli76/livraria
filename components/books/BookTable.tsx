interface Book {
  id: number;
  title: string;
  author: string;
  published_date: string;
  is_available?: boolean;
}

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir este livro?')) {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erro ao excluir');
      onDeleteSuccess(); // Atualiza a lista após exclusão
    } catch (error) {
      console.error('Erro:', error);
    }
  }
};

<button onClick={() => handleDelete(Book.id)}>Excluir</button>

export default function BookTable({ books, onEdit, onDelete }: BookTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Autor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Publicação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {book.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.author}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(book.published_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(book)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(book.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function onDeleteSuccess() {
  throw new Error("Function not implemented.");
}
