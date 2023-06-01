import { Book } from '../domain/book';

export abstract class BookRepository {
  abstract addBook(book: Book): Promise<void>;
}
