import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { EmailVerificationRepository } from './email-verification.repository';
import { EmailService, MulterService } from '@services';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
  EmailVerificationPurpose,
  Gender,
  IEmailVerification,
  IUser,
  UserRole,
} from './interface';
import { hashPassword, verifyPassword } from '@common/utils';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let emailVerificationRepository: jest.Mocked<EmailVerificationRepository>;
  let emailService: jest.Mocked<EmailService>;
  let multerService: jest.Mocked<MulterService>;
  let configService: jest.Mocked<ConfigService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockJWT = {
    accessToken: 'access-secret',
    refreshToken: 'refresh-secret',
    accessTtl: '15m',
    refreshTtl: '7d',
  };

  const mockRegisterDto: RegisterDto = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
    age: 25,
    gender: Gender.MALE,
    role: UserRole.USER,
    phone: '1234567890',
  };

  const mockUser: IUser = {
    id: 1 as number,
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    age: 25,
    gender: Gender.MALE,
    role: UserRole.USER,
    phone: '1234567890',
    picture: null as string | null,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVerifiedUser: IUser = {
    ...mockUser,
    isVerified: true,
  };

  const mockPicture: Express.Multer.File = {
    fieldname: 'picture',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };

  beforeEach(async () => {
    const mockAuthRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const mockEmailVerificationRepository = {
      findByCodeAndPurpose: jest.fn(),
      findByUserIdAndPurpose: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteByUserIdAndPurpose: jest.fn(),
    };

    const mockEmailService = {
      sendVerificationCode: jest.fn(),
    };

    const mockMulterService = {
      save: jest.fn(),
      delete: jest.fn().mockImplementation((path: string) => {
        // Mock delete to accept single parameter (path) as called in service
        return Promise.resolve(true);
      }),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue(mockJWT),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: EmailVerificationRepository,
          useValue: mockEmailVerificationRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: MulterService,
          useValue: mockMulterService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
    emailVerificationRepository = module.get(EmailVerificationRepository);
    emailService = module.get(EmailService);
    multerService = module.get(MulterService);
    configService = module.get(ConfigService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockLoginDto: LoginDto = {
      email: 'john@example.com',
      password: 'Password123!',
    };

    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
      jwtService.signAsync.mockResolvedValue('mock-token');
    });

    it('should successfully login a verified user', async () => {
      const hashedPassword = await hashPassword(mockLoginDto.password);
      const userWithHashedPassword = {
        ...mockVerifiedUser,
        password: hashedPassword,
      };

      authRepository.findByEmail.mockResolvedValue(
        userWithHashedPassword as any,
      );
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(mockResponse, mockLoginDto);

      expect(authRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockVerifiedUser.id },
        {
          secret: mockJWT.accessToken,
          expiresIn: mockJWT.accessTtl,
        },
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockVerifiedUser.id },
        {
          secret: mockJWT.refreshToken,
          expiresIn: mockJWT.refreshTtl,
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'lax',
          maxAge: expect.any(Number),
        }),
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        user: { id: mockVerifiedUser.id },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      authRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(mockResponse, mockLoginDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.login(mockResponse, mockLoginDto)).rejects.toThrow(
        'User not found',
      );

      expect(authRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user is not verified', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.login(mockResponse, mockLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.login(mockResponse, mockLoginDto)).rejects.toThrow(
        'User is not verified',
      );

      expect(authRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when password is invalid', async () => {
      const hashedPassword = await hashPassword('DifferentPassword123!');
      const userWithHashedPassword = {
        ...mockVerifiedUser,
        password: hashedPassword,
      };

      authRepository.findByEmail.mockResolvedValue(
        userWithHashedPassword as any,
      );

      await expect(service.login(mockResponse, mockLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.login(mockResponse, mockLoginDto)).rejects.toThrow(
        'Invalid password',
      );

      expect(authRepository.findByEmail).toHaveBeenCalledWith(
        mockLoginDto.email,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should generate both access and refresh tokens', async () => {
      const hashedPassword = await hashPassword(mockLoginDto.password);
      const userWithHashedPassword = {
        ...mockVerifiedUser,
        password: hashedPassword,
      };

      authRepository.findByEmail.mockResolvedValue(
        userWithHashedPassword as any,
      );
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      await service.login(mockResponse, mockLoginDto);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it('should set refresh token cookie with correct options', async () => {
      const hashedPassword = await hashPassword(mockLoginDto.password);
      const userWithHashedPassword = {
        ...mockVerifiedUser,
        password: hashedPassword,
      };

      authRepository.findByEmail.mockResolvedValue(
        userWithHashedPassword as any,
      );
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      await service.login(mockResponse, mockLoginDto);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          maxAge: expect.any(Number),
        }),
      );
    });

    it('should return user without password', async () => {
      const hashedPassword = await hashPassword(mockLoginDto.password);
      const userWithHashedPassword = {
        ...mockVerifiedUser,
        password: hashedPassword,
      };

      authRepository.findByEmail.mockResolvedValue(
        userWithHashedPassword as any,
      );
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(mockResponse, mockLoginDto);

      expect(result).not.toHaveProperty('password');
      expect(result.user).toEqual({ id: mockVerifiedUser.id });
    });
  });

  describe('logout', () => {
    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;

    it('should successfully logout a user', async () => {
      const userId = 1;

      const result = await service.logout(mockResponse, userId);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        '',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
        }),
      );
      expect(result).toEqual({ message: 'Logged out successfully' });
    });

    it('should throw NotFoundException when user id is not provided', async () => {
      await expect(service.logout(mockResponse, 0)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.logout(mockResponse, 0)).rejects.toThrow(
        'User not found',
      );

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user id is undefined', async () => {
      await expect(
        service.logout(mockResponse, undefined as any),
      ).rejects.toThrow(NotFoundException);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should delete refresh token cookie', async () => {
      const userId = 1;

      await service.logout(mockResponse, userId);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        '',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'lax',
        }),
      );
    });
  });

  describe('register', () => {
    it('should successfully register a user without picture', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.create.mockResolvedValue(mockUser);

      const result = await service.register(mockRegisterDto, undefined as any);

      expect(authRepository.findByEmail).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
      expect(authRepository.create).toHaveBeenCalledWith({
        ...mockRegisterDto,
        password: expect.any(String),
        picture: null,
      });
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(mockUser.email);
      expect(multerService.save).not.toHaveBeenCalled();
    });

    it('should successfully register a user with picture', async () => {
      const picturePath = 'users/test-file.webp';
      const userWithPicture = { ...mockUser, picture: picturePath };

      authRepository.findByEmail.mockResolvedValue(null);
      multerService.save.mockResolvedValue(picturePath);
      authRepository.create.mockResolvedValue(userWithPicture);

      const result = await service.register(mockRegisterDto, mockPicture);

      expect(multerService.save).toHaveBeenCalledWith(mockPicture, 'users');
      expect(authRepository.create).toHaveBeenCalledWith({
        ...mockRegisterDto,
        password: expect.any(String),
        picture: picturePath,
      });
      expect(result.picture).toBe(picturePath);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw BadRequestException when role is ADMIN', async () => {
      const adminDto = { ...mockRegisterDto, role: UserRole.ADMIN };

      await expect(
        service.register(adminDto, undefined as any),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register(adminDto, undefined as any),
      ).rejects.toThrow('Admin role is not allowed for registration');

      expect(authRepository.findByEmail).not.toHaveBeenCalled();
      expect(authRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user already exists', async () => {
      authRepository.findByEmail.mockResolvedValue(mockUser as any);

      await expect(
        service.register(mockRegisterDto, undefined as any),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register(mockRegisterDto, undefined as any),
      ).rejects.toThrow('User already exists');

      expect(authRepository.findByEmail).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
      expect(authRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when picture save fails', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      multerService.save.mockResolvedValue(null as any);

      await expect(
        service.register(mockRegisterDto, mockPicture),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register(mockRegisterDto, mockPicture),
      ).rejects.toThrow('Failed to save picture');

      expect(multerService.save).toHaveBeenCalledWith(mockPicture, 'users');
      expect(authRepository.create).not.toHaveBeenCalled();
    });

    it('should delete picture and throw error when database create fails', async () => {
      const picturePath = 'users/test-file.webp';
      const dbError = new Error('Database error');

      authRepository.findByEmail.mockResolvedValue(null);
      multerService.save.mockResolvedValue(picturePath);
      authRepository.create.mockRejectedValue(dbError);
      multerService.delete.mockResolvedValue(true);

      await expect(
        service.register(mockRegisterDto, mockPicture),
      ).rejects.toThrow('Database error');

      expect(multerService.save).toHaveBeenCalled();
      expect(authRepository.create).toHaveBeenCalled();
      expect(multerService.delete).toHaveBeenCalledWith(picturePath);
    });

    it('should delete picture and throw InternalServerErrorException when create fails with non-Error', async () => {
      const picturePath = 'users/test-file.webp';

      authRepository.findByEmail.mockResolvedValue(null);
      multerService.save.mockResolvedValue(picturePath);
      authRepository.create.mockRejectedValue('String error');
      multerService.delete.mockResolvedValue(true);

      await expect(
        service.register(mockRegisterDto, mockPicture),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.register(mockRegisterDto, mockPicture),
      ).rejects.toThrow('Failed to create user');

      expect(multerService.delete).toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.create.mockResolvedValue(mockUser);

      await service.register(mockRegisterDto, undefined as any);

      const createCall = authRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe(mockRegisterDto.password);
      expect(createCall.password).toBeDefined();
      expect(typeof createCall.password).toBe('string');
    });

    it('should return user without password', async () => {
      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.create.mockResolvedValue(mockUser);

      const result = await service.register(mockRegisterDto, undefined as any);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.fullName).toBe(mockUser.fullName);
    });

    it('should not delete picture if picture was not saved', async () => {
      const dbError = new Error('Database error');

      authRepository.findByEmail.mockResolvedValue(null);
      authRepository.create.mockRejectedValue(dbError);

      await expect(
        service.register(mockRegisterDto, undefined as any),
      ).rejects.toThrow('Database error');

      expect(multerService.delete).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    const mockRequest = {
      cookies: {
        refreshToken: 'valid-refresh-token',
      },
    } as unknown as Request;

    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
      jwtService.signAsync.mockResolvedValue('mock-token');
    });

    it('should successfully refresh tokens with valid refresh token', async () => {
      const decoded = { id: 1 };
      jwtService.verifyAsync.mockResolvedValue(decoded);
      authRepository.findOne.mockResolvedValue(mockVerifiedUser as any);
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      const result = await service.refresh(mockRequest, mockResponse);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(
        'valid-refresh-token',
        { secret: mockJWT.refreshToken },
      );
      expect(authRepository.findOne).toHaveBeenCalledWith(1);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'lax',
          maxAge: expect.any(Number),
        }),
      );
      expect(result).toEqual({
        accessToken: 'new-access-token',
      });
    });

    it('should throw UnauthorizedException when no refresh token provided', async () => {
      const requestWithoutToken = {
        cookies: {},
      } as unknown as Request;

      await expect(
        service.refresh(requestWithoutToken, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.refresh(requestWithoutToken, mockResponse),
      ).rejects.toThrow('No refresh token provided');

      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
      expect(authRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        'Invalid or expired refresh token',
      );

      expect(authRepository.findOne).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when token payload is invalid', async () => {
      jwtService.verifyAsync.mockResolvedValue({} as any);

      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        'Invalid token payload',
      );

      expect(authRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      const decoded = { id: 999 };
      jwtService.verifyAsync.mockResolvedValue(decoded);
      authRepository.findOne.mockResolvedValue(undefined as any);

      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        'User not found',
      );

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is not verified', async () => {
      const decoded = { id: 1 };
      jwtService.verifyAsync.mockResolvedValue(decoded);
      authRepository.findOne.mockResolvedValue(mockUser as any);

      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(mockRequest, mockResponse)).rejects.toThrow(
        'User is not verified',
      );

      expect(jwtService.signAsync).not.toHaveBeenCalled();
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should generate new access and refresh tokens', async () => {
      const decoded = { id: 1 };
      jwtService.verifyAsync.mockResolvedValue(decoded);
      authRepository.findOne.mockResolvedValue(mockVerifiedUser as any);
      jwtService.signAsync
        .mockResolvedValueOnce('new-access-token')
        .mockResolvedValueOnce('new-refresh-token');

      await service.refresh(mockRequest, mockResponse);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockVerifiedUser.id },
        {
          secret: mockJWT.accessToken,
          expiresIn: mockJWT.accessTtl,
        },
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { id: mockVerifiedUser.id },
        {
          secret: mockJWT.refreshToken,
          expiresIn: mockJWT.refreshTtl,
        },
      );
    });
  });

  describe('verify', () => {
    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;

    const mockVerification: IEmailVerification = {
      id: 1,
      userId: 1,
      code: '1234',
      purpose: EmailVerificationPurpose.VERIFY,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUnverifiedUser: IUser = {
      ...mockUser,
      isVerified: false,
    };

    beforeEach(() => {
      jwtService.signAsync.mockResolvedValue('mock-token');
    });

    it('should successfully verify user with valid code', async () => {
      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(
        mockVerification,
      );
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      (authRepository as any).update.mockResolvedValue({
        ...mockUnverifiedUser,
        isVerified: true,
      });
      emailVerificationRepository.deleteByUserIdAndPurpose.mockResolvedValue();
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.verify(mockResponse, '1234');

      expect(
        emailVerificationRepository.findByCodeAndPurpose,
      ).toHaveBeenCalledWith('1234', EmailVerificationPurpose.VERIFY);
      expect(authRepository.findOne).toHaveBeenCalledWith(1);
      expect((authRepository as any).update).toHaveBeenCalledWith(1, {
        isVerified: true,
      });
      expect(
        emailVerificationRepository.deleteByUserIdAndPurpose,
      ).toHaveBeenCalledWith(1, EmailVerificationPurpose.VERIFY);
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'lax',
          maxAge: expect.any(Number),
        }),
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        user: { id: 1 },
      });
    });

    it('should throw BadRequestException when code is not provided', async () => {
      await expect(service.verify(mockResponse, '')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.verify(mockResponse, '')).rejects.toThrow(
        'Verification code is required',
      );

      expect(
        emailVerificationRepository.findByCodeAndPurpose,
      ).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when verification code is invalid', async () => {
      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(null);

      await expect(service.verify(mockResponse, '9999')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.verify(mockResponse, '9999')).rejects.toThrow(
        'Invalid verification code',
      );

      expect(authRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when verification code has expired', async () => {
      const expiredVerification: IEmailVerification = {
        ...mockVerification,
        expiredAt: new Date(Date.now() - 1000 * 60 * 60),
      };

      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(
        expiredVerification,
      );

      await expect(service.verify(mockResponse, '1234')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.verify(mockResponse, '1234')).rejects.toThrow(
        'Verification code has expired',
      );

      expect(authRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(
        mockVerification,
      );
      authRepository.findOne.mockResolvedValue(undefined as any);

      await expect(service.verify(mockResponse, '1234')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.verify(mockResponse, '1234')).rejects.toThrow(
        'User not found',
      );

      expect((authRepository as any).update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user is already verified', async () => {
      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(
        mockVerification,
      );
      authRepository.findOne.mockResolvedValue(mockVerifiedUser as any);

      await expect(service.verify(mockResponse, '1234')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.verify(mockResponse, '1234')).rejects.toThrow(
        'User is already verified',
      );

      expect((authRepository as any).update).not.toHaveBeenCalled();
    });

    it('should generate and return access token', async () => {
      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(
        mockVerification,
      );
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      (authRepository as any).update.mockResolvedValue({
        ...mockUnverifiedUser,
        isVerified: true,
      });
      emailVerificationRepository.deleteByUserIdAndPurpose.mockResolvedValue();
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.verify(mockResponse, '1234');

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('access-token');
      expect(result.user).toEqual({ id: 1 });
    });

    it('should handle verification with expiredAt field', async () => {
      const verificationWithExpiredAt = {
        ...mockVerification,
        expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      };
      emailVerificationRepository.findByCodeAndPurpose.mockResolvedValue(
        verificationWithExpiredAt as any,
      );
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      (authRepository as any).update.mockResolvedValue({
        ...mockUnverifiedUser,
        isVerified: true,
      });
      emailVerificationRepository.deleteByUserIdAndPurpose.mockResolvedValue();
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.verify(mockResponse, '1234');

      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('resendVerificationCode', () => {
    const mockUnverifiedUser: IUser = {
      ...mockUser,
      isVerified: false,
    };

    const mockExistingVerification: IEmailVerification = {
      id: 1,
      userId: 1,
      code: '9999',
      purpose: EmailVerificationPurpose.VERIFY,
      expiredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully resend verification code for unverified user', async () => {
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      emailVerificationRepository.findByUserIdAndPurpose.mockResolvedValue(
        mockExistingVerification,
      );
      (emailVerificationRepository as any).update.mockResolvedValue({
        ...mockExistingVerification,
        code: '1234',
      });
      emailService.sendVerificationCode.mockResolvedValue();

      await service.resendVerificationCode(1);

      expect(authRepository.findOne).toHaveBeenCalledWith(1);
      expect(
        emailVerificationRepository.findByUserIdAndPurpose,
      ).toHaveBeenCalledWith(1, EmailVerificationPurpose.VERIFY);
      expect((emailVerificationRepository as any).update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          code: expect.stringMatching(/^\d{4}$/),
          expiredAt: expect.any(Date),
        }),
      );
      expect(emailService.sendVerificationCode).toHaveBeenCalledWith(
        mockUnverifiedUser.email,
        expect.stringMatching(/^\d{4}$/),
        mockUnverifiedUser.fullName,
      );
    });

    it('should create new verification code if none exists', async () => {
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      emailVerificationRepository.findByUserIdAndPurpose.mockResolvedValue(
        null,
      );
      (emailVerificationRepository as any).create.mockResolvedValue({
        ...mockExistingVerification,
        code: '1234',
      });
      emailService.sendVerificationCode.mockResolvedValue();

      await service.resendVerificationCode(1);

      expect(
        emailVerificationRepository.findByUserIdAndPurpose,
      ).toHaveBeenCalledWith(1, EmailVerificationPurpose.VERIFY);
      expect(emailVerificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          code: expect.stringMatching(/^\d{4}$/),
          purpose: EmailVerificationPurpose.VERIFY,
          expiredAt: expect.any(Date),
        }),
      );
      expect(emailService.sendVerificationCode).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      authRepository.findOne.mockResolvedValue(undefined as any);

      await expect(service.resendVerificationCode(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.resendVerificationCode(999)).rejects.toThrow(
        'User not found',
      );

      expect(
        emailVerificationRepository.findByUserIdAndPurpose,
      ).not.toHaveBeenCalled();
      expect(emailService.sendVerificationCode).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user is already verified', async () => {
      authRepository.findOne.mockResolvedValue(mockVerifiedUser as any);

      await expect(service.resendVerificationCode(1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resendVerificationCode(1)).rejects.toThrow(
        'User is already verified',
      );

      expect(
        emailVerificationRepository.findByUserIdAndPurpose,
      ).not.toHaveBeenCalled();
      expect(emailService.sendVerificationCode).not.toHaveBeenCalled();
    });

    it('should generate 4-digit verification code', async () => {
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      emailVerificationRepository.findByUserIdAndPurpose.mockResolvedValue(
        mockExistingVerification,
      );
      (emailVerificationRepository as any).update.mockResolvedValue({});
      emailService.sendVerificationCode.mockResolvedValue();

      await service.resendVerificationCode(1);

      const updateCall = (emailVerificationRepository as any).update.mock
        .calls[0][1];
      expect(updateCall.code).toMatch(/^\d{4}$/);
      expect(updateCall.code.length).toBe(4);

      const sendCall = emailService.sendVerificationCode.mock.calls[0];
      expect(sendCall[1]).toMatch(/^\d{4}$/);
    });

    it('should set expiration date to 24 hours from now', async () => {
      const now = Date.now();
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      emailVerificationRepository.findByUserIdAndPurpose.mockResolvedValue(
        mockExistingVerification,
      );
      (emailVerificationRepository as any).update.mockResolvedValue({});
      emailService.sendVerificationCode.mockResolvedValue();

      await service.resendVerificationCode(1);

      const updateCall = (emailVerificationRepository as any).update.mock
        .calls[0][1];
      const expiredAt = new Date(updateCall.expiredAt);
      const expectedExpiredAt = new Date(now + 1000 * 60 * 60 * 24);
      const diff = Math.abs(expiredAt.getTime() - expectedExpiredAt.getTime());

      expect(diff).toBeLessThan(1000); // Allow 1 second difference
    });

    it('should send email with correct parameters', async () => {
      authRepository.findOne.mockResolvedValue(mockUnverifiedUser as any);
      emailVerificationRepository.findByUserIdAndPurpose.mockResolvedValue(
        mockExistingVerification,
      );
      (emailVerificationRepository as any).update.mockResolvedValue({});
      emailService.sendVerificationCode.mockResolvedValue();

      await service.resendVerificationCode(1);

      expect(emailService.sendVerificationCode).toHaveBeenCalledWith(
        mockUnverifiedUser.email,
        expect.stringMatching(/^\d{4}$/),
        mockUnverifiedUser.fullName,
      );
    });
  });
});
