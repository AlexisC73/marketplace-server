import {
  AddBookCommand,
  AddBookUseCase,
} from '../application/usecases/book/add-book.usecase';
import { Book } from '../domain/book';
import { InMemoryBookRepository } from '../infrastructure/in-memory-book.repository';
import { InMemoryUserRepository } from '../infrastructure/in-memory-user.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';

export const createBookFixture = ({
  userRepository = new InMemoryUserRepository(),
}: { userRepository?: any } = {}) => {
  const bookRepository = new InMemoryBookRepository();
  const dateProvider = new StubDateProvider();
  const addBookUseCase = new AddBookUseCase(
    bookRepository,
    userRepository,
    dateProvider,
  );
  let thrownError: Error | undefined;

  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
    },
    async whenAUserAddBook(addBookCommand: AddBookCommand) {
      try {
        await addBookUseCase.handle(addBookCommand);
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
  };
};

export type BookFixture = ReturnType<typeof createBookFixture>;
