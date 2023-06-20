import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../book.repository';

@Injectable()
export class GetForSaleBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  async handle(getForSaleBookCommand: GetForSaleBookCommand) {
    const book = await this.bookRepository.getBookById(
      getForSaleBookCommand.bookId,
    );

    if (book.status !== 'FOR_SALE') {
      return null;
    }
    return book;
  }
}

export type GetForSaleBookCommand = {
  bookId: string;
};
