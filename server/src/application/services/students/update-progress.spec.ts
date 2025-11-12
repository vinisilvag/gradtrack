import { UpdateProgress } from "./update-progress";

import { InMemoryStudentsRepository } from "@tests/repositories/in-memory-students-repository";
import { InMemorySubjectsRepository } from "@tests/repositories/in-memory-subjects-repository";
import { InMemoryProgressRepository } from "@tests/repositories/in-memory-progress-repository";

import { faker } from "@faker-js/faker";

import { SubjectCategory } from "@prisma/client";

import { StudentNotFound } from "@/application/errors/students/student-not-found";
import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";

describe("Get Students", () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository;
  let inMemorySubjectsRepository: InMemorySubjectsRepository;
  let inMemoryProgressRepository: InMemoryProgressRepository;
  let updateProgress: UpdateProgress;

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemorySubjectsRepository = new InMemorySubjectsRepository();
    inMemoryProgressRepository = new InMemoryProgressRepository();
    updateProgress = new UpdateProgress(
      inMemoryStudentsRepository,
      inMemorySubjectsRepository,
      inMemoryProgressRepository,
    );
  });

  it("should insert a progress record successfully", async () => {
    const student = await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });

    const subject = await inMemorySubjectsRepository.create({
      name: faker.word.words(3),
      code: faker.string.alpha(6),
      category: "MANDATORY" as SubjectCategory,
      hours: faker.number.int({ min: 30, max: 120 }),
    });

    const { update } = await updateProgress.execute({
      studentId: student.id,
      subjectId: subject.id,
      grade: faker.number.int({ min: 60, max: 100 }),
      status: "APPROVED",
    });

    expect(update).toBeTruthy();
    expect(update).toHaveProperty("status", "APPROVED");
  });

  it("should update a progress record successfully", async () => {
    const student = await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });

    const subject = await inMemorySubjectsRepository.create({
      name: faker.word.words(3),
      code: faker.string.alpha(6),
      category: "MANDATORY" as SubjectCategory,
      hours: faker.number.int({ min: 30, max: 120 }),
    });

    const { update: previousUpdate } = await updateProgress.execute({
      studentId: student.id,
      subjectId: subject.id,
      status: "IN_PROGRESS",
      grade: undefined,
    });

    expect(previousUpdate).toBeTruthy();
    expect(previousUpdate).toHaveProperty("status", "IN_PROGRESS");
    expect(previousUpdate).toHaveProperty("grade", null);

    const { update } = await updateProgress.execute({
      studentId: student.id,
      subjectId: subject.id,
      grade: faker.number.int({ min: 60, max: 100 }),
      status: "APPROVED",
    });

    expect(update).toBeTruthy();
    expect(update).toHaveProperty("status", "APPROVED");
    expect(update).toHaveProperty("grade", update.grade);
  });

  it("should throw an error if the student ID does not exist", async () => {
    const subject = await inMemorySubjectsRepository.create({
      name: faker.word.words(3),
      code: faker.string.alpha(6),
      category: "MANDATORY" as SubjectCategory,
      hours: faker.number.int({ min: 30, max: 120 }),
    });

    expect(async () => {
      await updateProgress.execute({
        studentId: faker.string.uuid(),
        subjectId: subject.id,
        status: "IN_PROGRESS",
        grade: undefined,
      });
    }).rejects.toEqual(new StudentNotFound());
  });

  it("should throw an error if the subject ID does not exist", async () => {
    const student = await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });

    expect(async () => {
      await updateProgress.execute({
        studentId: student.id,
        subjectId: faker.string.uuid(),
        status: "IN_PROGRESS",
        grade: undefined,
      });
    }).rejects.toEqual(new SubjectNotFound());
  });
});
