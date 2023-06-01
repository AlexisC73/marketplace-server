import { PrismaClient } from '@prisma/client';
import { PrismaBookRepository } from '../infrastructure/prisma-book.repository';
import { bookBuilder } from './bookBuilder';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('PrismaBookRepository', () => {
  let prismaClient: PrismaClient;
  let postgresContainer: StartedPostgreSqlContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer()
      .withUsername('test-postgres')
      .withPassword('test-postgres')
      .withDatabase('goodplace_test')
      .withExposedPorts(5432)
      .start();

    const databaseUrl = `postgresql://test-postgres:test-postgres@${postgresContainer.getHost()}:${postgresContainer.getMappedPort(
      5432,
    )}/goodplace_test?schema=public`;

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    await execAsync(
      `set DATABASE_URL=${databaseUrl} && npx prisma migrate dev --name testing`,
    );

    return prismaClient.$connect();
  }, 30000);

  beforeEach(async () => {
    await prismaClient.book.deleteMany();
  }, 10000);

  afterAll(async () => {
    await prismaClient.$disconnect();
    await postgresContainer.stop({ timeout: 1000 });
  }, 10000);

  it('addBook() should ad a book to the database', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    await bookRepository.addBook(bookBuilder().withId('prisma-id').build());

    const books = await prismaClient.book.findMany();

    expect(books).toHaveLength(1);
    expect(books).toEqual(
      expect.arrayContaining([bookBuilder().withId('prisma-id').build()]),
    );
  });
});
