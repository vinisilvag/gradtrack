import { DetachSubject } from "./detach-subject";

import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";
import { InMemorySubjectsRepository } from "@tests/repositories/in-memory-subjects-repository";
import { InMemoryCourseSubjectsRepository } from "@tests/repositories/in-memory-course-subjects-repository";

import { faker } from "@faker-js/faker";

import { CourseNotFound } from "@/application/errors/courses/course-not-found";
import { SubjectNotFound } from "@/application/errors/subjects/subject-not-found";
import { CourseSubjectNotFound } from "@/application/errors/course-subjects/course-subject-not-found";

describe("Detach Subject", () => {
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let inMemorySubjectsRepository: InMemorySubjectsRepository;
  let inMemoryCourseSubjectsRepository: InMemoryCourseSubjectsRepository;
  let detachSubject: DetachSubject;

  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemorySubjectsRepository = new InMemorySubjectsRepository();
    inMemoryCourseSubjectsRepository = new InMemoryCourseSubjectsRepository();
    detachSubject = new DetachSubject(
      inMemoryCoursesRepository,
      inMemorySubjectsRepository,
      inMemoryCourseSubjectsRepository,
    );
  });

  it("should delete an existing course-subject attachment", async () => {
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

    const attachment = await inMemoryCourseSubjectsRepository.create({
      courseId: course.id,
      subjectId: subject.id,
      semester: faker.number.int({ min: 1, max: 10 }),
    });

    await detachSubject.execute({
      courseId: course.id,
      subjectId: subject.id,
    });

    expect(inMemoryCourseSubjectsRepository.courseSubjects).toHaveLength(0);
    expect(inMemoryCourseSubjectsRepository.courseSubjects).not.toContain(
      attachment,
    );
  });

  it("should throw an error when deleting with a course that does not exists", async () => {
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
      await detachSubject.execute({
        courseId: "sample-id",
        subjectId: subject.id,
      });
    }).rejects.toEqual(new CourseNotFound());
  });

  it("should throw an error when deleting with a subject that does not exists", async () => {
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
      await detachSubject.execute({
        courseId: course.id,
        subjectId: "sample-id",
      });
    }).rejects.toEqual(new SubjectNotFound());
  });

  it("should throw an error when deleting an attachment that does not exists", async () => {
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

    expect(async () => {
      await detachSubject.execute({
        courseId: course.id,
        subjectId: subject.id,
      });
    }).rejects.toEqual(new CourseSubjectNotFound());
  });
});
