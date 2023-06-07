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
