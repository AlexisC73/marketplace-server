import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../application/user.repository';
import { User } from '../domain/user';

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
        role: user.role,
      },
    });
  }
}
