import {
  SignupUseCase,
  SignupUserCommand,
} from '@app/good-place/application/usecases/signup.client.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { Role } from '@app/good-place/domain/user';

@Injectable()
export class UserService {
  constructor(private readonly signupUseCase: SignupUseCase) {}

  async signup({ name, email, role, password }: CreateUserDTO) {
    const signupUserCommand: SignupUserCommand = {
      id: createId(),
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: Role[role],
    };
    try {
      await this.signupUseCase.handle(signupUserCommand);
      return Promise.resolve();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
