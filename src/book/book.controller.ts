import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AddBookDTO } from './dto/add-book-dto';
import { AuthGuard } from 'src/auth.guard';

@Controller('/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(@Body() addBookDTO: AddBookDTO) {
    return this.bookService.add(addBookDTO);
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteBook(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
