import {
  AddBookCommand,
  AddBookUseCase,
} from '../application/usecases/add-book.usecase';
import { Book } from '../domain/book';
import { InMemoryBookRepository } from '../infrastructure/in-memory-book.repository';
import { StubDateProvider } from '../infrastructure/stub-date.provider';
import { bookBuilder } from './bookBuilder';

describe('AddBookUseCase', () => {
  let fixture: Fixture;
  beforeEach(() => {
    fixture = createFixture();
  });

  it('should add a book', async () => {
    fixture.givenNowIs(new Date('2023-06-01T12:00:00Z'));

    await fixture.whenAUserAddBook({
      id: 'book-id',
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      price: 10,
      publicationDate: new Date('1954-07-29T12:00:00Z'),
      description: 'Description of the book',
      imageUrl: 'http://testurl.com/',
      seller: 'Alice',
    });

    fixture.thenBookShouldBe(
      bookBuilder()
        .withId('book-id')
        .withTitle('The Lord of the Rings')
        .withAuthor('J. R. R. Tolkien')
        .withPrice(10)
        .withPublicationDate(new Date('1954-07-29T12:00:00Z'))
        .withDescription('Description of the book')
        .withImageUrl('http://testurl.com/')
        .withSeller('Alice')
        .withPublished(false)
        .withCreatedAt(new Date('2023-06-01T12:00:00Z'))
        .build(),
    );
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
      const inDbBook = bookRepository.book.find(
        (b) => b.id === expectedBook.id,
      );
      expect(expectedBook).toEqual(inDbBook);
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
