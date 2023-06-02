import { DateProvider } from '@app/good-place/application/date.provider';
import { StubDateProvider } from '@app/good-place/infrastructure/stub-date.provider';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import * as request from 'supertest';
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from 'testcontainers';
import { promisify } from 'util';
import { AppModule } from '../src/app.module';
import { PrismaBookRepository } from '@app/good-place/infrastructure/prisma-book.repository';
import { Book } from '@app/good-place/domain/book';

const asyncExec = promisify(exec);

describe('test e2e', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  let app: INestApplication;

  const now = new Date('2023-06-01T13:00:00Z');
  const dateProvider = new StubDateProvider();
  dateProvider.now = now;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('test-db')
      .withUsername('test-user')
      .withPassword('test-pass')
      .withExposedPorts(5432)
      .start();

    const databaseUrl = `postgresql://test-user:test-pass@${container.getHost()}:${container.getMappedPort(
      5432,
    )}/test-db?schema=public`;

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    await asyncExec(
      `set DATABASE_URL=${databaseUrl} && npx prisma migrate deploy`,
    );

    return prismaClient.$connect();
  }, 20000);

  afterAll(async () => {
    await prismaClient.$disconnect();
    await container.stop({ timeout: 1000 });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DateProvider)
      .useValue(dateProvider)
      .overrideProvider(PrismaClient)
      .useValue(prismaClient)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await prismaClient.book.deleteMany();
    await prismaClient.$executeRawUnsafe('DELETE FROM "User" CASCADE');
  });

  it('/book (POST)', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    await request(app.getHttpServer())
      .post('/book')
      .send({
        title: 'test-title',
        author: 'test-author',
        description: 'test-description',
        publicationDate: '2023-06-01T13:00:00Z',
        price: 1000,
      })
      .expect(201);

    const newBook = await prismaClient.book.findFirst({
      where: {
        title: 'test-title',
      },
    });

    expect(newBook).toMatchObject({
      id: expect.any(String),
      title: 'test-title',
      author: 'test-author',
      description: 'test-description',
      publicationDate: new Date('2023-06-01T13:00:00Z'),
      price: 1000,
      imageUrl: expect.any(String),
      published: false,
      seller: expect.any(String),
    });
  });

  it('/book (DELETE)', async () => {
    const bookRepository = new PrismaBookRepository(prismaClient);

    const bookToDelete = Book.fromData({
      createdAt: now,
      id: 'test-id',
      author: 'test-author',
      description: 'test-description',
      imageUrl: 'test-image-url',
      price: 1000,
      publicationDate: new Date('2023-06-01T13:00:00Z'),
      published: false,
      seller: 'test-seller',
      title: 'test-title',
    });

    await prismaClient.book.create({
      data: bookToDelete.data,
    });

    console.log(`/book/${bookToDelete.id}`);

    await request(app.getHttpServer())
      .delete(`/book/${bookToDelete.id}`)
      .send()
      .expect(200);

    const deletedBook = await prismaClient.book.findUnique({
      where: {
        id: bookToDelete.id,
      },
    });

    expect(deletedBook).toBeNull();
  });
});
