import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../application/user.repository';
import { Role, User } from '../domain/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async save(user: User) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existUser) {
      throw new Error('User already exists');
    }
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
}
