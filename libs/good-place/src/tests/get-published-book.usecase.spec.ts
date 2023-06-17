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
        .withPublished(true)
        .build(),
    ];

    const notPublishedBooks = [
      bookBuilder()
        .withId('124')
        .withTitle('test-title2')
        .withPublished(false)
        .build(),
    ];
    bookFixture.givenBooksExist([...publishedBooks, ...notPublishedBooks]);

    await bookFixture.whenAUserGetPublishedBooks();

    bookFixture.thenBooksShouldBe(publishedBooks);
  });
});
