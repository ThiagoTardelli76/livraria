'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Biblioteca Universitária</h1>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
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
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Biblioteca Universitária - Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}