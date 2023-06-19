import { Injectable } from '@nestjs/common';
import { BookRepository } from '../application/book.repository';
import { Book, BookStatus } from '../domain/entity/book';
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
        status: book.status,
        seller: {
          connect: {
            id: book.seller,
          },
        },
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

  async getBookById(id: string): Promise<Book | undefined> {
    const fundBook = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!fundBook) return Promise.resolve(undefined);

    return Book.fromData({
      id: fundBook.id,
      title: fundBook.title,
      author: fundBook.author,
      price: fundBook.price,
      imageUrl: fundBook.imageUrl,
      publicationDate: fundBook.publicationDate,
      description: fundBook.description,
      seller: fundBook.sellerId,
      createdAt: fundBook.createdAt,
      status: BookStatus[fundBook.status],
    });
  }

  async getForSaleBooks(): Promise<Book[]> {
    const fundBooks = await this.prisma.book.findMany({
      where: {
        status: BookStatus.FOR_SALE,
      },
    });
    return fundBooks.map((book) =>
      Book.fromData({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        imageUrl: book.imageUrl,
        publicationDate: book.publicationDate,
        description: book.description,
        status: BookStatus[book.status],
        seller: book.sellerId,
        createdAt: book.createdAt,
      }),
    );
  }
}
