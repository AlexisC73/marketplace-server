import {
  SignupUseCase,
  SignupUserCommand,
  UnauthorizedError,
} from '../application/usecases/signup.client.usecase';
import { Role, User } from '../domain/user';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';
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
});

const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const userRepository = new InMemoryUserRepository();
  const signupUseCase = new SignupUseCase(userRepository, dateProvider);
  let thrownError: Error;

  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
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
      expect(expectedUser.data).toEqual(fundUser);
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
