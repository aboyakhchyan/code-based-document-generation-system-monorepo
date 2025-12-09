import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyDto } from './dto/auth.dto';
import { Upload, User } from '@common/decorators/param';
import { FileValidationPipe } from '@common/pipes';
import { Request, Response } from 'express';
import { Auth } from '@common/decorators/method';
import { IUser } from './interface';
import { Verified } from '@common/decorators/method/verified.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Upload('picture')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(new FileValidationPipe({ isRequired: false }))
    picture: Express.Multer.File | undefined,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return await this.authService.register(res, registerDto, picture);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(res, loginDto);
  }

  @Post('logout')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response, @User() user: IUser) {
    return this.authService.logout(res, user.id as string);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Get('me')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@User() user: IUser) {
    return this.authService.getCurrentUser(user.id as string);
  }

  @Get('check-verification-access')
  @HttpCode(HttpStatus.OK)
  async checkVerificationAccess(@Req() req: Request) {
    return this.authService.checkVerificationAccess(req);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() verifyDto: VerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verify(res, verifyDto.code);
  }

  @Post('resend-verification-code')
  @HttpCode(HttpStatus.OK)
  async resendVerificationCode(@Req() req: Request) {
    return await this.authService.resendVerificationCode(req);
  }
}
