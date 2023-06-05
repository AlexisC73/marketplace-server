import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDTO } from './dto/signin-user.dto';
import { Public } from 'src/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Public()
  @Post('signin')
  async signin(@Body() signinUserDTO: SignInUserDTO) {
    return await this.authService.login(signinUserDTO);
  }
}
