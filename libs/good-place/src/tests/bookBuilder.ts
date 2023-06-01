import { Book } from '../domain/book';

export const bookBuilder = ({
  id = 'testing id',
  title = 'testing title',
  author = 'testing author',
  price = 0.5,
  publicationDate = new Date('2023-06-01T12:00:00Z'),
  description = 'testing description',
  createdAt = new Date('2021-06-01T12:00:00Z'),
  imageUrl = 'testing url',
  owner = 'testing owner',
  published = false,
}: {
  id?: string;
  title?: string;
  author?: string;
  price?: number;
  publicationDate?: Date;
  description?: string;
  createdAt?: Date;
  imageUrl?: string;
  owner?: string;
  published?: boolean;
} = {}) => {
  const props: Book = {
    id,
    title,
    author,
    price,
    publicationDate,
    description,
    createdAt,
    imageUrl,
    owner,
    published,
  };
  return {
    withId: (id: string) => bookBuilder({ ...props, id }),
    withTitle: (title: string) => bookBuilder({ ...props, title }),
    withAuthor: (author: string) => bookBuilder({ ...props, author }),
    withPrice: (price: number) => bookBuilder({ ...props, price }),
    withPublicationDate: (publicationDate: Date) =>
      bookBuilder({ ...props, publicationDate }),
    withDescription: (description: string) =>
      bookBuilder({ ...props, description }),
    withCreatedAt: (createdAt: Date) => bookBuilder({ ...props, createdAt }),
    withImageUrl: (imageUrl: string) => bookBuilder({ ...props, imageUrl }),
    withOwner: (owner: string) => bookBuilder({ ...props, owner }),
    withPublished: (published: boolean) => bookBuilder({ ...props, published }),
    build: (): Book => props,
  };
};
