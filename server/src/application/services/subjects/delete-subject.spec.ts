import { DeleteSubject } from "./delete-subject";

import { InMemorySubjectsRepository } from "@tests/repositories/in-memory-subjects-repository";

import { faker } from "@faker-js/faker";

import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";

describe("Delete Subject", () => {
  let inMemorySubjectsRepository: InMemorySubjectsRepository;
  let deleteSubject: DeleteSubject;

  beforeEach(() => {
    inMemorySubjectsRepository = new InMemorySubjectsRepository();
    deleteSubject = new DeleteSubject(inMemorySubjectsRepository);
  });

  it("should delete an existing subject", async () => {
    const createdSubject = await inMemorySubjectsRepository.create({
      code: faker.string.alphanumeric(6),
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    await deleteSubject.execute({
      subjectId: createdSubject.id,
    });

    expect(inMemorySubjectsRepository.subjects).toHaveLength(0);
    expect(inMemorySubjectsRepository.subjects).not.toContain(createdSubject);
  });

  it("should throw an error when deleting a subject that does not exists", async () => {
    expect(async () => {
      await deleteSubject.execute({
        subjectId: faker.string.uuid(),
      });
    }).rejects.toEqual(new SubjectNotFound());
  });
});
