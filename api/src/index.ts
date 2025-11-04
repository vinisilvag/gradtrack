import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { getStudentReport } from './report';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// cria aluno
app.post('/students', async (req, res) => {
  try {
    const { name, email, courseId } = req.body;
    const st = await prisma.student.create({ data: { name, email, courseId } });
    res.json(st);
  } catch (e:any) { res.status(400).json({ error: e.message }); }
});

// atualiza progresso
app.patch('/progress', async (req, res) => {
  try {
    const { studentId, subjectId, status, grade } = req.body;
    const up = await prisma.progress.upsert({
      where: { studentId_subjectId: { studentId, subjectId } },
      update: { status, grade },
      create: { studentId, subjectId, status, grade },
    });
    res.json(up);
  } catch (e:any) { res.status(400).json({ error: e.message }); }
});

// extrato
app.get('/reports/:studentId', async (req, res) => {
  try {
    res.json(await getStudentReport(req.params.studentId));
  } catch (e:any) { res.status(404).json({ error: e.message }); }
});

app.get('/health', (_,res)=>res.send('ok'));

app.listen(process.env.PORT ?? 3000, () =>
  console.log('API on :3000')
);
