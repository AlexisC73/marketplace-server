import { Injectable } from '@nestjs/common';
import { FileRepository } from '../../file.repository';
import { UserRepository } from '../../user.repository';
import { InvalidTypeError, UserNotFoundError } from '../error/error';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async handle(uploadAvatarCommand: UploadAvatarCommand) {
    const user = await this.userRepository.findOneById(
      uploadAvatarCommand.userId,
    );

    if (!user) {
      throw new UserNotFoundError();
    }

    const acceptedMimetypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedMimetypes.includes(uploadAvatarCommand.mimetype)) {
      throw new InvalidTypeError();
    }
    const savedUrl = await this.fileRepository.save({
      file: uploadAvatarCommand.image,
      fileName: uploadAvatarCommand.fileName,
      mimetype: uploadAvatarCommand.mimetype,
      saveDirectory: uploadAvatarCommand.saveDirectory,
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

export type UploadAvatarCommand = {
  image: Buffer;
  fileName: string;
  mimetype: string;
  userId: string;
  saveDirectory: string;
};
