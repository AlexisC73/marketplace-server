import {
  AddBookCommand,
  AddBookUseCase,
} from '@app/good-place/application/usecases/add-book.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddBookDTO } from './dto/add-book-dto';
import { createId, isCuid } from '@paralleldrive/cuid2';

@Injectable()
export class BookService {
  constructor(private readonly addBookUseCase: AddBookUseCase) {}

  async add(addBookDto: AddBookDTO) {
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
    try {
      await this.addBookUseCase.handle(addBookCommand);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
