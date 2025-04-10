import StudentForm from '@/components/StudentForm';

export default function EditStudentPage({ params }: { params: { id: string } }) {
  return <StudentForm studentId={params.id} />;
}