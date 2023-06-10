import { GoodPlaceModule } from '@app/good-place/good-place.module';
import { PrismaBookRepository } from '@app/good-place/infrastructure/prisma-book.repository';
import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';
import { RealDateProvider } from '@app/good-place/infrastructure/real-date.provider';
import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { PrismaUserRepository } from '@app/good-place/infrastructure/prisma-user.repository';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { ConfigModule } from '@nestjs/config';
import { S3FileRepository } from '@app/good-place/infrastructure/S3FileRepository';
import { BcryptHashService } from '@app/good-place/infrastructure/bcrypt-hash.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GoodPlaceModule.register({
      BookRepository: PrismaBookRepository,
      PrismaClient: PrismaService,
      DateProvider: RealDateProvider,
      UserRepository: PrismaUserRepository,
      FileRepository: S3FileRepository,
      HashService: BcryptHashService,
    }),
    BookModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
