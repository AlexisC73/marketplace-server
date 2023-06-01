import { Book } from '../domain/book';

export interface BookRepository {
  addBook(book: Book): Promise<void>;
}
