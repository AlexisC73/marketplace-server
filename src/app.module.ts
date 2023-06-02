import { GoodPlaceModule } from '@app/good-place/good-place.module';
import { PrismaBookRepository } from '@app/good-place/infrastructure/prisma-book.repository';
import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';
import { RealDateProvider } from '@app/good-place/infrastructure/real-date.provider';
import { Module } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { PrismaUserRepository } from '@app/good-place/infrastructure/prisma-user.repository';

@Module({
  imports: [
    GoodPlaceModule.register({
      BookRepository: PrismaBookRepository,
      PrismaClient: PrismaService,
      DateProvider: RealDateProvider,
      UserRepository: PrismaUserRepository,
    }),
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
