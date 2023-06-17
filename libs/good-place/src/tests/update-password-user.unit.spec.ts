import {
  UnauthorizedError,
  UserNotFoundError,
} from '../application/usecases/error/error';
import { User } from '../domain/entity/user';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('Update Password UseCase', () => {
  let userFixture: UserFixture;

  beforeEach(() => {
    userFixture = createUserFixture();
  });

  test('a user can update his password', async () => {
    const user = userBuilder().withPassword('test-pass').build();
    userFixture.givenUserExist([user]);

    await userFixture.whenUserUpdatePassword({
      userId: user.id,
      oldPassword: 'test-pass',
      newPassword: 'new-pass',
    });

    userFixture.thenUserAccountShouldExist(
      User.fromData({
        id: user.id,
        avatarUrl: user.avatarUrl,
        email: user.email,
        name: user.name,
        password: 'new-pass',
        role: user.role,
        createdAt: user.createdAt,
      }),
    );
  });

  test('a user can not update his password if old pass not valid', async () => {
    const user = userBuilder().withPassword('test-pass').build();
    userFixture.givenUserExist([user]);

    await userFixture.whenUserUpdatePassword({
      userId: user.id,
      oldPassword: 'new-pass',
      newPassword: 'new-pass',
    });

    userFixture.thenErrorShouldBe(UnauthorizedError);
  });

  test('a user can not update his password if old pass not valid', async () => {
    await userFixture.whenUserUpdatePassword({
      userId: 'not-exist',
      oldPassword: 'old-pass',
      newPassword: 'new-pass',
    });

    userFixture.thenErrorShouldBe(UserNotFoundError);
  });
});
