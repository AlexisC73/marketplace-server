import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Public } from '../public.decorator';
import { UpdateUserInfoDTO } from './dto/update-user-info.dto';
import { UpdateUserPasswordDTO } from './dto/update-user-password.dto';
import { CreateSellerDTO } from './dto/create-seller.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup/client')
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

  @Patch('/password')
  async updatePassword(@Req() req: any, @Body() body: UpdateUserPasswordDTO) {
    return this.userService.updatePassword(req, body);
  }

  @Delete('/avatar')
  async deleteAvatar(@Req() req: any) {
    return this.userService.deleteAvatar(req);
  }

  @Public()
  @Post('/signup/seller')
  async signupSeller(@Body() createSellerDTO: CreateSellerDTO) {
    return this.userService.signupSeller(createSellerDTO);
  }
}
