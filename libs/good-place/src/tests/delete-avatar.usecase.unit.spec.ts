import { User } from '../domain/entity/user';
import env from '../utils/env';
import { fileBuilder } from './fileBuilder';
import { FileFixture, createFileFixture } from './fileFixture';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('DeleteAvatarUseCase', () => {
  let userFixture: UserFixture;
  let fileFixture: FileFixture;

  beforeEach(async () => {
    userFixture = createUserFixture();
    fileFixture = createFileFixture({
      fileRepository: userFixture.fileRepository,
    });
  });

  test('When user delete his avatar, should delete image in db and set the default image', async () => {
    const image = fileBuilder()
      .withFileName('testing-image.jpg')
      .withSaveDirectory('avatar')
      .build();

    const user = userBuilder()
      .withAvatarUrl('avatar/testing-image.jpg')
      .build();
    userFixture.givenUserExist([user]);
    fileFixture.givenFileExist([image]);

    await userFixture.whenUserDeleteAvatar({
      userId: user.id,
    });

    fileFixture.thenFileShouldNotExist(
      image.saveDirectory + '/' + image.fileName,
    );

    userFixture.thenUserAccountShouldExist(
      User.fromData({
        id: user.id,
        avatarUrl: env.defaultImageUrl,
        createdAt: user.createdAt,
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      }),
    );
  });

  test('When user delete his avatar but it is the default avatar, it should do nothing', async () => {
    const [directory, fileName] = env.defaultImageUrl.split('/');
    const image = fileBuilder()
      .withFileName(fileName)
      .withSaveDirectory(directory)
      .build();

    const user = userBuilder().withAvatarUrl(env.defaultImageUrl).build();
    userFixture.givenUserExist([user]);
    fileFixture.givenFileExist([image]);

    await userFixture.whenUserDeleteAvatar({
      userId: user.id,
    });

    fileFixture.thenFileShouldExist(image.saveDirectory + '/' + image.fileName);
    userFixture.thenUserAccountShouldExist(
      User.fromData({
        id: user.id,
        avatarUrl: env.defaultImageUrl,
        createdAt: user.createdAt,
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      }),
    );
  });
});
