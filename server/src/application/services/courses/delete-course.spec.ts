import { DeleteCourse } from "./delete-course";

import { InMemoryCoursesRepository } from "@tests/repositories/in-memory-courses-repository";

import { faker } from "@faker-js/faker";

import { CourseNotFound } from "@/application/errors/courses/course-not-found";

describe("Delete Course", () => {
  let inMemoryCoursesRepository: InMemoryCoursesRepository;
  let deleteCourse: DeleteCourse;

  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    deleteCourse = new DeleteCourse(inMemoryCoursesRepository);
  });

  it("should delete an existing course", async () => {
    const createdCourse = await inMemoryCoursesRepository.create({
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    });

    await deleteCourse.execute({
      courseId: createdCourse.id,
    });

    expect(inMemoryCoursesRepository.courses).toHaveLength(0);
    expect(inMemoryCoursesRepository.courses).not.toContain(createdCourse);
  });

  it("should throw an error when deleting a course that does not exists", async () => {
    expect(async () => {
      await deleteCourse.execute({
        courseId: faker.string.uuid(),
      });
    }).rejects.toEqual(new CourseNotFound());
  });
});
