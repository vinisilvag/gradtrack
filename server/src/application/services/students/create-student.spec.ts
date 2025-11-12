import { CreateStudent } from "./create-student";

import { InMemoryStudentsRepository } from "@tests/repositories/in-memory-students-repository";
import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";

import { faker } from "@faker-js/faker";
import { StudentAlreadyExists } from "@/application/errors/students/student-already-exists";
import { CourseNotFound } from "@/application/errors/courses/course-not-found";

describe("Create Student", () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository;
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let createStudent: CreateStudent;

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    createStudent = new CreateStudent(
      inMemoryStudentsRepository,
      inMemoryCoursesRepository,
    );
  });

  it("should create a new student", async () => {
    const course = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    const { student } = await createStudent.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: course.id,
    });

    expect(student).toBeTruthy();
  });

  it("should throw an error when creating a student with an existing email", async () => {
    const course = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    const sharedEmail = faker.internet.email();

    inMemoryStudentsRepository.create({
      name: faker.person.fullName(),
      email: sharedEmail,
      courseId: course.id,
    });

    expect(async () => {
      await createStudent.execute({
        name: faker.person.fullName(),
        email: sharedEmail,
        courseId: course.id,
      });
    }).rejects.toEqual(new StudentAlreadyExists());
  });

  it("should throw an error when creating a student with an invalid or non-existent course ID", async () => {
    expect(async () => {
      await createStudent.execute({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        courseId: faker.string.uuid(),
      });
    }).rejects.toEqual(new CourseNotFound());
  });
});
