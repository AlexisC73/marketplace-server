import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { GoodPlaceModule } from '@app/good-place/good-place.module';
import { PrismaBookRepository } from '@app/good-place/infrastructure/prisma-book.repository';
import { PrismaService } from '@app/good-place/infrastructure/prisma/prisma.service';
import { RealDateProvider } from '@app/good-place/infrastructure/real-date.provider';
import { PrismaUserRepository } from '@app/good-place/infrastructure/prisma-user.repository';

@Module({
  imports: [],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
