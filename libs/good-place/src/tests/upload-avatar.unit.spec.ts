import {
  InvalidTypeError,
  UserNotFoundError,
} from '../application/usecases/user/upload-avatar.usecase';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('Upload Avatar', () => {
  let userFixture: UserFixture;

  beforeEach(() => {
    userFixture = createUserFixture();
  });

  test('should save image', async () => {
    const fakeFile = Buffer.from('fake-file');

    const user = userBuilder()
      .withId('test-user')
      .withAvatarUrl('default-avatar-url')
      .build();
    userFixture.givenUserExist([user]);

    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
      saveDirectory: 'avatar',
    });
    await userFixture.thenUsersAvatarUrlShouldBe({ user, url: 'test.jpg' });
  });

  test('should not save file if mimetype not accepted', async () => {
    const fakeFile = Buffer.from('fake-file');
    userFixture.givenUserExist([userBuilder().withId('1').build()]);
    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.txt',
      mimetype: 'text/plain',
      userId: '1',
      saveDirectory: 'avatar',
    });
    userFixture.thenErrorShouldBe(InvalidTypeError);
  });

  test('should return error if user not exist', async () => {
    const fakeFile = Buffer.from('fake-file');

    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
      saveDirectory: 'avatar',
    });

    userFixture.thenErrorShouldBe(UserNotFoundError);
  });
});
