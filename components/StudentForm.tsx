'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function StudentForm({ studentId }: { studentId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    nif: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Carrega dados do estudante se estiver em modo de edição
  useEffect(() => {
    if (studentId) {
      const fetchStudent = async () => {
        try {
          const response = await fetch(`http://library-api-production-3647.up.railway.app/api/students/${studentId}`);
          const data = await response.json();
          setFormData({
            name: data.name,
            email: data.email,
            birthdate: data.birthdate.split('T')[0],
            nif: data.nif
          });
        } catch (error) {
          toast.error('Falha ao carregar estudante');
        }
      };
      fetchStudent();
    }
  }, [studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = studentId 
        ? `http://library-api-production-3647.up.railway.app/api/students/${studentId}`
        : 'http://library-api-production-3647.up.railway.app/api/students';
      
      const method = studentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          birthdate: formData.birthdate.split('-').reverse().join('/') // Converte para d/m/Y
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      toast.success(`Estudante ${studentId ? 'atualizado' : 'criado'} com sucesso!`);
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-black">
      <h1 className="text-2xl font-bold mb-6">
        {studentId ? 'Editar Estudante' : 'Adicionar Estudante'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nome Completo</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Data de Nascimento</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded"
            value={formData.birthdate}
            onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">NIF</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={formData.nif}
            onChange={(e) => setFormData({...formData, nif: e.target.value})}
            required
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