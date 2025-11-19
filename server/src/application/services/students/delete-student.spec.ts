import { DeleteStudent } from "./delete-student";

import { InMemoryStudentsRepository } from "@tests/repositories/in-memory-students-repository";

import { faker } from "@faker-js/faker";

import { StudentNotFound } from "@/application/errors/students/student-not-found";

describe("Delete Student", () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository;
  let deleteStudent: DeleteStudent;

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    deleteStudent = new DeleteStudent(inMemoryStudentsRepository);
  });

  it("should delete an existing student", async () => {
    const createdStudent = await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });

    await deleteStudent.execute({
      studentId: createdStudent.id,
    });

    expect(inMemoryStudentsRepository.students).toHaveLength(0);
    expect(inMemoryStudentsRepository.students).not.toContain(createdStudent);
  });

  it("should throw an error when deleting a student that does not exists", async () => {
    expect(async () => {
      await deleteStudent.execute({
        studentId: faker.string.uuid(),
      });
    }).rejects.toEqual(new StudentNotFound());
  });
});
