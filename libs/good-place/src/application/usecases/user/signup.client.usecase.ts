import { Injectable } from '@nestjs/common';
import { Role, User } from '../../../domain/entity/user';
import { DateProvider } from '../../date.provider';
import { UserRepository } from '../../user.repository';
import { HashService } from '../../hash.service';
import { BadRequestError, UnauthorizedError } from '../error/error';
import env from '@app/good-place/utils/env';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateProdiver: DateProvider,
    private readonly hashService: HashService,
  ) {}

  async handle(signupUserCommand: SignupUserCommand) {
    const existUser = await this.userRepository.findOneByEmail(
      signupUserCommand.email,
    );

    if (existUser) {
      throw new BadRequestError('User already exists');
    }

    const hashedPassword = await this.hashService.hash(
      signupUserCommand.password,
    );

    const user: User = User.fromData({
      id: signupUserCommand.id,
      name: signupUserCommand.name,
      email: signupUserCommand.email.toLocaleLowerCase(),
      password: hashedPassword,
      role: Role.CLIENT,
      createdAt: this.dateProdiver.getNow(),
      avatarUrl: env.defaultImageUrl,
    });
    await this.userRepository.save(user);
  }
}

export type SignupUserCommand = {
  id: string;
  name: string;
  email: string;
  password: string;
};
