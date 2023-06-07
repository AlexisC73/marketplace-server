import {
  InvalidTypeError,
  UploadAvatarCommand,
  UploadAvatarUseCase,
  UserNotFoundError,
} from '../application/usecases/upload-avatar.usecase';
import { InMemoryFileRepository } from '../infrastructure/in-memory-file.repository';
import { User } from '../domain/user';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository';
import { userBuilder } from './userBuilder';

describe('Upload Avatar', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('should save image', async () => {
    const fakeFile = Buffer.from('fake-file');

    const user = userBuilder()
      .withId('test-user')
      .withAvatarUrl('default-avatar-url')
      .build();
    fixture.givenUserExists([user]);

    await fixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
    });
    await fixture.thenUsersAvatarUrlShouldBe({ user, url: 'test.jpg' });
  });

  test('should not save file if mimetype not accepted', async () => {
    const fakeFile = Buffer.from('fake-file');
    await fixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.txt',
      mimetype: 'text/plain',
      userId: '1',
    });
    fixture.thenErrorShouldBe(InvalidTypeError);
  });

  test('should return error if user not exist', async () => {
    const fakeFile = Buffer.from('fake-file');

    await fixture.whenUserUploadAvatar({
      image: fakeFile,
      fileName: 'test.jpg',
      mimetype: 'image/jpg',
      userId: 'test-user',
    });

    fixture.thenErrorShouldBe(UserNotFoundError);
  });
});

const createFixture = () => {
  const userRepository = new InMemoryUserRepository();
  const fileRepository = new InMemoryFileRepository();
  const uploadAvatarUseCase = new UploadAvatarUseCase(
    fileRepository,
    userRepository,
  );
  let thrownError: Error;

  return {
    givenUserExists: (users: User[]) => {
      userRepository.users = users.map((u) => u.data);
    },
    whenUserUploadAvatar: async (uploadAvatarCommand: UploadAvatarCommand) => {
      try {
        await uploadAvatarUseCase.handle(uploadAvatarCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    thenUsersAvatarUrlShouldBe: async (expectedUserAvatar: {
      user: User;
      url: string;
    }) => {
      const user = await userRepository.findOneById(expectedUserAvatar.user.id);
      expect(user.avatarUrl).toBe(expectedUserAvatar.url);
    },
    thenErrorShouldBe: (expectedError: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;

// test('test', async () => {
//   const request = await fetch(
//     'https://f.hellowork.com/blogdumoderateur/2013/10/google-logo.png',
//   );

//   const response = await request.arrayBuffer();
//   console.log(Buffer.from(response));
// });
