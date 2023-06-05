import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../application/user.repository';
import { Role, User } from '../domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User) {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        name: user.name,
        role: Role[user.role],
      },
    });
  }

  async findOneByEmail(email: string) {
    const fundUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!fundUser) {
      return undefined;
    }
    return User.fromData({
      id: fundUser.id,
      email: fundUser.email,
      password: fundUser.password,
      createdAt: fundUser.createdAt,
      name: fundUser.name,
      role: Role[fundUser.role],
    });
  }
}
