import {
  IsString,
  Length,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class AddBookDTO {
  @IsString()
  @Length(1, 50)
  title: string;

  @IsString()
  @Length(1, 50)
  author: string;

  @IsString()
  @Length(10, 1000)
  description: string;

  @IsDateString({
    strictSeparator: true,
  })
  publicationDate: string;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @IsNotEmpty()
  price: number;
}
