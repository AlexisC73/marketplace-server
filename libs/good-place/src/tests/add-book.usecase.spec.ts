import {
  AddBookCommand,
  AddBookUseCase,
} from '../application/usecases/add-book.usecase';
import { Book } from '../domain/book';
import { InMemoryBookRepository } from '../infrastructure/in-memory-book.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';

describe('AddBookUseCase', () => {
  let fixture: Fixture;
  beforeEach(() => {
    fixture = createFixture();
  });

  it('should add a book', async () => {
    fixture.givenNowIs(new Date('2023-06-01T12:00:00Z'));

    await fixture.whenAUserAddBook({
      id: 'testing-id',
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      price: 10,
      publicationDate: new Date('1954-07-29T12:00:00Z'),
      description: 'Description of the book',
      imageUrl: 'testing-url',
      owner: 'testing-owner',
    });

    fixture.thenBookShouldBe({
      id: 'testing-id',
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      price: 10,
      publicationDate: new Date('1954-07-29T12:00:00Z'),
      description: 'Description of the book',
      createdAt: new Date('2023-06-01T12:00:00Z'),
      imageUrl: 'testing-url',
      owner: 'testing-owner',
      published: false,
    });
  });
});

const createFixture = () => {
  const bookRepository = new InMemoryBookRepository();
  const dateProvider = new StubDateProvider();
  const addBookUseCase = new AddBookUseCase(bookRepository, dateProvider);
  return {
    givenNowIs: (_now: Date) => {
      dateProvider.now = _now;
    },
    async whenAUserAddBook(addBookCommand: AddBookCommand) {
      return addBookUseCase.handle(addBookCommand);
    },
    thenBookShouldBe(expectedBook: Book) {
      const inDbBook = bookRepository.getBookWithId(expectedBook.id);
      expect(expectedBook).toEqual(inDbBook);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
