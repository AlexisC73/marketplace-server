import { FileRepository } from '../application/file.repository';
import {
  AddBookCommand,
  AddBookUseCase,
} from '../application/usecases/book/add-book.usecase';
import {
  GetForSaleBookCommand,
  GetForSaleBookUseCase,
} from '../application/usecases/book/get-for-sale-book.usecase';
import { GetForSaleBooksUseCase } from '../application/usecases/book/get-published-book.usecase';
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
  const getForSaleBooksUseCase = new GetForSaleBooksUseCase(bookRepository);
  const getForSaleBookUseCase = new GetForSaleBookUseCase(bookRepository);

  let books: Book[] = [];
  let book: Book;

  let thrownError: Error | undefined;

  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
    },
    givenBooksExist(books: Book[]) {
      bookRepository.givenBookExists(books);
    },
    async whenGetAForSaleBook(getForSaleBookCommand: GetForSaleBookCommand) {
      book = await getForSaleBookUseCase.handle(getForSaleBookCommand);
    },
    async whenAUserAddBook(addBookCommand: AddBookCommand) {
      try {
        await addBookUseCase.handle(addBookCommand);
      } catch (err) {
        thrownError = err;
      }
    },
    async whenAUserGetForSaleBooks() {
      try {
        books = await getForSaleBooksUseCase.handle();
      } catch (err) {
        thrownError = err;
      }
    },
    thenReturnBookShouldBe(expectedBook: Book) {
      expect(book).toEqual(expectedBook);
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
    thenReturnBooksShouldBe(expectedBooks: Book[]) {
      expect(books).toEqual(expectedBooks);
    },
  };
};

export type BookFixture = ReturnType<typeof createBookFixture>;
