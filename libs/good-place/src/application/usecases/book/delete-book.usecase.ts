import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../book.repository';

@Injectable()
export class DeleteBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async handle(id: string) {
    //TODO: ajouter la logique de suppression si owner.
    const existingBook = await this.bookRepository.getBookById(id);
    if (!existingBook) {
      return Promise.resolve();
    }
    await this.bookRepository.deleteBookById(id);
  }
}
