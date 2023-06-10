import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from '../public.decorator';
import { UpdateUserInfoDTO } from './dto/update-user-info.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.signup(createUserDTO);
  }

  @Patch('/avatar')
  async updateAvatar(@Req() req: any) {
    return this.userService.uploadAvatar(req);
  }

  @Get('/avatar')
  async getAvatar(@Req() req: any) {
    return this.userService.getAvatar(req);
  }

  @Patch('/')
  async updateInfo(@Req() req: any, @Body() body: UpdateUserInfoDTO) {
    return this.userService.updateInfo(req, body);
  }
}
