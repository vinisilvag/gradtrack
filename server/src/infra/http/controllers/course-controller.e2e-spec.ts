/**
 * @jest-environment ./prisma/prisma-environment-jest.cjs
 */

import request from "supertest";

import { app } from "@/app";

import { faker } from "@faker-js/faker";

import { PrismaClient } from "@prisma/client";

describe("[e2e] Course Controller", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  it("should return all registered courses", async () => {
    await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    const response = await request(app).get("/api/courses");

    expect(response.statusCode).toBe(200);
    expect(response.body.courses).toBeTruthy();
    expect(response.body.courses).toHaveLength(2);
  });

  it("should be able to create a course", async () => {
    const courseData = {
      name: faker.word.words(2),
      totalHours: faker.number.int({ min: 2600, max: 3600 }),
    };

    const response = await request(app).post("/api/courses").send(courseData);

    expect(response.statusCode).toBe(201);
    expect(response.body.course).toBeTruthy();
    expect(response.body.course).toHaveProperty("id");
  });

  it("should return all registered students on some course", async () => {
    const course = await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    await prisma.student.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        courseId: course.id,
      },
    });

    await prisma.student.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        courseId: course.id,
      },
    });

    const response = await request(app).get(
      `/api/courses/${course.id}/students`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.students).toBeTruthy();
    expect(response.body.students).toHaveLength(2);
  });

  it("should be able to delete an existing course", async () => {
    const course = await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    const response = await request(app).delete(`/api/courses/${course.id}`);

    expect(response.statusCode).toBe(204);
  });

  it("should attach a subject to a course", async () => {
    const course = await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    const subject = await prisma.subject.create({
      data: {
        code: faker.string.alphanumeric(6),
        name: faker.word.words(3),
        hours: faker.number.int({ min: 30, max: 120 }),
        category: "MANDATORY",
      },
    });

    const response = await request(app)
      .patch("/api/courses/subject/attach")
      .send({
        courseId: course.id,
        subjectId: subject.id,
        semester: faker.number.int({ min: 1, max: 10 }),
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.course).toBeTruthy();
    expect(response.body.subject).toBeTruthy();
    expect(response.body.semester).toBeTruthy();
  });

  it("should detach a subject from a course", async () => {
    const course = await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    const subject = await prisma.subject.create({
      data: {
        code: faker.string.alphanumeric(6),
        name: faker.word.words(3),
        hours: faker.number.int({ min: 30, max: 120 }),
        category: "MANDATORY",
      },
    });

    await prisma.courseSubject.create({
      data: {
        courseId: course.id,
        subjectId: subject.id,
        semester: faker.number.int({ min: 1, max: 10 }),
      },
    });

    const response = await request(app)
      .patch("/api/courses/subject/detach")
      .send({ courseId: course.id, subjectId: subject.id });

    expect(response.statusCode).toBe(204);
  });
});
