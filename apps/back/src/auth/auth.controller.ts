import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login() {
    return 1
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return 1
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh() {
    return 1
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify() {
    return 1
  }
}
