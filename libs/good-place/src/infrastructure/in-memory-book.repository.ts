import { BookRepository } from '../application/book.repository';
import { Book } from '../domain/book';

export class InMemoryBookRepository implements BookRepository {
  book: Book['data'][] = [];

  async addBook(book: Book): Promise<void> {
    this.save(book);
    return Promise.resolve();
  }

  async deleteBookById(id: string): Promise<void> {
    this.book = this.book.filter((book) => book.id !== id);
    return Promise.resolve();
  }

  async getBookById(id: string): Promise<Book | undefined> {
    const fundBook = this.book.find((book) => book.id === id);
    if (!fundBook) {
      return undefined;
    }
    return Book.fromData(fundBook);
  }

  private save(book: Book): void {
    this.book = [...this.book, book.data];
  }

  givenBookExists(existingBooks: Book[]) {
    existingBooks.forEach(this.save.bind(this));
  }
}
