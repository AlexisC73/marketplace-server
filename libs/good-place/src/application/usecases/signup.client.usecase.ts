import { Injectable } from '@nestjs/common';
import { Role, User } from '../../domain/user';
import { DateProvider } from '../date.provider';
import { UserRepository } from '../user.repository';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateProdiver: DateProvider,
  ) {}

  async handle(signupUserCommand: SignupUserCommand) {
    const authorizedRoles = [Role.CLIENT, Role.SELLER];
    const signupRole = Role[signupUserCommand.role];
    if (!authorizedRoles.includes(signupRole)) {
      throw new UnauthorizedError(`Role ${signupRole} is not authorized`);
    }
    const user: User = User.fromData({
      id: signupUserCommand.id,
      name: signupUserCommand.name,
      email: signupUserCommand.email,
      password: signupUserCommand.password,
      role: signupRole,
      createdAt: this.dateProdiver.getNow(),
    });
    await this.userRepository.save(user);
  }
}

export type SignupUserCommand = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: keyof typeof Role;
};

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
