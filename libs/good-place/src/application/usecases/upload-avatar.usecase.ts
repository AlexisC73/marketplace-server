import { FileRepository } from '../file.repository';
import { UserRepository } from '../user.repository';

export class UploadAvatarUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async handle(uploadAvatarCommand: UploadAvatarCommand) {
    const acceptedMimetypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedMimetypes.includes(uploadAvatarCommand.mimetype)) {
      throw new InvalidTypeError();
    }
    const savedUrl = await this.fileRepository.save({
      file: uploadAvatarCommand.image,
      fileName: uploadAvatarCommand.fileName,
    });

    const userToUpdate = await this.userRepository.findOneById(
      uploadAvatarCommand.userId,
    );

    if (!userToUpdate) {
      throw new UserNotFoundError();
    }

    await this.userRepository.updateAvatar(userToUpdate, savedUrl);
  }
}

export class InvalidTypeError extends Error {}
export class UserNotFoundError extends Error {}

export type UploadAvatarCommand = {
  image: Buffer;
  fileName: string;
  mimetype: string;
  userId: string;
};
