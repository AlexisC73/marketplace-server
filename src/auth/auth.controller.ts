import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDTO } from './dto/signin-user.dto';
import { Public } from '../public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Public()
  @Post('signin/client')
  async signinClient(@Body() signinUserDTO: SignInUserDTO) {
    return await this.authService.signinClient(signinUserDTO);
  }

  @HttpCode(200)
  @Public()
  @Post('signin/seller')
  async signinSeller(@Body() signinUserDTO: SignInUserDTO) {
    return await this.authService.signinSeller(signinUserDTO);
  }
}
