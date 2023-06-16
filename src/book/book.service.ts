import {
  AddBookCommand,
  AddBookUseCase,
} from '@app/good-place/application/usecases/book/add-book.usecase';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { DeleteBookUseCase } from '@app/good-place/application/usecases/book/delete-book.usecase';
import { createId } from '@paralleldrive/cuid2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookService {
  constructor(
    private readonly addBookUseCase: AddBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
    private readonly configService: ConfigService,
  ) {}

  async add(req: any) {
    try {
      const body = req.body;
      const { title, description, publicationDate, price, author } = body;
      const image = req.body.file[0];
      const extension = image.filename.split('.').pop();
      const addBookCommand: AddBookCommand = {
        id: createId(),
        title,
        description,
        publicationDate,
        price: Number(price),
        author,
        file: {
          name: req.user.id + '.' + extension,
          mimetype: image.mimetype,
          image: image.data,
          saveDirectory: this.configService.get('DEFAULT_BOOK_IMAGE_DIRECTORY'),
        },
        seller: req.user.id,
      };

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
