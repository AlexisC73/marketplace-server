import {
  AddBookCommand,
  AddBookUseCase,
} from '@app/good-place/application/usecases/book/add-book.usecase';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteBookUseCase } from '@app/good-place/application/usecases/book/delete-book.usecase';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class BookService {
  constructor(
    private readonly addBookUseCase: AddBookUseCase,
    private readonly deleteBookUseCase: DeleteBookUseCase,
  ) {}

  async add(req: any) {
    try {
      const body = await req.body;
      const postId = createId();
      const { title, description, publicationDate, price, author } = body;
      const image = req.body.image[0];
      const extension = image.filename.split('.').pop();
      const addBookCommand: AddBookCommand = {
        id: postId,
        title,
        description,
        publicationDate: new Date(publicationDate),
        price: Number(price),
        author,
        file: {
          name: postId + '.' + extension,
          mimetype: image.mimetype,
          image: image.data,
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
