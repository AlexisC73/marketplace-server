import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignInUserDTO } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signinClient({ email, password }: SignInUserDTO) {
    const fundUser = await this.prismaService.user.findFirst({
      where: { email: email.toLocaleLowerCase(), role: { not: 'SELLER' } },
    });

    if (!fundUser) throw new BadRequestException();

    await this.verifyPasswordOrThrow(password, fundUser.password);

    const token = await this.createToken(fundUser);

    return {
      id: fundUser.id,
      email: fundUser.email,
      name: fundUser.name,
      role: fundUser.role,
      avatarUrl: fundUser.avatarUrl,
      access_token: token,
    };
  }

  async signinSeller(dto: SignInUserDTO) {
    const fundUser = await this.prismaService.user.findFirst({
      where: { email: dto.email.toLocaleLowerCase(), role: { not: 'CLIENT' } },
    });

    if (!fundUser) {
      throw new BadRequestException();
    }

    await this.verifyPasswordOrThrow(dto.password, fundUser.password);

    const token = await this.createToken(fundUser);

    return {
      id: fundUser.id,
      email: fundUser.email,
      name: fundUser.name,
      role: fundUser.role,
      avatarUrl: fundUser.avatarUrl,
      access_token: token,
    };
  }

  async createToken(user: User) {
    return await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      {
        expiresIn: '1d',
      },
    );
  }

  async verifyPasswordOrThrow(password: string, hash: string) {
    const isPasswordValid = await bcrypt.compare(password, hash);
    if (!isPasswordValid) {
      throw new ForbiddenException();
    }
  }
}
