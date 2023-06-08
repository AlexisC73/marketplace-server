import {
  SignupUseCase,
  SignupUserCommand,
} from '@app/good-place/application/usecases/signup.client.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import {
  UploadAvatarCommand,
  UploadAvatarUseCase,
} from '@app/good-place/application/usecases/upload-avatar.usecase';
import { SavedMultipartFile } from '@fastify/multipart';
import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    private readonly prismaService: PrismaService,
  ) {}

  async signup({ name, email, role, password }: CreateUserDTO) {
    const signupUserCommand: SignupUserCommand = {
      id: createId(),
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    };
    try {
      await this.signupUseCase.handle(signupUserCommand);
      return Promise.resolve();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async uploadAvatar(req: any) {
    const file: SavedMultipartFile = await req.file();

    const uploadAvatarCommand: UploadAvatarCommand = {
      fileName: file.filename,
      image: await file.toBuffer(),
      mimetype: file.mimetype,
      userId: req.user.id,
    };

    await this.uploadAvatarUseCase.handle(uploadAvatarCommand);
  }

  async getAvatar(req: any) {
    const user = req.user;

    const fundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });
    if (!fundUser) {
      throw new BadRequestException('User not found, try to log again.');
    }
    return { data: { avatarUrl: fundUser.avatarUrl } };
  }
}
