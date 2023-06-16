import { Book } from '../../../domain/book';
import { BookRepository } from '../../book.repository';
import { DateProvider } from '../../date.provider';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { Role } from '@app/good-place/domain/user';
import { NoPrivilegeGranted } from '../error/error';

@Injectable()
export class AddBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
  ) {}

  async handle(addBookCommand: AddBookCommand): Promise<void> {
    const seller = await this.userRepository.findOneById(addBookCommand.seller);
    if (seller.role !== Role.SELLER) {
      throw new NoPrivilegeGranted();
    }
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
