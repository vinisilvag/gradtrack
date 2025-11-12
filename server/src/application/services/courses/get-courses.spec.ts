import { GetCourses } from "./get-courses";

import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";

import { faker } from "@faker-js/faker";

describe("Get Courses", () => {
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let getCourses: GetCourses;

  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    getCourses = new GetCourses(inMemoryCoursesRepository);
  });

  it("should return an empty list of courses", async () => {
    const { courses } = await getCourses.execute();

    expect(courses).toBeTruthy();
    expect(courses).toHaveLength(0);
  });

  it("should return all registered courses", async () => {
    inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    const { courses } = await getCourses.execute();

    expect(courses).toBeTruthy();
    expect(courses).toHaveLength(3);
  });
});
