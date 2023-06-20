import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { Public } from 'src/public.decorator';
import { Book } from '@app/good-place/domain/entity/book';

@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(@Req() req: any) {
    return this.bookService.add(req);
  }

  @Public()
  @Get()
  async getPublishedBooks(): Promise<Book['data'][]> {
    return this.bookService.getPublishedBooks();
  }

  @Public()
  @Get('/:id')
  async getForSaleBook(@Param('id') id: string): Promise<Book['data']> {
    return this.bookService.getForSaleBook(id);
  }

  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
