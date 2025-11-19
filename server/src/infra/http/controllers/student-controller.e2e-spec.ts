/**
 * @jest-environment ./prisma/prisma-environment-jest.cjs
 */

import request from "supertest";

import { app } from "@/app";

import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";

describe("[e2e] Student Controller", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  it("should be able to create a student", async () => {
    const course = await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    const studentData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: course.id,
    };

    const response = await request(app).post("/api/students").send(studentData);

    expect(response.statusCode).toBe(201);
    expect(response.body.student).toBeTruthy();
    expect(response.body.student).toHaveProperty("email", studentData.email);
  });

  it("should return all registered students", async () => {
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

    const response = await request(app).get("/api/students");

    expect(response.statusCode).toBe(200);
    expect(response.body.students).toBeTruthy();
    expect(response.body.students).toHaveLength(3);
  });

  it("should delete an existing student", async () => {
    const course = await prisma.course.create({
      data: {
        name: faker.word.words(2),
        totalHours: faker.number.int({ min: 2600, max: 3600 }),
      },
    });

    const student = await prisma.student.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        courseId: course.id,
      },
    });

    const response = await request(app).delete(`/api/students/${student.id}`);

    expect(response.statusCode).toBe(204);
  });
});
