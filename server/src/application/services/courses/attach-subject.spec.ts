import { AttachSubject } from "./attach-subject";

import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";
import { InMemorySubjectsRepository } from "@tests/repositories/in-memory-subjects-repository";
import { InMemoryCourseSubjectsRepository } from "@tests/repositories/in-memory-course-subjects-repository";

import { faker } from "@faker-js/faker";
import { CourseNotFound } from "@/application/errors/courses/course-not-found";
import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";
import { CourseSubjectAlreadyExists } from "@/application/errors/course-subjects/course-subject-already-exists";

describe("Attach Subject", () => {
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let inMemorySubjectsRepository: InMemorySubjectsRepository;
  let inMemoryCourseSubjectsRepository: InMemoryCourseSubjectsRepository;
  let attachSubject: AttachSubject;

  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemorySubjectsRepository = new InMemorySubjectsRepository();
    inMemoryCourseSubjectsRepository = new InMemoryCourseSubjectsRepository();
    attachSubject = new AttachSubject(
      inMemoryCoursesRepository,
      inMemorySubjectsRepository,
      inMemoryCourseSubjectsRepository,
    );
  });

  it("should attach a subject to a course successfully", async () => {
    const course = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    const subject = await inMemorySubjectsRepository.create({
      code: faker.string.alphanumeric(6),
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    const attachment = await attachSubject.execute({
      courseId: course.id,
      subjectId: subject.id,
      semester: faker.number.int({ min: 1, max: 10 }),
    });

    expect(attachment).toBeTruthy();
    expect(attachment).toHaveProperty("course");
    expect(attachment).toHaveProperty("subject");
    expect(attachment).toHaveProperty("semester");
  });

  it("should throw an error when course does not exist", async () => {
    const subject = await inMemorySubjectsRepository.create({
      code: faker.string.alphanumeric(6),
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    expect(async () => {
      await attachSubject.execute({
        courseId: faker.string.uuid(),
        subjectId: subject.id,
        semester: faker.number.int({ min: 1, max: 10 }),
      });
    }).rejects.toEqual(new CourseNotFound());
  });

  it("should throw an error when subject does not exist", async () => {
    const course = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    expect(async () => {
      await attachSubject.execute({
        courseId: course.id,
        subjectId: faker.string.uuid(),
        semester: faker.number.int({ min: 1, max: 10 }),
      });
    }).rejects.toEqual(new SubjectNotFound());
  });

  it("should throw an error when vinculation already exists", async () => {
    const course = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    const subject = await inMemorySubjectsRepository.create({
      code: faker.string.alphanumeric(6),
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    });

    await inMemoryCourseSubjectsRepository.create({
      courseId: course.id,
      subjectId: subject.id,
      semester: faker.number.int({ min: 1, max: 10 }),
    });

    expect(async () => {
      await attachSubject.execute({
        courseId: course.id,
        subjectId: subject.id,
        semester: faker.number.int({ min: 1, max: 10 }),
      });
    }).rejects.toEqual(new CourseSubjectAlreadyExists());
  });
});
