import {
  AddBookCommand,
  AddBookUseCase,
} from '@app/good-place/application/usecases/book/add-book.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AddBookDTO } from './dto/add-book-dto';
import { createId } from '@paralleldrive/cuid2';
import { DeleteBookUseCase } from '@app/good-place/application/usecases/delete-book.usecase';

@Injectable()
export class BookService {
  constructor(
    private readonly addBookUseCase: AddBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
  ) {}

  async add(addBookDto: AddBookDTO, req: any) {
    const addBookCommand: AddBookCommand = {
      id: createId(),
      title: addBookDto.title,
      author: addBookDto.author,
      description: addBookDto.description,
      publicationDate: new Date(addBookDto.publicationDate),
      imageUrl: "obtenu après l'upload",
      price: addBookDto.price,
      seller: req?.user?.id,
    };
    try {
      await this.addBookUseCase.handle(addBookCommand);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async delete(id: string) {
    try {
      await this.deleteBookUseCase.handle(id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
