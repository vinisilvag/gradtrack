/**
 * @jest-environment ./prisma/prisma-environment-jest.cjs
 */

import request from "supertest";

import { app } from "@/app";

import { faker } from "@faker-js/faker";

describe("[e2e] Student Controller", () => {
  it("should be able to create a student", async () => {
    const response = await request(app).post("/api/students").send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      courseId: faker.string.uuid(),
    });
  });

  // it("", async () => {});

  // it("", async () => {});
});
