import { BookRepository } from '../book.repository';

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async handle(id: string) {
    //TODO: ajouter la logique de suppression si owner.
    await this.bookRepository.deleteBookById(id);
  }
}
