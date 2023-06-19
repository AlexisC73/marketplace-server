import { BookStatus } from '../domain/entity/book';
import { bookBuilder } from './bookBuilder';
import { BookFixture, createBookFixture } from './bookFixture';

describe('GetPublishedBookUseCase', () => {
  let bookFixture: BookFixture;

  beforeEach(() => {
    bookFixture = createBookFixture();
  });

  test('a user can get all published books', async () => {
    const publishedBooks = [
      bookBuilder()
        .withId('123')
        .withTitle('test-title')
        .withStatus(BookStatus.FOR_SALE)
        .build(),
    ];

    const notPublishedBooks = [
      bookBuilder()
        .withId('124')
        .withTitle('test-title2')
        .withStatus(BookStatus.PENDING_VALIDATION)
        .build(),
    ];
    bookFixture.givenBooksExist([...publishedBooks, ...notPublishedBooks]);

    await bookFixture.whenAUserGetForSaleBooks();

    bookFixture.thenBooksShouldBe(publishedBooks);
  });
});
