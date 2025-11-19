/**
 * @jest-environment ./prisma/prisma-environment-jest.cjs
 */

import request from "supertest";

import { app } from "@/app";

import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";

describe("[e2e] Subject Controller", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  it("should be able to create a subject", async () => {
    const subjectData = {
      code: faker.string.alphanumeric(6),
      name: faker.word.words(3),
      hours: faker.number.int({ min: 30, max: 120 }),
      category: "MANDATORY",
    };

    const response = await request(app).post("/api/subjects").send(subjectData);

    expect(response.statusCode).toBe(201);
    expect(response.body.subject).toBeTruthy();
    expect(response.body.subject).toHaveProperty("code");
  });

  it("should return all registered subjects", async () => {
    await prisma.subject.create({
      data: {
        code: faker.string.alphanumeric(6),
        name: faker.word.words(3),
        hours: faker.number.int({ min: 30, max: 120 }),
        category: "MANDATORY",
      },
    });

    await prisma.subject.create({
      data: {
        code: faker.string.alphanumeric(6),
        name: faker.word.words(3),
        hours: faker.number.int({ min: 30, max: 120 }),
        category: "OPTIONAL",
      },
    });

    const response = await request(app).get("/api/subjects");

    expect(response.statusCode).toBe(200);
    expect(response.body.subjects).toBeTruthy();
    expect(response.body.subjects).toHaveLength(3);
  });

  // it("should delete an existing subject", async () => {
  //   const subject = await prisma.subject.create({
  //     data: {
  //       code: faker.string.alphanumeric(6),
  //       name: faker.word.words(3),
  //       hours: faker.number.int({ min: 30, max: 120 }),
  //       category: "MANDATORY",
  //     },
  //   });

  //   const response = await request(app).delete(`/api/subjects/${subject.id}`);

  //   expect(response.statusCode).toBe(204);
  // });
});
