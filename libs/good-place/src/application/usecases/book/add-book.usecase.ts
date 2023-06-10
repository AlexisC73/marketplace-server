import { Book } from '../../../domain/book';
import { BookRepository } from '../../book.repository';
import { DateProvider } from '../../date.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(addBookCommand: AddBookCommand): Promise<void> {
    const book: Book = Book.fromData({
      id: addBookCommand.id,
      title: addBookCommand.title,
      author: addBookCommand.author,
      price: addBookCommand.price,
      publicationDate: addBookCommand.publicationDate,
      seller: addBookCommand.seller,
      description: addBookCommand.description,
      imageUrl: addBookCommand.imageUrl,
      createdAt: this.dateProvider.getNow(),
      published: false,
    });
    return this.bookRepository.addBook(book);
  }
}

export type AddBookCommand = {
  id: string;
  title: string;
  author: string;
  price: number;
  publicationDate: Date;
  imageUrl: string;
  description: string;
  seller: string;
};
