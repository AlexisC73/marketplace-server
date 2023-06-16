import { Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(@Req() req: any) {
    return this.bookService.add(req);
  }

  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
