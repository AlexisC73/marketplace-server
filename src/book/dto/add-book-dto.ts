import {
  IsString,
  Length,
  IsDateString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class AddBookDTO {
  @IsString()
  @Length(3, 30)
  title: string;

  @IsString()
  @Length(1, 30)
  author: string;

  @IsString()
  @Length(1, 1000)
  description: string;

  @IsDateString()
  publicationDate: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
