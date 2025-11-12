import { GetStudents } from "./get-students";

import { InMemoryStudentsRepository } from "@tests/repositories/in-memory-students-repository";

import { faker } from "@faker-js/faker";

describe("Get Students", () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository;
  let getStudents: GetStudents;

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    getStudents = new GetStudents(inMemoryStudentsRepository);
  });

  it("should return an empty list of students", async () => {
    const { students } = await getStudents.execute();

    expect(students).toBeTruthy();
    expect(students).toHaveLength(0);
  });

  it("should return all registered students", async () => {
    inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });

    inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });

    const { students } = await getStudents.execute();

    expect(students).toBeTruthy();
    expect(students).toHaveLength(2);
  });
});
