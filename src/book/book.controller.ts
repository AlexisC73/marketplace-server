import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AddBookDTO } from './dto/add-book-dto';

@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(@Body() addBookDTO: AddBookDTO) {
    try {
      await this.bookService.addBook(addBookDTO);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}