import { GetStudentReport } from "./get-student-report";

import { InMemoryStudentsRepository } from "@tests/repositories/in-memory-students-repository";

import { faker } from "@faker-js/faker";

import { StudentNotFound } from "@/application/errors/students/student-not-found";

describe("Get Student Report", () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository;
  let getStudentReport: GetStudentReport;

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    getStudentReport = new GetStudentReport(inMemoryStudentsRepository);
  });

  it("should fail to get the report for an invalid/non-existing student", async () => {
    expect(async () => {
      await getStudentReport.execute({
        studentId: faker.string.uuid(),
      });
    }).rejects.toEqual(new StudentNotFound());
  });
});
