import {
  InvalidTypeError,
  UserNotFoundError,
} from '../application/usecases/error/error';
import { fileBuilder } from './fileBuilder';
import { FileFixture, createFileFixture } from './fileFixture';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('Upload Avatar', () => {
  let userFixture: UserFixture;
  let fileFixture: FileFixture;

  beforeEach(() => {
    userFixture = createUserFixture();
    fileFixture = createFileFixture({
      fileRepository: userFixture.fileRepository,
    });
  });
  test('should save image and delete previous image if not default image', async () => {
    const fakeFile = Buffer.from('fake-file');
    const previousAvatar = fileBuilder()
      .withFileName('fake-file.jpg')
      .withSaveDirectory('default')
      .build();

    const previousAvatarUrl = `${previousAvatar.saveDirectory}/${previousAvatar.fileName}`;

    const user = userBuilder()
      .withId('test-user')
      .withAvatarUrl(previousAvatarUrl)
      .build();

    userFixture.givenUserExist([user]);
    fileFixture.givenFileExist([previousAvatar]);

    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
      saveDirectory: 'default',
    });
    await userFixture.thenUsersAvatarUrlShouldBe({
      user,
      url: 'default/test.jpg',
    });

    fileFixture.thenFileShouldNotExist(previousAvatarUrl);
  });

  test('should save image and dont delete previous image if its default image', async () => {
    const fakeFile = Buffer.from('fake-file');
    const previousAvatar = fileBuilder()
      .withFileName('default-avatar.jpg')
      .withSaveDirectory('avatar')
      .build();

    const previousAvatarUrl = `${previousAvatar.saveDirectory}/${previousAvatar.fileName}`;

    const user = userBuilder()
      .withId('test-user')
      .withAvatarUrl(previousAvatarUrl)
      .build();

    userFixture.givenUserExist([user]);
    fileFixture.givenFileExist([previousAvatar]);

    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
      saveDirectory: 'default',
    });
    await userFixture.thenUsersAvatarUrlShouldBe({
      user,
      url: 'default/test.jpg',
    });

    fileFixture.thenFileShouldExist(previousAvatarUrl);
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
