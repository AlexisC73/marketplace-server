import { DeleteBookUseCase } from '../application/usecases/delete-book.usecase';
import { Book } from '../domain/book';
import { InMemoryBookRepository } from '../infrastructure/in-memory-book.repository';
import { bookBuilder } from './bookBuilder';

describe('DeleteBookUseCase', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  it('should delete book', async () => {
    fixture.givenBookExists([bookBuilder().withId('1').build()]);
    await fixture.whenUserDeleteBook('1');
    fixture.thenBookShouldNotExist('1');
  });
});

const createFixture = () => {
  const bookRepository = new InMemoryBookRepository();

  const deleteBookUseCase = new DeleteBookUseCase(bookRepository);

  return {
    givenBookExists: (existingBooks: Book[]) => {
      bookRepository.givenBookExists(existingBooks);
    },
    whenUserDeleteBook: async (id: string) => {
      await deleteBookUseCase.handle(id);
    },
    thenBookShouldNotExist: (id: string) => {
      expect(bookRepository.getBookWithId(id)).toBeUndefined();
    },
  };
};

type Fixture = ReturnType<typeof createFixture>;
