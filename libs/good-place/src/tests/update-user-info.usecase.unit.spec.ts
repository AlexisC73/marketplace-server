import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('Update User Info', () => {
  let userFixture: UserFixture;

  beforeEach(() => {
    userFixture = createUserFixture();
  });

  test('when user update his informations, then it should be updated', async () => {
    const defaultUser = userBuilder();
    userFixture.givenUserExist([defaultUser.build()]);
    await userFixture.whenUserUpdateHisInformations({
      id: defaultUser.build().id,
      name: 'new username',
      email: 'new@email.fr',
    });
    userFixture.thenUserAccountShouldExist(
      defaultUser.withName('new username').withEmail('new@email.fr').build(),
    );
  });

  test('when user update his name, then only name should be updated', async () => {
    const defaultUser = userBuilder();
    userFixture.givenUserExist([defaultUser.build()]);
    await userFixture.whenUserUpdateHisInformations({
      id: defaultUser.build().id,
      name: 'new username',
    });
    userFixture.thenUserAccountShouldExist(
      defaultUser.withName('new username').build(),
    );
  });

  test('when user update his email, then only email should be updated', async () => {
    const defaultUser = userBuilder();
    userFixture.givenUserExist([defaultUser.build()]);
    await userFixture.whenUserUpdateHisInformations({
      id: defaultUser.build().id,
      email: 'new@email.fr',
    });
    userFixture.thenUserAccountShouldExist(
      defaultUser.withEmail('new@email.fr').build(),
    );
  });
});
