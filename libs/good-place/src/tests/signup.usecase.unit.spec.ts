import {
  BadRequestError,
  UnauthorizedError,
} from '../application/usecases/error/error';
import { Role } from '../domain/entity/user';
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
      });

      userFixture.thenErrorShouldBe(BadRequestError);
    });

    test('Alice can not signup with same email multiple times, even if existing account is seller account', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      userFixture.givenUserExist([
        userBuilder().withRole(Role.SELLER).withEmail('alice@email.fr').build(),
      ]);

      await userFixture.whenNewUserSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@email.fr',
        password: 'test-pass',
      });

      userFixture.thenErrorShouldBe(BadRequestError);
    });
  });
});
