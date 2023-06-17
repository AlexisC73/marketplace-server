import { Injectable } from '@nestjs/common';
import { Role, User } from '../../../domain/entity/user';
import { DateProvider } from '../../date.provider';
import { UserRepository } from '../../user.repository';
import { HashService } from '../../hash.service';
import { BadRequestError } from '../error/error';
import env from '@app/good-place/utils/env';

@Injectable()
export class SignupSellerUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dateProdiver: DateProvider,
    private readonly hashService: HashService,
  ) {}

  async handle(command: SignupSellerCommand) {
    const existUser = await this.userRepository.findOneByEmail(command.email);

    if (existUser) {
      throw new BadRequestError('Email already in use.');
    }

    const hashedPassword = await this.hashService.hash(command.password);

    const user: User = User.fromData({
      id: command.id,
      name: command.name,
      email: command.email.toLocaleLowerCase(),
      password: hashedPassword,
      role: Role.SELLER,
      createdAt: this.dateProdiver.getNow(),
      avatarUrl: env.defaultImageUrl,
    });
    await this.userRepository.save(user);
  }
}

export type SignupSellerCommand = {
  id: string;
  name: string;
  email: string;
  password: string;
};
