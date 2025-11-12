import { GetCourseStudents } from "./get-course-students";

import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";
import { InMemoryStudentsRepository } from "@tests/repositories/in-memory-students-repository";

import { CourseNotFound } from "@/application/errors/courses/course-not-found";

import { faker } from "@faker-js/faker";

describe("Get Course Students", () => {
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let inMemoryStudentsRepository: InMemoryStudentsRepository;
  let getCourseStudents: GetCourseStudents;

  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    getCourseStudents = new GetCourseStudents(
      inMemoryCoursesRepository,
      inMemoryStudentsRepository,
    );
  });

  it("should return an empty list when the course has no enrolled students", async () => {
    const course = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 2600 }),
    });

    const { students } = await getCourseStudents.execute({
      courseId: course.id,
    });

    expect(students).toBeTruthy();
    expect(students).toHaveLength(0);
  });

  it("should return all enrolled students for a course", async () => {
    const course1 = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 2600 }),
    });

    const course2 = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 2600 }),
    });

    await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: course1.id,
    });

    await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: course2.id,
    });

    await inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: course2.id,
    });

    const { students } = await getCourseStudents.execute({
      courseId: course2.id,
    });

    expect(students).toBeTruthy();
    expect(students).toHaveLength(2);
  });

  it("should throw an error when listing list students for an invalid/non-existent course", async () => {
    expect(async () => {
      await getCourseStudents.execute({ courseId: faker.string.uuid() });
    }).rejects.toEqual(new CourseNotFound());
  });
});
