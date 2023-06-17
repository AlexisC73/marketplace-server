import { User } from '@app/good-place/domain/entity/user';
import { UserRepository } from '../../user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUserInfoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(updateUserInfoCommand: UpdateUserInfoCommand) {
    const user = await this.userRepository.findOneById(
      updateUserInfoCommand.id,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const newUser = User.fromData({
      id: user.id,
      avatarUrl: user.avatarUrl,
      email: updateUserInfoCommand.email || user.email,
      name: updateUserInfoCommand.name || user.name,
      password: user.password,
      createdAt: user.createdAt,
      role: user.role,
    });

    return this.userRepository.save(newUser);
  }
}

export type UpdateUserInfoCommand = {
  id: string;
  name?: string;
  email?: string;
};
