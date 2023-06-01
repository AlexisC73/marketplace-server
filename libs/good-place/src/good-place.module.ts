import { Module, ClassProvider, DynamicModule, Global } from '@nestjs/common';
import { BookRepository } from './application/book.repository';
import { AddBookUseCase } from './application/usecases/add-book.usecase';
import { PrismaClient } from '@prisma/client';
import { DateProvider } from './application/date.provider';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class GoodPlaceModule {
  static register(providers: {
    BookRepository: ClassProvider<BookRepository>['useClass'];
    PrismaClient: ClassProvider<PrismaClient>['useClass'];
    DateProvider: ClassProvider<DateProvider>['useClass'];
  }): DynamicModule {
    return {
      module: GoodPlaceModule,
      providers: [
        AddBookUseCase,
        { provide: BookRepository, useClass: providers.BookRepository },
        { provide: PrismaClient, useClass: providers.PrismaClient },
        { provide: DateProvider, useClass: providers.DateProvider },
      ],
      exports: [AddBookUseCase, DateProvider, PrismaClient, BookRepository],
    };
  }
}
