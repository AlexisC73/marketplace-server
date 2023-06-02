import { PrismaClient } from '@prisma/client';
import { PrismaBookRepository } from '../prisma-book.repository';
import { bookBuilder } from '../../tests/bookBuilder';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { exec } from 'child_process';
import { promisify } from 'util';
import { Book } from '../../domain/book';

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
      `set DATABASE_URL=${databaseUrl} && npx prisma migrate dev`,
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

  it('addBook() should add a book to the database', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    await bookRepository.addBook(bookBuilder().withId('prisma-id').build());

    const books = await prismaClient.book.findMany();

    expect(books).toHaveLength(1);
    expect(books).toEqual(
      expect.arrayContaining([bookBuilder().withId('prisma-id').build().data]),
    );
  });

  it('deleteBook() should delete book in the database', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    await prismaClient.book.create({
      data: bookBuilder().withId('prisma-id').build().data,
    });

    await bookRepository.deleteBookById('prisma-id');

    const searchBook = await prismaClient.book.findUnique({
      where: {
        id: 'prisma-id',
      },
    });

    expect(searchBook).toBeNull();
  });

  describe('getBookById()', () => {
    it('getBookById() should get a book in db', async () => {
      const bookRepository = new PrismaBookRepository(prismaClient);

      const book = bookBuilder().withId('prisma-id').build();

      await prismaClient.book.create({
        data: book.data,
      });

      const fundBook = await bookRepository.getBookById('prisma-id');

      expect(fundBook).toEqual(book);
    });

    it('getBookById() should return undefined if book not found', async () => {
      const bookRepository = new PrismaBookRepository(prismaClient);

      const fundBook = await bookRepository.getBookById('prisma-id');

      expect(fundBook).toBeUndefined();
    });
  });
});
