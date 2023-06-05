import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from 'src/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    await this.userService.signup(createUserDTO);
  }
}
