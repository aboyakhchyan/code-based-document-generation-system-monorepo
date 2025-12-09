import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { EmailVerificationPurpose, IUser, UserRole } from './interface';
import {
  generateRandomCode,
  hashPassword,
  isDev,
  verifyPassword,
} from '@common/utils';
import { EmailService, MulterService } from '@services';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IClientConfig, IJWT } from '@common/interfaces';
import { EmailVerificationRepository } from './email-verification.repository';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly JWT: IJWT;
  private readonly CLIENT_URI: string;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailVerificationRepository: EmailVerificationRepository,
    private readonly emailService: EmailService,
    private readonly multerService: MulterService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT = this.configService.getOrThrow<IJWT>('jwt');
    this.CLIENT_URI =
      this.configService.getOrThrow<IClientConfig>('CLIENT_URI')?.uri || '';
  }

  async register(
    res: Response,
    registerDto: RegisterDto,
    picture: Express.Multer.File | undefined,
  ) {
    const { email, password, role } = registerDto;

    if (role === UserRole.ADMIN) {
      throw new BadRequestException(
        'Admin role is not allowed for registration',
      );
    }

    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    let picturePath: string | null = null;

    if (picture) {
      picturePath = await this.multerService.save(picture, 'users');

      if (!picturePath) {
        throw new BadRequestException('Failed to save picture');
      }
    }

    let user: IUser | null = null;

    try {
      user = await this.authRepository.create({
        ...registerDto,
        password: hashedPassword,
        picture: picturePath,
      });

      const verificationCode = generateRandomCode(4);
      const expiredAt = new Date(Date.now() + 1000 * 60 * 5);

      await this.emailVerificationRepository.createOrUpdate(
        user.id as string,
        EmailVerificationPurpose.VERIFY,
        verificationCode,
        expiredAt,
      );

      await this.emailService.sendVerificationCode(
        user.email,
        verificationCode,
        user.fullName,
      );

      const verificationToken = await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: this.JWT.accessToken,
          expiresIn: '5m',
        },
      );

      this.setCookie(res, 'verificationToken', verificationToken, {
        maxAge: this.parseJwtTtlToMilliseconds('5m'),
      });

      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      if (picturePath) {
        await this.multerService.delete(picturePath);
      }
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Failed to create user',
      );
    }
  }

  async login(res: Response, loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    if (!user.isVerified) {
      const verificationCode = generateRandomCode(4);
      const expiredAt = new Date(Date.now() + 1000 * 60 * 5);

      await this.emailVerificationRepository.createOrUpdate(
        user.id as string,
        EmailVerificationPurpose.VERIFY,
        verificationCode,
        expiredAt,
      );

      await this.emailService.sendVerificationCode(
        user.email,
        verificationCode,
        user.fullName,
      );

      const verificationToken = await this.jwtService.signAsync(
        { id: user.id },
        {
          secret: this.JWT.accessToken,
          expiresIn: '5m',
        },
      );

      this.setCookie(res, 'verificationToken', verificationToken, {
        maxAge: this.parseJwtTtlToMilliseconds('5m'),
      });

      return {
        status: 'verification_required',
        redirectTo: `${this.CLIENT_URI}/verification`,
      };
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    const refreshTokenMaxAge = this.parseJwtTtlToMilliseconds(
      this.JWT.refreshTtl,
    );

    this.setCookie(res, 'refreshToken', refreshToken, {
      maxAge: refreshTokenMaxAge,
    });

    return {
      accessToken,
      user: { id: user.id },
    };
  }

  async logout(res: Response, id: string) {
    if (!id) {
      throw new NotFoundException('User not found');
    }

    this.deleteCookie(res, 'refreshToken');

    return { message: 'Logged out successfully' };
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let decoded: { id: string };

    try {
      decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.JWT.refreshToken,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.authRepository.findOne(decoded.id);

    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.generateAccessToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    const refreshTokenMaxAge = this.parseJwtTtlToMilliseconds(
      this.JWT.refreshTtl,
    );

    this.setCookie(res, 'refreshToken', newRefreshToken, {
      maxAge: refreshTokenMaxAge,
    });

    return {
      accessToken: newAccessToken,
    };
  }

  async verify(res: Response, code: string) {
    if (!code) {
      throw new BadRequestException('Verification code is required');
    }

    const verification =
      await this.emailVerificationRepository.findByCodeAndPurpose(
        code,
        EmailVerificationPurpose.VERIFY,
      );

    if (!verification) {
      throw new BadRequestException('Invalid verification code');
    }

    const now = new Date();
    const expiredAt = new Date(
      (verification as any).expiredAt || verification.expiredAt,
    );

    if (now > expiredAt) {
      throw new BadRequestException('Verification code has expired');
    }

    const user = await this.authRepository.findOne(verification.userId);

    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    await (this.authRepository as any).update(user.id, {
      isVerified: true,
    });

    await this.emailVerificationRepository.deleteByUserIdAndPurpose(
      user.id,
      EmailVerificationPurpose.VERIFY,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user.id),
      this.generateRefreshToken(user.id),
    ]);

    const refreshTokenMaxAge = this.parseJwtTtlToMilliseconds(
      this.JWT.refreshTtl,
    );

    this.setCookie(res, 'refreshToken', refreshToken, {
      maxAge: refreshTokenMaxAge,
    });

    this.deleteCookie(res, 'verificationToken');

    return {
      accessToken,
      user: { id: user.id },
    };
  }

  async getCurrentUser(id: string) {
    const user = await this.authRepository.findCurrentUser(id);

    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    const { password: _, subscription, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      isSubscribed:
        subscription && subscription.status === SubscriptionStatus.active
          ? true
          : false,
    };
  }

  async checkVerificationAccess(req: Request) {
    const verificationToken = req.cookies['verificationToken'];

    if (!verificationToken) {
      return { canAccess: false };
    }

    try {
      const decoded = await this.jwtService.verifyAsync(verificationToken, {
        secret: this.JWT.accessToken,
      });

      if (!decoded || !decoded.id) {
        return { canAccess: false };
      }

      const user = await this.authRepository.findOne(decoded.id);

      if (!user || !user.id || user.isVerified) {
        return { canAccess: false };
      }

      const verification =
        await this.emailVerificationRepository.findByUserIdAndPurpose(
          user.id,
          EmailVerificationPurpose.VERIFY,
        );

      if (!verification) {
        return { canAccess: false };
      }

      const now = new Date();
      const expiredAt = new Date(verification.expiredAt);

      if (now > expiredAt) {
        return { canAccess: false };
      }

      const remainingTime = Math.max(
        0,
        Math.floor((expiredAt.getTime() - now.getTime()) / 1000),
      );

      return { canAccess: true, userId: user.id, remainingTime };
    } catch (error) {
      return { canAccess: false };
    }
  }

  async resendVerificationCode(req: Request) {
    const verificationToken =
      req.cookies['verificationToken'] ||
      (req.headers['x-verification-token'] as string);

    if (!verificationToken) {
      throw new BadRequestException('Verification token is required');
    }

    const decoded = await this.jwtService.verifyAsync(verificationToken, {
      secret: this.JWT.accessToken,
    });

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.authRepository.findOne(decoded.id);

    if (!user || !user.id) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    const verificationCode = generateRandomCode(4);
    const expiredAt = new Date(Date.now() + 1000 * 60 * 5);

    await this.emailVerificationRepository.createOrUpdate(
      user.id,
      EmailVerificationPurpose.VERIFY,
      verificationCode,
      expiredAt,
    );

    await this.emailService.sendVerificationCode(
      user.email,
      verificationCode,
      user.fullName,
    );

    return { message: 'Verification code resent successfully' };
  }

  private setCookie = (
    res: Response,
    name: string,
    token: string,
    options: CookieOptions,
  ) => {
    res.cookie(name, token, {
      httpOnly: true,
      secure: !isDev(this.configService),
      sameSite: 'lax',
      ...options,
    });
  };

  private deleteCookie = (res: Response, name: string) => {
    res.cookie(name, '', {
      httpOnly: true,
      secure: !isDev(this.configService),
      sameSite: 'lax',
    });
  };

  private generateAccessToken = (id: string) => {
    return this.jwtService.signAsync(
      { id },
      { secret: this.JWT.accessToken, expiresIn: this.JWT.accessTtl },
    );
  };

  private generateRefreshToken = (id: string) => {
    return this.jwtService.signAsync(
      { id },
      { secret: this.JWT.refreshToken, expiresIn: this.JWT.refreshTtl },
    );
  };

  private parseJwtTtlToMilliseconds(ttl: string | number): number {
    if (typeof ttl === 'number') {
      return ttl * 1000;
    }

    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * (multipliers[unit] || 1000);
  }
}
