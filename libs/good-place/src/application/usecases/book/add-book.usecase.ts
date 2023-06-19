import { Book } from '../../../domain/entity/book';
import { BookRepository } from '../../book.repository';
import { DateProvider } from '../../date.provider';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user.repository';
import { Role } from '@app/good-place/domain/entity/user';
import { NoPrivilegeGranted } from '../error/error';
import { FileRepository } from '../../file.repository';

@Injectable()
export class AddBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly dateProvider: DateProvider,
    private readonly fileRepository: FileRepository,
  ) {}

  async handle(addBookCommand: AddBookCommand): Promise<void> {
    const acceptedMimetypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!acceptedMimetypes.includes(addBookCommand.file.mimetype)) {
      throw new Error('Only jpeg, jpg, png are accepted.');
    }
    const seller = await this.userRepository.findOneById(addBookCommand.seller);
    if (seller.role !== Role.SELLER) {
      throw new NoPrivilegeGranted("You are not seller, you can't add book.");
    }

    const savedUrl = await this.fileRepository.save({
      file: addBookCommand.file.image,
      fileName:
        this.dateProvider.getNow().getTime().toString() +
        '-' +
        addBookCommand.file.name,
      saveDirectory: process.env.DEFAULT_BOOK_IMAGE_DIRECTORY ?? 'book',
      mimetype: addBookCommand.file.mimetype,
    });

    const book: Book = Book.fromData({
      id: addBookCommand.id,
      title: addBookCommand.title,
      author: addBookCommand.author,
      price: addBookCommand.price,
      publicationDate: addBookCommand.publicationDate,
      seller: addBookCommand.seller,
      description: addBookCommand.description,
      imageUrl: savedUrl,
      createdAt: this.dateProvider.getNow(),
      published: true,
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
  description: string;
  seller: string;
  file: {
    name: string;
    mimetype: string;
    image: Buffer;
  };
};
