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
import { Book } from '@app/good-place/domain/entity/book';
import { PrismaUserRepository } from '@app/good-place/infrastructure/prisma-user.repository';
import { Role, User } from '@app/good-place/domain/user';

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

    await asyncExec(`set DATABASE_URL=${databaseUrl} && npx prisma db push`);

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
    const userRepository = new PrismaUserRepository(prismaClient);

    await userRepository.save(
      User.fromData({
        avatarUrl: 'dasds',
        createdAt: new Date(),
        email: 'test@test.fr',
        id: 'test-seller',
        name: 'jean',
        password: 'test-pass',
        role: Role.CLIENT,
      }),
    );

    await request(app.getHttpServer())
      .post('/book')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3Qtc2VsbGVyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuZnIiLCJuYW1lIjoiamVhbiIsInJvbGUiOiJDTElFTlQiLCJhdmF0YXJVcmwiOiJkZWZhdWx0LWF2YXRhci5wbmciLCJpYXQiOjE2ODYzMTc0NzYsImV4cCI6MTY4NjQwMzg3Nn0.N8hD-ObLFwYc5PC5-w_qUhcFHD6KDvvIGC8Bk32osTI',
      )
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
      sellerId: 'test-seller',
    });
  });

  it('/book (DELETE)', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);

    await userRepository.save(
      User.fromData({
        avatarUrl: 'dasds',
        createdAt: new Date(),
        email: 'test@test.fr',
        id: 'test-seller',
        name: 'jean',
        password: 'test-pass',
        role: Role.CLIENT,
      }),
    );

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
      data: {
        author: bookToDelete.author,
        createdAt: bookToDelete.createdAt,
        id: bookToDelete.id,
        description: bookToDelete.description,
        imageUrl: bookToDelete.imageUrl,
        price: bookToDelete.price,
        publicationDate: bookToDelete.publicationDate,
        published: bookToDelete.published,
        title: bookToDelete.title,
        seller: {
          connect: {
            id: bookToDelete.seller,
          },
        },
      },
    });

    await request(app.getHttpServer())
      .delete(`/book/${bookToDelete.id}`)
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InFqZWU3M2c5Mnh3bHNkMzNvZnhxdnA1dCIsImVtYWlsIjoiYWxleGlzQGljbG91ZC5jb20iLCJuYW1lIjoiYWxleGlzIiwicm9sZSI6IlNFTExFUiIsImF2YXRhclVybCI6IiIsImlhdCI6MTY4NjMxNjMzMCwiZXhwIjoxNjg2NDAyNzMwfQ.4PbkmZmGC85NpOPJI1cMpnI5KsElADp_YiG2wUT5BW4',
      )
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
