import StudentForm from '@/components/StudentForm';

interface Props {
  params: {
    id: string
  }
}

export default function EditStudentPage({ params }: Props) {
  return <StudentForm studentId={params.id} />;
}