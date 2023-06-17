import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { UserNotFoundError } from '../error/error';
import { FileRepository } from '../../file.repository';
import { User } from '@app/good-place/domain/entity/user';
import env from '@app/good-place/utils/env';

@Injectable()
export class DeleteAvatarUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileRepository: FileRepository,
  ) {}
  async handle(command: DeleteAvatarCommand) {
    const user = await this.userRepository.findOneById(command.userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    await this.fileRepository.delete(user.avatarUrl);

    const updatedUser = User.fromData({
      id: user.id,
      avatarUrl: env.defaultImageUrl,
      createdAt: user.createdAt,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
    });

    await this.userRepository.save(updatedUser);
  }
}

export type DeleteAvatarCommand = {
  userId: string;
};
