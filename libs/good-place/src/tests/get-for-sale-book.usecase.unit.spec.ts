import { BookStatus } from '../domain/entity/book';
import { bookBuilder } from './bookBuilder';
import { createBookFixture } from './bookFixture';

describe('GetForSaleBookUseCase', () => {
  const bookFixture = createBookFixture();
  test('should return the searched book', async () => {
    bookFixture.givenBooksExist([
      bookBuilder()
        .withId('123')
        .withStatus(BookStatus.FOR_SALE)
        .withTitle('Test de livre')
        .build(),
    ]);

    await bookFixture.whenGetAForSaleBook({
      bookId: '123',
    });

    bookFixture.thenReturnBookShouldBe(
      bookBuilder()
        .withId('123')
        .withStatus(BookStatus.FOR_SALE)
        .withTitle('Test de livre')
        .build(),
    );
  });
});
