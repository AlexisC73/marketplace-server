import {
  SignupUseCase,
  SignupUserCommand,
} from '@app/good-place/application/usecases/user/signup.client.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { CreateUserDTO } from './dto/create-user.dto';
import {
  UploadAvatarCommand,
  UploadAvatarUseCase,
} from '@app/good-place/application/usecases/user/upload-avatar.usecase';
import { SavedMultipartFile } from '@fastify/multipart';
import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';
import { UpdateUserInfoDTO } from './dto/update-user-info.dto';
import { UpdateUserInfoUseCase } from '@app/good-place/application/usecases/user/update-info.usecase';
import { UpdateUserPasswordDTO } from './dto/update-user-password.dto';
import {
  UpdateUserPasswordCommand,
  UpdateUserPasswordUseCase,
} from '@app/good-place/application/usecases/user/update-password.usecase';

@Injectable()
export class UserService {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
    private readonly prismaService: PrismaService,
    private readonly updateUserInfoUseCase: UpdateUserInfoUseCase,
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
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

      if (!user?.id) {
        throw new BadRequestException(
          'An error occurred with your authentification, please logout and try again.',
        );
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
      throw new BadRequestException(
        'An error occurred with your authentification, please logout and try again.',
      );
    }
    return { data: { avatarUrl: fundUser.avatarUrl } };
  }

  async updateInfo(req: any, body: UpdateUserInfoDTO) {
    try {
      await this.updateUserInfoUseCase.handle({
        id: req.user.id,
        email: body.email,
        name: body.name,
      });
    } catch (err) {
      throw new BadRequestException(
        "An error occurred while updating user's info, please try again.",
      );
    }
  }

  async updatePassword(req: any, body: UpdateUserPasswordDTO) {
    try {
      const user = req.user;
      if (!user) {
        throw new BadRequestException();
      }

      const updateUserPasswordCommand: UpdateUserPasswordCommand = {
        userId: user.id,
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
      };

      await this.updateUserPasswordUseCase.handle(updateUserPasswordCommand);
    } catch (err) {
      throw new BadRequestException();
    }
  }
}
