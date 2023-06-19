import { Book } from '../domain/entity/book';
import { Role } from '../domain/entity/user';
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
      fileRepository: userFixture.fileRepository,
    });
  });

  describe('when a user add a book to sell', () => {
    test('user can add a book to sell', async () => {
      const user = userBuilder()
        .withName('Alice')
        .withRole(Role.SELLER)
        .build();
      const now = new Date('2020-01-01T00:00:00.000Z');

      userFixture.givenUserExist([user]);
      bookFixture.givenNowIs(now);

      await bookFixture.whenAUserAddBook({
        author: 'author',
        description: 'description',
        id: 'test-id',
        price: 1000,
        seller: user.id,
        title: 'title',
        publicationDate: new Date('2019-01-01T00:00:00.000Z'),
        file: {
          image: Buffer.from('image'),
          mimetype: 'image/png',
          name: 'test.png',
        },
      });

      bookFixture.thenBookShouldBe(
        Book.fromData({
          id: 'test-id',
          title: 'title',
          author: 'author',
          price: 1000,
          publicationDate: new Date('2019-01-01T00:00:00.000Z'),
          seller: user.id,
          description: 'description',
          imageUrl: `book/${now.getTime().toString()}-test.png`,
          createdAt: now,
          published: true, //TODO: remettre sur false une fois la possibilité pour les admin de verifier les livres ajoutés.
        }),
      );
    });
  });
});
