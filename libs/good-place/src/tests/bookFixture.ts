import { FileRepository } from '../application/file.repository';
import {
  AddBookCommand,
  AddBookUseCase,
} from '../application/usecases/book/add-book.usecase';
import { GetPublishedBookUseCase } from '../application/usecases/book/get-published-book.usecase';
import { Book } from '../domain/entity/book';
import { InMemoryBookRepository } from '../infrastructure/in-memory-book.repository';
import { InMemoryFileRepository } from '../infrastructure/in-memory-file.repository';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';

export const createBookFixture = ({
  userRepository = new InMemoryUserRepository(),
  fileRepository = new InMemoryFileRepository(),
}: { userRepository?: any; fileRepository?: any } = {}) => {
  const bookRepository = new InMemoryBookRepository();
  const dateProvider = new StubDateProvider();
  const addBookUseCase = new AddBookUseCase(
    bookRepository,
    userRepository,
    dateProvider,
    fileRepository,
  );
  const getAllPublishedBookUseCase = new GetPublishedBookUseCase(
    bookRepository,
  );

  let books: Book[] = [];

  let thrownError: Error | undefined;

  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
    },
    givenBooksExist(books: Book[]) {
      bookRepository.givenBookExists(books);
    },
    async whenAUserAddBook(addBookCommand: AddBookCommand) {
      try {
        await addBookUseCase.handle(addBookCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    async whenAUserGetPublishedBooks() {
      try {
        books = await getAllPublishedBookUseCase.handle();
      } catch (err) {
        thrownError = err;
      }
    },
    thenBookShouldBe(expectedBook: Book) {
      const inDbBook = bookRepository.book.find(
        (b) => b.id === expectedBook.id,
      );
      expect(expectedBook.data).toEqual(inDbBook);
    },
    thenErrorShouldBe(expectedError: new () => Error) {
      expect(thrownError).toBeInstanceOf(expectedError);
    },
    thenBooksShouldBe(expectedBooks: Book[]) {
      expect(books).toEqual(expectedBooks);
    },
  };
};

export type BookFixture = ReturnType<typeof createBookFixture>;
