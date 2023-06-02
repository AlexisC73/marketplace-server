import { Module, ClassProvider, DynamicModule, Global } from '@nestjs/common';
import { BookRepository } from './application/book.repository';
import { AddBookUseCase } from './application/usecases/add-book.usecase';
import { PrismaClient } from '@prisma/client';
import { DateProvider } from './application/date.provider';
import { DeleteBookUseCase } from './application/usecases/delete-book.usecase';

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
        DeleteBookUseCase,
        { provide: BookRepository, useClass: providers.BookRepository },
        { provide: PrismaClient, useClass: providers.PrismaClient },
        { provide: DateProvider, useClass: providers.DateProvider },
      ],
      exports: [AddBookUseCase, DeleteBookUseCase],
    };
  }
}
