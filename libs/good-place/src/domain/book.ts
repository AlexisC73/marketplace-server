export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  publicationDate: Date;
  description: string;
  createdAt: Date;
  published: boolean;
  seller: string;
}
