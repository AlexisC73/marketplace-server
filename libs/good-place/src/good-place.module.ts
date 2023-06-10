import { Module, ClassProvider, DynamicModule, Global } from '@nestjs/common';
import { BookRepository } from './application/book.repository';
import { AddBookUseCase } from './application/usecases/book/add-book.usecase';
import { PrismaClient } from '@prisma/client';
import { DateProvider } from './application/date.provider';
import { DeleteBookUseCase } from './application/usecases/book/delete-book.usecase';
import { SignupUseCase } from './application/usecases/user/signup.client.usecase';
import { UserRepository } from './application/user.repository';
import { UploadAvatarUseCase } from './application/usecases/user/upload-avatar.usecase';
import { FileRepository } from './application/file.repository';
import { HashService } from './application/hash.service';
import { UpdateUserInfoUseCase } from './application/usecases/user/update-info.usecase';
import { UpdateUserPasswordUseCase } from './application/usecases/user/update-password.usecase';

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
    UserRepository: ClassProvider<UserRepository>['useClass'];
    FileRepository: ClassProvider<FileRepository>['useClass'];
    HashService: ClassProvider<HashService>['useClass'];
  }): DynamicModule {
    return {
      module: GoodPlaceModule,
      providers: [
        AddBookUseCase,
        DeleteBookUseCase,
        SignupUseCase,
        UploadAvatarUseCase,
        UpdateUserInfoUseCase,
        UpdateUserPasswordUseCase,
        { provide: BookRepository, useClass: providers.BookRepository },
        { provide: PrismaClient, useClass: providers.PrismaClient },
        { provide: DateProvider, useClass: providers.DateProvider },
        { provide: UserRepository, useClass: providers.UserRepository },
        { provide: FileRepository, useClass: providers.FileRepository },
        { provide: HashService, useClass: providers.HashService },
      ],
      exports: [
        AddBookUseCase,
        DeleteBookUseCase,
        SignupUseCase,
        UploadAvatarUseCase,
        UpdateUserInfoUseCase,
        UpdateUserPasswordUseCase,
      ],
    };
  }
}
