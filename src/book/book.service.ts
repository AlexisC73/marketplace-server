import {
  AddBookCommand,
  AddBookUseCase,
} from '@app/good-place/application/usecases/add-book.usecase';
import { Injectable } from '@nestjs/common';
import { AddBookDTO } from './dto/add-book-dto';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class BookService {
  constructor(private readonly addBookUseCase: AddBookUseCase) {}

  async addBook(addBookDto: AddBookDTO) {
    const addBookCommand: AddBookCommand = {
      id: createId(),
      title: addBookDto.title,
      author: addBookDto.author,
      description: addBookDto.description,
      publicationDate: new Date(addBookDto.publicationDate),
      imageUrl: "obtenu après l'upload",
      price: addBookDto.price,
      seller: 'Recuperer depuis le guard plus tard',
    };
    await this.addBookUseCase.handle(addBookCommand);
    return Promise.resolve();
  }
}
