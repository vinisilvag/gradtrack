// api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Curso
  const course = await prisma.course.upsert({
    where: { name: 'Sistemas de Informação' },
    update: {},
    create: { name: 'Sistemas de Informação', totalHours: 3000 },
  });

  // Disciplinas
  const calc = await prisma.subject.upsert({
    where: { code: 'MAT101' },
    update: {},
    create: { code: 'MAT101', name: 'Cálculo I', hours: 80, category: 'OBRIGATORIA' },
  });

  const lp = await prisma.subject.upsert({
    where: { code: 'INF110' },
    update: {},
    create: { code: 'INF110', name: 'Lógica de Programação', hours: 80, category: 'OBRIGATORIA' },
  });

  // Vincular disciplinas ao curso (idempotente, sem createMany)
  await prisma.courseSubject.upsert({
    where: { courseId_subjectId: { courseId: course.id, subjectId: calc.id } },
    update: { semester: 1 },
    create: { courseId: course.id, subjectId: calc.id, semester: 1 },
  });

  await prisma.courseSubject.upsert({
    where: { courseId_subjectId: { courseId: course.id, subjectId: lp.id } },
    update: { semester: 1 },
    create: { courseId: course.id, subjectId: lp.id, semester: 1 },
  });

  // Aluno
  const student = await prisma.student.upsert({
    where: { email: 'joao@exemplo.com' },
    update: {},
    create: { name: 'João Silva', email: 'joao@exemplo.com', courseId: course.id },
  });

  // Progresso (idempotente)
  await prisma.progress.upsert({
    where: { studentId_subjectId: { studentId: student.id, subjectId: calc.id } },
    update: { status: 'APROVADO', grade: 8 },
    create: { studentId: student.id, subjectId: calc.id, status: 'APROVADO', grade: 8 },
  });

  await prisma.progress.upsert({
    where: { studentId_subjectId: { studentId: student.id, subjectId: lp.id } },
    update: { status: 'CURSANDO' },
    create: { studentId: student.id, subjectId: lp.id, status: 'CURSANDO' },
  });

  console.log('✅ Seed ok! studentId =', student.id);
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });