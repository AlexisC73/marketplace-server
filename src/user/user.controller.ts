import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from 'src/public.decorator';
import { SavedMultipartFile } from '@fastify/multipart';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    await this.userService.signup(createUserDTO);
  }

  @Post('/upload')
  async upload(@Req() req: any) {
    this.userService.uploadAvatar(req);
  }
}
