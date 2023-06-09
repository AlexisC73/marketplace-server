import { PrismaClient } from '@prisma/client';
import { PrismaBookRepository } from '../prisma-book.repository';
import { bookBuilder } from '../../tests/bookBuilder';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { exec } from 'child_process';
import { promisify } from 'util';
import { Book, BookStatus } from '../../domain/entity/book';

const execAsync = promisify(exec);

describe('PrismaBookRepository', () => {
  let prismaClient: PrismaClient;
  let postgresContainer: StartedPostgreSqlContainer;

  let userId: string;

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

    await execAsync(`set DATABASE_URL=${databaseUrl} && npx prisma db push`);

    return prismaClient.$connect();
  }, 30000);

  beforeEach(async () => {
    await prismaClient.book.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.user.create({
      data: {
        id: 'user-id',
        email: 'test@email.fr',
        password: 'password',
        createdAt: new Date(),
        name: 'test',
        avatarUrl: 'test',
      },
    });
    userId = 'user-id';
  }, 10000);

  afterAll(async () => {
    await prismaClient.$disconnect();
    await postgresContainer.stop({ timeout: 1000 });
  }, 10000);

  it('addBook() should add a book to the database', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    const bookToSave = bookBuilder()
      .withId('prisma-id')
      .withSeller(userId)
      .build();

    await bookRepository.addBook(bookToSave);

    const books = (await prismaClient.book.findMany()).map((book) =>
      Book.fromData({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.imageUrl,
        publicationDate: book.publicationDate,
        description: book.description,
        status: BookStatus[book.status],
        seller: book.sellerId,
        createdAt: book.createdAt,
      }),
    );

    expect(books).toHaveLength(1);
    expect(books).toEqual(expect.arrayContaining([bookToSave]));
  });

  it('deleteBook() should delete book in the database', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    const publishedBooks = [
      bookBuilder()
        .withStatus(BookStatus.FOR_SALE)
        .withSeller(userId)
        .withId('1')
        .build(),
      bookBuilder()
        .withStatus(BookStatus.FOR_SALE)
        .withSeller(userId)
        .withId('2')
        .build(),
    ];

    const notPublishedBooks = [
      bookBuilder()
        .withStatus(BookStatus.PENDING_VALIDATION)
        .withSeller(userId)
        .withId('3')
        .build(),
      bookBuilder()
        .withStatus(BookStatus.PENDING_VALIDATION)
        .withSeller(userId)
        .withId('4')
        .build(),
    ];

    const allBooks = [...publishedBooks, ...notPublishedBooks];

    await Promise.all(
      allBooks.map(
        async (book) =>
          await prismaClient.book.create({
            data: {
              id: book.id,
              title: book.title,
              author: book.author,
              price: book.price,
              imageUrl: book.imageUrl,
              publicationDate: book.publicationDate,
              description: book.description,
              status: book.status,
              seller: {
                connect: {
                  id: book.seller,
                },
              },
              createdAt: book.createdAt,
            },
          }),
      ),
    );

    const books = await bookRepository.getForSaleBooks();

    expect(books).toEqual(expect.arrayContaining(publishedBooks));
    expect(books).toHaveLength(publishedBooks.length);
  });

  describe('getBookById()', () => {
    it('getBookById() should get a book in db', async () => {
      const bookRepository = new PrismaBookRepository(prismaClient);

      const book = bookBuilder().withId('prisma-id').withSeller(userId).build();

      await prismaClient.book.create({
        data: {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          imageUrl: book.imageUrl,
          publicationDate: book.publicationDate,
          description: book.description,
          status: book.status,
          seller: {
            connect: {
              id: book.seller,
            },
          },
          createdAt: book.createdAt,
        },
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

  it('getPublishedBooks() should get books if published in db', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    const book = bookBuilder()
      .withId('prisma-id')
      .withSeller(userId)
      .withStatus(BookStatus.FOR_SALE)
      .build();

    await prismaClient.book.create({
      data: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.imageUrl,
        publicationDate: book.publicationDate,
        description: book.description,
        status: book.status,
        seller: {
          connect: {
            id: book.seller,
          },
        },
        createdAt: book.createdAt,
      },
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
