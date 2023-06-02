export class Book {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _author: string,
    private readonly _price: number,
    private readonly _imageUrl: string,
    private readonly _publicationDate: Date,
    private readonly _description: string,
    private readonly _createdAt: Date,
    private readonly _published: boolean,
    private readonly _seller: string,
  ) {}

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  get price(): number {
    return this._price;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get publicationDate(): Date {
    return this._publicationDate;
  }

  get description(): string {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get published(): boolean {
    return this._published;
  }

  get seller(): string {
    return this._seller;
  }

  get data() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      price: this.price,
      imageUrl: this.imageUrl,
      publicationDate: this.publicationDate,
      description: this.description,
      createdAt: this.createdAt,
      published: this.published,
      seller: this.seller,
    };
  }

  static fromData(data: Book['data']) {
    return new Book(
      data.id,
      data.title,
      data.author,
      data.price,
      data.imageUrl,
      data.publicationDate,
      data.description,
      data.createdAt,
      data.published,
      data.seller,
    );
  }
}
