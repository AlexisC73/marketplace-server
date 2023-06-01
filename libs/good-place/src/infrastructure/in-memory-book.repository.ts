import { Book } from '../domain/book';

export class InMemoryBookRepository {
  book: Book[] = [];

  async addBook(book: Book): Promise<void> {
    this.book = [...this.book, book];
    return Promise.resolve();
  }

  getBookWithId(id: string): Book {
    return this.book.find((book) => book.id === id);
  }
}
