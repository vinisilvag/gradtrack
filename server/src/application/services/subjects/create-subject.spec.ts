import { CreateSubject } from "./create-subject";

import { InMemorySubjectsRepository } from "@tests/repositories/in-memory-subjects-repository";

import { faker } from "@faker-js/faker";

import { SubjectAlreadyExists } from "@/application/errors/subjects/subject-already-exists";

describe("Create Subject", () => {
  let inMemorySubjectsRepository: InMemorySubjectsRepository;
  let createSubject: CreateSubject;

  beforeEach(() => {
    inMemorySubjectsRepository = new InMemorySubjectsRepository();
    createSubject = new CreateSubject(inMemorySubjectsRepository);
  });

  it("should create a new subject", async () => {
    const code = faker.string.alphanumeric(6);

    const { subject } = await createSubject.execute({
      code,
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    expect(subject).toBeTruthy();
    expect(subject).toHaveProperty("id");
    expect(subject).toHaveProperty("code", code);
  });

  it("should throw an error when creating a subject with an existing code", async () => {
    const sharedCode = "sample-code";

    await inMemorySubjectsRepository.create({
      code: sharedCode,
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    expect(async () => {
      await createSubject.execute({
        code: sharedCode,
        name: faker.word.words(3),
        hours: faker.number.int({ min: 30, max: 120 }),
        category: "MANDATORY",
      });
    }).rejects.toEqual(new SubjectAlreadyExists());
  });
});
