import { NoPrivilegeGranted } from '../application/usecases/error/error';
import { Role } from '../domain/user';
import { bookBuilder } from './bookBuilder';
import { BookFixture, createBookFixture } from './bookFixture';
import { userBuilder } from './userBuilder';
import { UserFixture, createUserFixture } from './userFixture';

describe('AddBookUseCase', () => {
  let userFixture: UserFixture;
  let bookFixture: BookFixture;
  beforeEach(() => {
    userFixture = createUserFixture();
    bookFixture = createBookFixture({
      userRepository: userFixture.userRepository,
    });
  });

  it('should add a book', async () => {
    bookFixture.givenNowIs(new Date('2023-06-01T12:00:00Z'));
    userFixture.givenUserExist([
      userBuilder()
        .withName('Alice')
        .withId('alice-seller-id')
        .withRole(Role.SELLER)
        .build(),
    ]);

    await bookFixture.whenAUserAddBook({
      id: 'book-id',
      title: 'The Lord of the Rings',
      author: 'J. R. R. Tolkien',
      price: 10,
      publicationDate: new Date('1954-07-29T12:00:00Z'),
      description: 'Description of the book',
      imageUrl: 'http://testurl.com/',
      seller: 'alice-seller-id',
    });

    bookFixture.thenBookShouldBe(
      bookBuilder()
        .withId('book-id')
        .withTitle('The Lord of the Rings')
        .withAuthor('J. R. R. Tolkien')
        .withPrice(10)
        .withPublicationDate(new Date('1954-07-29T12:00:00Z'))
        .withDescription('Description of the book')
        .withImageUrl('http://testurl.com/')
        .withSeller('alice-seller-id')
        .withPublished(false)
        .withCreatedAt(new Date('2023-06-01T12:00:00Z'))
        .build(),
    );
  });

  describe('RULE: Only seller user can add a book', () => {
    it('should add a book', async () => {
      bookFixture.givenNowIs(new Date('2023-06-01T12:00:00Z'));
      userFixture.givenUserExist([
        userBuilder()
          .withName('Alice')
          .withId('alice-seller-id')
          .withRole(Role.CLIENT)
          .build(),
      ]);

      await bookFixture.whenAUserAddBook({
        id: 'book-id',
        title: 'The Lord of the Rings',
        author: 'J. R. R. Tolkien',
        price: 10,
        publicationDate: new Date('1954-07-29T12:00:00Z'),
        description: 'Description of the book',
        imageUrl: 'http://testurl.com/',
        seller: 'alice-seller-id',
      });

      bookFixture.thenErrorShouldBe(NoPrivilegeGranted);
    });
  });
});
