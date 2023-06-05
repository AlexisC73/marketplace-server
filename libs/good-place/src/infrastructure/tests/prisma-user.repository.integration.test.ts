import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { exec } from 'child_process';
import { promisify } from 'util';
import { PrismaUserRepository } from '../prisma-user.repository';
import { userBuilder } from '../../tests/userBuilder';

const execAsync = promisify(exec);

describe('PrismaUserRepository', () => {
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
    await prismaClient.user.deleteMany();
  }, 10000);

  afterAll(async () => {
    await prismaClient.$disconnect();
    await postgresContainer.stop({ timeout: 1000 });
  }, 10000);

  test('save() should save a user in db', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);

    const newUser = userBuilder().withId('test-id-1').build();

    await userRepository.save(newUser);

    const users = await prismaClient.user.findMany();

    expect(users).toHaveLength(1);
    expect(users).toEqual(expect.arrayContaining([newUser.data]));
  });

  test('getOneByEmail() should get user with his email', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);

    const newUser = userBuilder().withEmail('alice@est.fr').build();

    await prismaClient.user.create({
      data: {
        createdAt: newUser.createdAt,
        email: newUser.email,
        id: newUser.id,
        name: newUser.name,
        password: newUser.password,
        role: newUser.role,
      },
    });

    const fundUser = await userRepository.findOneByEmail(newUser.email);

    expect(fundUser).toEqual(newUser);
  });
});
