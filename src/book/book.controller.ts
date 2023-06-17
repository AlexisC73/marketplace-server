import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Public } from 'src/public.decorator';

@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(@Req() req: any) {
    return this.bookService.add(req);
  }

  @Public()
  @Get()
  async getPublishedBooks() {
    return this.bookService.getPublishedBooks();
  }

  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
