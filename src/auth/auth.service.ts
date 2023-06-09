import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInUserDTO } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: SignInUserDTO) {
    const fundUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!fundUser) {
      throw new ForbiddenException();
    }

    const isPasswordValid = await bcrypt.compare(password, fundUser.password);
    if (!isPasswordValid) {
      throw new ForbiddenException();
    }

    const token = await this.jwtService.signAsync(
      {
        id: fundUser.id,
        email: fundUser.email,
        name: fundUser.name,
        role: fundUser.role,
        avatarUrl: fundUser.avatarUrl,
      },
      {
        expiresIn: '1d',
      },
    );

    return {
      id: fundUser.id,
      email: fundUser.email,
      name: fundUser.name,
      role: fundUser.role,
      avatarUrl: fundUser.avatarUrl,
      access_token: token,
    };
  }
}
