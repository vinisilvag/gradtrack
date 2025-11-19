import { GetSubjects } from "./get-subjects";

import { InMemorySubjectsRepository } from "@tests/repositories/in-memory-subjects-repository";

import { faker } from "@faker-js/faker";

describe("Get Students", () => {
  let inMemorySubjectsRepository: InMemorySubjectsRepository;
  let getSubjects: GetSubjects;

  beforeEach(() => {
    inMemorySubjectsRepository = new InMemorySubjectsRepository();
    getSubjects = new GetSubjects(inMemorySubjectsRepository);
  });

  it("should return an empty list of subjects", async () => {
    const { subjects } = await getSubjects.execute();

    expect(subjects).toBeTruthy();
    expect(subjects).toHaveLength(0);
  });

  it("should return all registered subjects", async () => {
    inMemorySubjectsRepository.create({
      code: faker.string.alphanumeric(6),
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    inMemorySubjectsRepository.create({
      code: faker.string.alphanumeric(6),
      name: faker.person.fullName(),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "OPTIONAL",
    });

    const { subjects } = await getSubjects.execute();

    expect(subjects).toBeTruthy();
    expect(subjects).toHaveLength(2);
  });
});
