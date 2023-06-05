import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
