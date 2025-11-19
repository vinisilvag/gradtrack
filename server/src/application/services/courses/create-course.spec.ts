import { CreateCourse } from "./create-course";

import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";

import { faker } from "@faker-js/faker";

import { CourseAlreadyExists } from "@/application/errors/courses/course-already-exists";

describe("Create Course", () => {
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let createCourse: CreateCourse;

  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    createCourse = new CreateCourse(inMemoryCoursesRepository);
  });

  it("should create a new course", async () => {
    const courseName = faker.word.words(2);

    const { course } = await createCourse.execute({
      name: courseName,
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    expect(course).toBeTruthy();
    expect(course).toHaveProperty("id");
    expect(course).toHaveProperty("name", courseName);
  });

  it("should throw an error when creating a course with an existing name", async () => {
    const sharedName = "sample-name";

    await inMemoryCoursesRepository.create({
      name: sharedName,
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    expect(async () => {
      await createCourse.execute({
        name: sharedName,
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      });
    }).rejects.toEqual(new CourseAlreadyExists());
  });
});
