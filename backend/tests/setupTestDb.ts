// import { execSync } from 'child_process';
// import { PrismaClient } from '@prisma/client';

import { prisma } from "../src/prismaClient";

// Run migrations before tests

// const prisma = new PrismaClient();
// execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' });
// execSync('npx prisma migrate dev', { stdio: 'inherit' });

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
