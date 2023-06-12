import {
  DeleteAvatarCommand,
  DeleteAvatarUseCase,
} from '../application/usecases/user/delete-avatar.usecase';
import {
  SignupUseCase,
  SignupUserCommand,
} from '../application/usecases/user/signup.client.usecase';
import {
  SignupSellerCommand,
  SignupSellerUseCase,
} from '../application/usecases/user/signup.seller.usecase';
import {
  UpdateUserInfoCommand,
  UpdateUserInfoUseCase,
} from '../application/usecases/user/update-info.usecase';
import {
  UpdateUserPasswordCommand,
  UpdateUserPasswordUseCase,
} from '../application/usecases/user/update-password.usecase';
import {
  UploadAvatarCommand,
  UploadAvatarUseCase,
} from '../application/usecases/user/upload-avatar.usecase';
import { User } from '../domain/user';
import { InMemoryFileRepository } from '../infrastructure/in-memory-file.repository';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';
import { StubHashService } from '../infrastructure/stub-hash.service';

export const createUserFixture = () => {
  const dateProvider = new StubDateProvider();
  const userRepository = new InMemoryUserRepository();
  const fileRepository = new InMemoryFileRepository();
  const hashService = new StubHashService();
  const signupUseCase = new SignupUseCase(
    userRepository,
    dateProvider,
    hashService,
  );
  const signupSellerUseCase = new SignupSellerUseCase(
    userRepository,
    dateProvider,
    hashService,
  );
  const updateUserInfoUseCase = new UpdateUserInfoUseCase(userRepository);
  const uploadAvatarUseCase = new UploadAvatarUseCase(
    fileRepository,
    userRepository,
  );
  const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(
    userRepository,
    hashService,
  );
  const deleteAvatarUseCase = new DeleteAvatarUseCase(
    userRepository,
    fileRepository,
  );

  let thrownError: Error;

  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
    },
    givenUserExist: (users: User[]) => {
      users.map((u) => userRepository.save(u));
    },
    whenNewUserSignup: async (signupUserCommand: SignupUserCommand) => {
      try {
        await signupUseCase.handle(signupUserCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    whenNewSellerSignup: async (signupSellerCommand: SignupSellerCommand) => {
      try {
        await signupSellerUseCase.handle(signupSellerCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    whenUserUploadAvatar: async (uploadAvatarCommand: UploadAvatarCommand) => {
      try {
        await uploadAvatarUseCase.handle(uploadAvatarCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    whenUserDeleteAvatar: async (deleteAvatarCommand: DeleteAvatarCommand) => {
      try {
        await deleteAvatarUseCase.handle(deleteAvatarCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    whenUserUpdateHisInformations: async (
      updateUserInfoCommand: UpdateUserInfoCommand,
    ) => {
      try {
        await updateUserInfoUseCase.handle(updateUserInfoCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    whenUserUpdatePassword: async (
      updatePasswordCommand: UpdateUserPasswordCommand,
    ) => {
      try {
        await updateUserPasswordUseCase.handle(updatePasswordCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    thenUserAccountShouldExist: (expectedUser: User) => {
      const fundUser = userRepository.users.find(
        (u) => u.id === expectedUser.id,
      );

      expect(fundUser).toEqual(expectedUser.data);
    },
    thenErrorShouldBe: (expectedError: new () => Error) => {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
    thenUsersAvatarUrlShouldBe: async (expectedUserAvatar: {
      user: User;
      url: string;
    }) => {
      const user = await userRepository.findOneById(expectedUserAvatar.user.id);
      expect(user.avatarUrl).toBe(expectedUserAvatar.url);
    },
    thenFileShouldNotExist: async (url: string) => {
      const file = fileRepository.files[url];
      expect(file).not.toBeDefined();
    },
    thenUserShouldNotExist: (id: string) => {
      const fundUser = userRepository.users.find((u) => u.id === id);
      expect(fundUser).toBeUndefined();
    },
    fileRepository,
  };
};

export type UserFixture = ReturnType<typeof createUserFixture>;
