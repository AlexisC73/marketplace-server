import { Book } from '@app/good-place/domain/entity/book';
import { BookRepository } from '../../book.repository';

export class GetPublishedBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  async handle(): Promise<Book[]> {
    return this.bookRepository.getPublishedBook();
  }
}
