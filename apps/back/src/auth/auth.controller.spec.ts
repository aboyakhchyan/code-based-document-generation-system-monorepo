import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyDto } from './dto/auth.dto';
import { Gender, IUser, UserRole } from './interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockRegisterDto: RegisterDto = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
    age: 25,
    gender: Gender.MALE,
    role: UserRole.USER,
    phone: '1234567890',
  };

  const mockUser: Omit<IUser, 'password'> = {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    age: 25,
    gender: Gender.MALE,
    role: UserRole.USER,
    phone: '1234567890',
    picture: null,
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      refresh: jest.fn(),
      verify: jest.fn(),
      resendVerificationCode: jest.fn(),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue({ uri: 'http://localhost:3000' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockResponse = {
      redirect: jest.fn(),
    } as unknown as Response;

    it('should call authService.register with correct parameters and redirect', async () => {
      authService.register.mockResolvedValue(mockUser);

      await controller.register(mockRegisterDto, undefined as any, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(
        mockRegisterDto,
        undefined,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/verify',
      );
    });

    it('should call authService.register with picture when provided and redirect', async () => {
      authService.register.mockResolvedValue({
        ...mockUser,
        picture: 'users/test-file.webp',
      });

      await controller.register(mockRegisterDto, mockPicture, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(
        mockRegisterDto,
        mockPicture,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/verify',
      );
    });

    it('should redirect to verify page after successful registration', async () => {
      authService.register.mockResolvedValue(mockUser);

      await controller.register(mockRegisterDto, undefined as any, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/verify',
      );
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('Registration failed');
      authService.register.mockRejectedValue(error);

      await expect(
        controller.register(mockRegisterDto, undefined as any, mockResponse),
      ).rejects.toThrow('Registration failed');

      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should handle BadRequestException from authService', async () => {
      const error = new Error('User already exists');
      authService.register.mockRejectedValue(error);

      await expect(
        controller.register(mockRegisterDto, undefined as any, mockResponse),
      ).rejects.toThrow('User already exists');

      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should return HttpStatus.CREATED status code', () => {
      expect(controller.register).toBeDefined();
    });

    it('should accept RegisterDto with all required fields', async () => {
      const fullDto: RegisterDto = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePass123!',
        age: 30,
        gender: Gender.FEMALE,
        role: UserRole.USER,
        phone: '9876543210',
        picture: undefined,
      };

      authService.register.mockResolvedValue({
        ...mockUser,
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        age: 30,
        gender: Gender.FEMALE,
        phone: '9876543210',
      });

      await controller.register(fullDto, undefined as any, mockResponse);

      expect(authService.register).toHaveBeenCalledWith(fullDto, undefined);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/verify',
      );
    });
  });

  describe('login', () => {
    const mockLoginDto: LoginDto = {
      email: 'john@example.com',
      password: 'Password123!',
    };

    const mockLoginResponse = {
      accessToken: 'access-token',
      user: { id: 1 },
    };

    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;

    it('should call authService.login with correct parameters', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(
        mockResponse,
        mockLoginDto,
      );
      expect(result).toEqual(mockLoginResponse);
    });

    it('should return access token and user data', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(mockLoginDto, mockResponse);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('access-token');
      expect(result.user.id).toBe(1);
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('User not found');
      authService.login.mockRejectedValue(error);

      await expect(
        controller.login(mockLoginDto, mockResponse),
      ).rejects.toThrow('User not found');
    });

    it('should handle BadRequestException from authService', async () => {
      const error = new Error('User is not verified');
      authService.login.mockRejectedValue(error);

      await expect(
        controller.login(mockLoginDto, mockResponse),
      ).rejects.toThrow('User is not verified');
    });

    it('should return HttpStatus.OK status code', () => {
      expect(controller.login).toBeDefined();
    });

    it('should accept LoginDto with email and password', async () => {
      const loginDto: LoginDto = {
        email: 'jane@example.com',
        password: 'SecurePass123!',
      };

      authService.login.mockResolvedValue({
        accessToken: 'token',
        user: { id: 2 },
      });

      const result = await controller.login(loginDto, mockResponse);

      expect(authService.login).toHaveBeenCalledWith(mockResponse, loginDto);
      expect(result.user.id).toBe(2);
    });
  });

  describe('logout', () => {
    const mockUser: IUser = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'hashed',
      age: 25,
      gender: Gender.MALE,
      role: UserRole.USER,
      phone: '1234567890',
      isVerified: true,
    };

    const mockResponse = {
      cookie: jest.fn(),
    } as unknown as Response;

    const mockLogoutResponse = {
      message: 'Logged out successfully',
    };

    it('should call authService.logout with correct parameters', async () => {
      authService.logout.mockResolvedValue(mockLogoutResponse);

      const result = await controller.logout(mockResponse, mockUser);

      expect(authService.logout).toHaveBeenCalledWith(
        mockResponse,
        mockUser.id,
      );
      expect(result).toEqual(mockLogoutResponse);
    });

    it('should return success message', async () => {
      authService.logout.mockResolvedValue(mockLogoutResponse);

      const result = await controller.logout(mockResponse, mockUser);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Logged out successfully');
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('User not found');
      authService.logout.mockRejectedValue(error);

      await expect(controller.logout(mockResponse, mockUser)).rejects.toThrow(
        'User not found',
      );
    });

    it('should return HttpStatus.OK status code', () => {
      expect(controller.logout).toBeDefined();
    });

    it('should use user id from @User decorator', async () => {
      const userWithId = { ...mockUser, id: 5 };
      authService.logout.mockResolvedValue(mockLogoutResponse);

      await controller.logout(mockResponse, userWithId);

      expect(authService.logout).toHaveBeenCalledWith(mockResponse, 5);
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
      redirect: jest.fn(),
    } as unknown as Response;

    const mockRefreshResponse = {
      accessToken: 'new-access-token',
    };

    it('should call authService.refresh with correct parameters', async () => {
      authService.refresh.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refresh(mockRequest, mockResponse);

      expect(authService.refresh).toHaveBeenCalledWith(
        mockRequest,
        mockResponse,
      );
      expect(result).toEqual(mockRefreshResponse);
    });

    it('should return access token', async () => {
      authService.refresh.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refresh(mockRequest, mockResponse);

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('new-access-token');
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('Invalid refresh token');
      authService.refresh.mockRejectedValue(error);

      await expect(
        controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow('Invalid refresh token');
    });

    it('should handle UnauthorizedException from authService', async () => {
      const error = new Error('No refresh token provided');
      authService.refresh.mockRejectedValue(error);

      await expect(
        controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow('No refresh token provided');
    });

    it('should return HttpStatus.OK status code', () => {
      expect(controller.refresh).toBeDefined();
    });

    it('should handle request without refresh token', async () => {
      const requestWithoutToken = {
        cookies: {},
      } as unknown as Request;

      const error = new Error('No refresh token provided');
      authService.refresh.mockRejectedValue(error);

      await expect(
        controller.refresh(requestWithoutToken, mockResponse),
      ).rejects.toThrow('No refresh token provided');
    });
  });

  describe('verify', () => {
    const mockVerifyDto: VerifyDto = {
      code: '1234',
    };

    const mockResponse = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;

    const mockVerifyResponse = {
      accessToken: 'access-token',
      user: { id: 1 },
    };

    it('should call authService.verify with correct parameters', async () => {
      authService.verify.mockResolvedValue(mockVerifyResponse);

      await controller.verify(mockVerifyDto, mockResponse);

      expect(authService.verify).toHaveBeenCalledWith(
        mockResponse,
        mockVerifyDto.code,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/dashboard',
      );
    });

    it('should redirect to dashboard after successful verification', async () => {
      authService.verify.mockResolvedValue(mockVerifyResponse);

      await controller.verify(mockVerifyDto, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/dashboard',
      );
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('Invalid verification code');
      authService.verify.mockRejectedValue(error);

      await expect(
        controller.verify(mockVerifyDto, mockResponse),
      ).rejects.toThrow('Invalid verification code');

      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should handle BadRequestException from authService', async () => {
      const error = new Error('Verification code has expired');
      authService.verify.mockRejectedValue(error);

      await expect(
        controller.verify(mockVerifyDto, mockResponse),
      ).rejects.toThrow('Verification code has expired');
    });

    it('should return HttpStatus.OK status code', () => {
      expect(controller.verify).toBeDefined();
    });

    it('should accept VerifyDto with 4-digit code', async () => {
      const verifyDto: VerifyDto = {
        code: '5678',
      };

      authService.verify.mockResolvedValue(mockVerifyResponse);

      await controller.verify(verifyDto, mockResponse);

      expect(authService.verify).toHaveBeenCalledWith(
        mockResponse,
        '5678',
      );
    });
  });

  describe('resendVerificationCode', () => {
    const mockUser: IUser = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'hashed',
      age: 25,
      gender: Gender.MALE,
      role: UserRole.USER,
      phone: '1234567890',
      isVerified: false,
    };

    const mockResponse = {
      redirect: jest.fn(),
    } as unknown as Response;

    it('should call authService.resendVerificationCode with correct parameters', async () => {
      authService.resendVerificationCode.mockResolvedValue(undefined);

      await controller.resendVerificationCode(mockUser, mockResponse);

      expect(authService.resendVerificationCode).toHaveBeenCalledWith(1);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/verify',
      );
    });

    it('should redirect to verify page after resending code', async () => {
      authService.resendVerificationCode.mockResolvedValue(undefined);

      await controller.resendVerificationCode(mockUser, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/verify',
      );
    });

    it('should propagate errors from authService', async () => {
      const error = new Error('User not found');
      authService.resendVerificationCode.mockRejectedValue(error);

      await expect(
        controller.resendVerificationCode(mockUser, mockResponse),
      ).rejects.toThrow('User not found');

      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it('should handle BadRequestException from authService', async () => {
      const error = new Error('User is already verified');
      authService.resendVerificationCode.mockRejectedValue(error);

      await expect(
        controller.resendVerificationCode(mockUser, mockResponse),
      ).rejects.toThrow('User is already verified');
    });

    it('should return HttpStatus.OK status code', () => {
      expect(controller.resendVerificationCode).toBeDefined();
    });

    it('should use user id from @User decorator', async () => {
      const userWithId = { ...mockUser, id: 5 };
      authService.resendVerificationCode.mockResolvedValue(undefined);

      await controller.resendVerificationCode(userWithId, mockResponse);

      expect(authService.resendVerificationCode).toHaveBeenCalledWith(5);
    });
  });
});
