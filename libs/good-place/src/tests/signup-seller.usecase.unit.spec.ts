import { BadRequestError } from '../application/usecases/error/error';
import { Role } from '../domain/user';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('SignupSellerUseCase', () => {
  let userFixture: UserFixture;

  beforeEach(() => {
    userFixture = createUserFixture();
  });

  describe('Rule: when seller signup should have seller role', () => {
    test('when alice signup as SELLER, her account should be created with SELLER role', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));

      await userFixture.whenNewSellerSignup({
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
          .withRole(Role.SELLER)
          .withCreatedAt(new Date('2023-06-02T12:00:00Z'))
          .build(),
      );
    });
  });

  describe('Rule: Email must be unique', () => {
    test('Alice can not signup with same email multiple times, even if the email is used for a client account', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      userFixture.givenUserExist([
        userBuilder().withRole(Role.CLIENT).withEmail('alice@email.fr').build(),
      ]);

      await userFixture.whenNewSellerSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@email.fr',
        password: 'test-pass',
      });

      userFixture.thenErrorShouldBe(BadRequestError);
    });
    test('Alice can not signup with same email multiple times', async () => {
      userFixture.givenNowIs(new Date('2023-06-02T12:00:00Z'));
      userFixture.givenUserExist([
        userBuilder().withRole(Role.SELLER).withEmail('alice@email.fr').build(),
      ]);

      await userFixture.whenNewSellerSignup({
        id: 'test-id',
        name: 'Alice',
        email: 'alice@email.fr',
        password: 'test-pass',
      });

      userFixture.thenErrorShouldBe(BadRequestError);
    });
  });
});
