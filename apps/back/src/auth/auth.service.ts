import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(registerDto: RegisterDto) {}
}
