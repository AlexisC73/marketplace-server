import { User } from '@app/good-place/domain/entity/user';
import { HashService } from '../../hash.service';
import { UserRepository } from '../../user.repository';
import { UnauthorizedError, UserNotFoundError } from '../error/error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}
  async handle(command: UpdateUserPasswordCommand): Promise<void> {
    const user = await this.userRepository.findOneById(command.userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    const isOldPasswordValid = await this.hashService.verify(
      command.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedError();
    }
    const newPassword = await this.hashService.hash(command.newPassword);
    const updatedUser = User.fromData({
      id: user.id,
      avatarUrl: user.avatarUrl,
      email: user.email,
      name: user.name,
      password: newPassword,
      role: user.role,
      createdAt: user.createdAt,
    });

    return this.userRepository.save(updatedUser);
  }
}

export type UpdateUserPasswordCommand = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};
