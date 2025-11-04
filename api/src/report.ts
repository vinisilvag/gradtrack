import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getStudentReport(studentId: string) {
  const s = await prisma.student.findUnique({
    where: { id: studentId },
    include: { course: true, progress: { include: { subject: true } } },
  });
  if (!s) throw new Error('Aluno não encontrado');

  const approved = s.progress.filter((p: { status: string; }) => p.status === 'APROVADO');
  const approvedHours = approved.reduce((acc: any, p: { subject: { hours: any; }; }) => acc + p.subject.hours, 0);

  const categories = s.progress.reduce((acc: any, p: { subject: { category: any; hours: any; }; status: string; }) => {
    const k = p.subject.category;
    acc[k] ??= { done: 0, total: 0 };
    acc[k].total += p.subject.hours;
    if (p.status === 'APROVADO') acc[k].done += p.subject.hours;
    return acc;
  }, {});

  return {
    student: { id: s.id, name: s.name, email: s.email },
    course: { id: s.courseId, name: s.course.name, totalHours: s.course.totalHours },
    approvedHours,
    remainingHours: Math.max(s.course.totalHours - approvedHours, 0),
    categories,
  };
}
