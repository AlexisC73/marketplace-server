import {
  SignupUseCase,
  SignupUserCommand,
} from '@app/good-place/application/usecases/user/signup.client.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import {
  UploadAvatarCommand,
  UploadAvatarUseCase,
} from '@app/good-place/application/usecases/user/upload-avatar.usecase';
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
      password,
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
    try {
      const file: SavedMultipartFile = await req.file();
      const user = req.user;

      if (!user) {
        throw new BadRequestException('User not found, try to log again.');
      }
      if (!user.id) {
        throw new BadRequestException('User id not found, try to log again.');
      }

      const extension = file.filename.split('.').pop();

      const uploadAvatarCommand: UploadAvatarCommand = {
        fileName: `avatar-${user.id}.${extension}`,
        image: await file.toBuffer(),
        mimetype: file.mimetype,
        userId: req.user.id,
        saveDirectory: 'avatar',
      };

      await this.uploadAvatarUseCase.handle(uploadAvatarCommand);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
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
