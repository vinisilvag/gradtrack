require('dotenv').config();

const { randomUUID } = require('crypto');
const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { execSync } = require("child_process");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function generateDatabaseURL(schema) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);
  return url.toString();
}

const prismaCli = "./node_modules/.bin/prisma";

class CustomEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    this.schema = `test_schema_${randomUUID()}`;
    this.connectionSchema = generateDatabaseURL(this.schema);
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionSchema;
    this.global.process.env.DATABASE_URL = this.connectionSchema;

    process.env.NODE_ENV = 'test';
    this.global.process.env.NODE_ENV = 'test';

    execSync(`${prismaCli} migrate dev`);

    // seed
  }

  async teardown() {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`
    )
    await prisma.$disconnect()
  }
}

module.exports = CustomEnvironment;