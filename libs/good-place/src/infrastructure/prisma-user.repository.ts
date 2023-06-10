import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../application/user.repository';
import { Role, User } from '../domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(user: User) {
    await this.prisma.user.upsert({
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        name: user.name,
        role: Role[user.role],
        avatarUrl: user.avatarUrl,
      },
      update: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: Role[user.role],
        avatarUrl: user.avatarUrl,
      },
      where: {
        id: user.id,
      },
    });
  }

  async updateAvatar(user: User, savedUrl: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: savedUrl },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.fromData({
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      name: user.name,
      role: Role[user.role],
      avatarUrl: user.avatarUrl,
    });
  }

  async findOneByEmail(email: string) {
    const fundUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!fundUser) {
      return null;
    }
    return User.fromData({
      id: fundUser.id,
      email: fundUser.email,
      password: fundUser.password,
      createdAt: fundUser.createdAt,
      name: fundUser.name,
      role: Role[fundUser.role],
      avatarUrl: fundUser.avatarUrl,
    });
  }
}
