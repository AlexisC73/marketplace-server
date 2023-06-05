import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { BookService } from './book.service';
import { AddBookDTO } from './dto/add-book-dto';
import { FastifyRequest } from 'fastify';

@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(@Body() addBookDTO: AddBookDTO, @Req() req: FastifyRequest) {
    return this.bookService.add(addBookDTO, req);
  }

  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
