import { Injectable } from '@nestjs/common';
import { BookRepository } from '../application/book.repository';
import { Book } from '../domain/book';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaBookRepository implements BookRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async addBook(book: Book): Promise<void> {
    await this.prisma.book.create({
      data: {
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.imageUrl,
        publicationDate: book.publicationDate,
        description: book.description,
        published: book.published,
        seller: book.seller,
        createdAt: book.createdAt,
      },
    });
    return Promise.resolve();
  }

  async deleteBookById(id: string): Promise<void> {
    await this.prisma.book.delete({
      where: {
        id: id,
      },
    });
    return Promise.resolve();
  }

  async getBookById(id: string): Promise<Book> {
    return this.prisma.book.findUnique({
      where: {
        id,
      },
    });
  }
}
