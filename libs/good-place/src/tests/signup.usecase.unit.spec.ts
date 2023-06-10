import {
  BadRequestError,
  UnauthorizedError,
} from '../application/usecases/user/signup.client.usecase';
import { Role } from '../domain/user';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('SignupUseCase', () => {
  let userFixture: UserFixture;

  beforeEach(() => {
    userFixture = createUserFixture();
  });

  describe('Rule: A new user can only signup as client or seller', () => {
    test('when alice signup as client, her account should be created with client role', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'CLIENT',
        password: 'password',
      });

      userFixture.thenUserAccountShouldExist(
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
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'SELLER',
        password: 'password',
      });

      userFixture.thenUserAccountShouldExist(
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
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'ADMIN',
        password: 'password',
      });

      userFixture.thenErrorShouldBe(UnauthorizedError);
      userFixture.thenUserShouldNotExist('test-id');
    });

    test('when alice signup as moderator, her account should not be created', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'MODERATOR',
        password: 'password',
      });

      userFixture.thenErrorShouldBe(UnauthorizedError);
      userFixture.thenUserShouldNotExist('test-id');
    });

    test('when alice signup as unknown role, her account should not be created', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@test.fr',
        role: 'unknown role' as any,
        password: 'password',
      });

      userFixture.thenErrorShouldBe(UnauthorizedError);
      userFixture.thenUserShouldNotExist('test-id');
    });
  });
  describe('Rule: Email must be unique', () => {
    test('Alice can not signup with same email multiple times', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      userFixture.givenUserExist([
        userBuilder().withEmail('alice@email.fr').build(),
      ]);

      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@email.fr',
        password: 'test-pass',
        role: 'CLIENT',
      });

      userFixture.thenErrorShouldBe(BadRequestError);
    });
  });
});
