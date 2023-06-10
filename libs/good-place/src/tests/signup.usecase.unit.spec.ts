import {
  BadRequestError,
  SignupUseCase,
  SignupUserCommand,
  UnauthorizedError,
} from '../application/usecases/user/signup.client.usecase';
import { Role, User } from '../domain/user';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';
import { StubHashService } from '../infrastructure/stub-hash.service';
import { userBuilder } from './userBuilder';

describe('SignupUseCase', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: A new user can only signup as client or seller', () => {
    test('when alice signup as client, her account should be created with client role', async () => {
      fixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await fixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'CLIENT',
        password: 'password',
      });

      fixture.thenUserAccountShouldExist(
        userBuilder()
          .withId('test-id')
          .withName('Alice')
          .withEmail('alice@test.fr')
          .withPassword('password')
          .withRole(Role.CLIENT)
          .withCreatedAt(new Date('2023-06-02T12:00:00Z'))
          .build(),
      );
    });

    test('when alice signup as seller, her account should be created with seller role', async () => {
      fixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      await fixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'SELLER',
        password: 'password',
      });

      fixture.thenUserAccountShouldExist(
        userBuilder()
          .withId('test-id')
          .withName('Alice')
          .withEmail('alice@test.fr')
          .withPassword('password')
          .withRole(Role.SELLER)
          .withCreatedAt(new Date('2023-06-02T12:00:00Z'))
          .build(),
      );
    });

    test('when alice signup as admin, her account should not be created', async () => {
      fixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await fixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'ADMIN',
        password: 'password',
      });

      fixture.thenErrorShouldBe(UnauthorizedError);
      fixture.thenUserShouldNotExist('test-id');
    });

    test('when alice signup as moderator, her account should not be created', async () => {
      fixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await fixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'MODERATOR',
        password: 'password',
      });

      fixture.thenErrorShouldBe(UnauthorizedError);
      fixture.thenUserShouldNotExist('test-id');
    });

    test('when alice signup as unknown role, her account should not be created', async () => {
      fixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await fixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'unknown role' as any,
        password: 'password',
      });

      fixture.thenErrorShouldBe(UnauthorizedError);
      fixture.thenUserShouldNotExist('test-id');
    });
  });
  describe('Rule: Email must be unique', () => {
    test('Alice can not signup with same email multiple times', async () => {
      fixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      fixture.givenUserExist([
        userBuilder().withEmail('alice@email.fr').build(),
      ]);

      await fixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@email.fr',
        password: 'test-pass',
        role: 'CLIENT',
      });

      fixture.thenErrorShouldBe(BadRequestError);
    });
  });
});

const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const userRepository = new InMemoryUserRepository();
  const hashService = new StubHashService();
  const signupUseCase = new SignupUseCase(
    userRepository,
    dateProvider,
    hashService,
  );
  let thrownError: Error;

  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
    },
    givenUserExist: (users: User[]) => {
      users.map((u) => userRepository.save(u));
    },
    whenNewUserSignup: async (signupUserCommand: SignupUserCommand) => {
      try {
        await signupUseCase.handle(signupUserCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    thenUserAccountShouldExist: (expectedUser: User) => {
      const fundUser = userRepository.users.find(
        (u) => u.id === expectedUser.id,
      );

      expect(fundUser).toEqual(expectedUser.data);
    },
    thenErrorShouldBe: (expectedError: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
    thenUserShouldNotExist: (id: string) => {
      const fundUser = userRepository.users.find((u) => u.id === id);
      expect(fundUser).toBeUndefined();
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
