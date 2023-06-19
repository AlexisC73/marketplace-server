import { Book } from '../domain/entity/book';

export abstract class BookRepository {
  abstract addBook(book: Book): Promise<void>;
  abstract deleteBookById(id: string): Promise<void>;
  abstract getBookById(id: string): Promise<Book | undefined>;
  abstract getForSaleBooks(): Promise<Book[]>;
}
