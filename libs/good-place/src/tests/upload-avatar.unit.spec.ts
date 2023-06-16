import {
  InvalidTypeError,
  UserNotFoundError,
} from '../application/usecases/error/error';
import { StubDateProvider } from '../infrastructure/stub-date.provider';
import env from '../utils/env';
import { fileBuilder } from './fileBuilder';
import { FileFixture, createFileFixture } from './fileFixture';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('Upload Avatar', () => {
  let userFixture: UserFixture;
  let fileFixture: FileFixture;
  const dateProvider = new StubDateProvider();

  beforeEach(() => {
    userFixture = createUserFixture({ dateProvider });
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

    const now = new Date('2021-01-01T00:00:00.000Z');

    userFixture.givenUserExist([user]);
    fileFixture.givenFileExist([previousAvatar]);
    userFixture.givenNowIs(now);

    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
      saveDirectory: 'default',
    });
    const expectedName = `default/${now.getTime().toString()}-test.jpg`;
    await userFixture.thenUsersAvatarUrlShouldBe({
      user,
      url: expectedName,
    });

    fileFixture.thenFileShouldNotExist(previousAvatarUrl);
  });

  test('should save image and dont delete previous image if its default image', async () => {
    const [savedDirectory, fileName] = env.defaultImageUrl.split('/');

    const fakeFile = Buffer.from('fake-file');
    const previousAvatar = fileBuilder()
      .withFileName(fileName)
      .withSaveDirectory(savedDirectory)
      .build();

    const previousAvatarUrl = `${previousAvatar.saveDirectory}/${previousAvatar.fileName}`;

    const user = userBuilder()
      .withId('test-user')
      .withAvatarUrl(previousAvatarUrl)
      .build();

    const now = new Date('2021-01-01T00:00:00.000Z');

    userFixture.givenNowIs(new Date('2021-01-01T00:00:00.000Z'));

    userFixture.givenUserExist([user]);
    fileFixture.givenFileExist([previousAvatar]);

    await userFixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
      saveDirectory: savedDirectory,
    });
    await userFixture.thenUsersAvatarUrlShouldBe({
      user,
      url: `${savedDirectory}/${now.getTime().toString()}-test.jpg`,
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
