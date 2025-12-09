import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { IApiConfig, IClientConfig } from '@common/interfaces';

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;
  let accessToken: string;
  let refreshTokenCookie: string;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    const configService = app.get(ConfigService);
    const api = configService.getOrThrow<IApiConfig>('api');
    const client = configService.getOrThrow<IClientConfig>('client');

    app.setGlobalPrefix(api.prefix);
    app.use(cookieParser());

    app.useStaticAssets(join(process.cwd(), 'public'), {
      prefix: '/public',
      index: false,
    });

    app.enableCors({
      origin: [client.uri],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      maxAge: 3600,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      const registerDto = {
        fullName: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'Test1234!',
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37412345678',
        city: 'Yerevan',
      };

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('email');
          expect(res.body.email).toBe(registerDto.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail with invalid email', () => {
      const registerDto = {
        fullName: 'Test User',
        email: 'invalid-email',
        password: 'Test1234!',
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37412345678',
        city: 'Yerevan',
      };

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail with weak password', () => {
      const registerDto = {
        fullName: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'weak',
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37412345678',
        city: 'Yerevan',
      };

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);
    });

    it('should fail if email already exists', async () => {
      const email = `test-${Date.now()}@example.com`;
      const registerDto = {
        fullName: 'Test User',
        email,
        password: 'Test1234!',
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37412345678',
        city: 'Yerevan',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const email = `test-login-${Date.now()}@example.com`;
      const password = 'Test1234!';

      const registerDto = {
        fullName: 'Test User',
        email,
        password,
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37412345678',
        city: 'Yerevan',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      accessToken = response.body.accessToken;

      const cookies = response.headers['set-cookie'];
      if (cookies && Array.isArray(cookies)) {
        const refreshCookie = cookies.find((cookie: string) =>
          cookie.startsWith('refreshToken='),
        );
        if (refreshCookie) {
          refreshTokenCookie = refreshCookie;
        }
      }
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'WrongPass123!' })
        .expect(404);
    });

    it('should fail with wrong password', async () => {
      const email = `test-login-${Date.now()}@example.com`;
      const password = 'Test1234!';

      const registerDto = {
        fullName: 'Test User',
        email,
        password,
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37412345678',
        city: 'Yerevan',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password: 'WrongPass123!' })
        .expect(400);
    });
  });

  describe('/auth/me (GET)', () => {
    it('should get current user with valid token', async () => {
      if (!accessToken) {
        const email = `test-me-${Date.now()}@example.com`;
        const password = 'Test1234!';

        const registerDto = {
          fullName: 'Test User',
          email,
          password,
          age: 25,
          gender: 'male',
          role: 'user',
          phone: '+37412345678',
          city: 'Yerevan',
        };

        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(registerDto)
          .expect(201);

        const loginResponse = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email, password })
          .expect(200);

        accessToken = loginResponse.body.accessToken;
      }

      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).not.toHaveProperty('password');
      userId = response.body.id;
    });

    it('should fail without token', () => {
      return request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });

    it('should fail with invalid token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should logout with valid token', async () => {
      if (!accessToken) {
        // Ensure we have a token
        const email = `test-logout-${Date.now()}@example.com`;
        const password = 'Test1234!';

        const registerDto = {
          fullName: 'Test User',
          email,
          password,
          age: 25,
          gender: 'male',
          role: 'user',
          phone: '+37412345678',
          city: 'Yerevan',
        };

        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(registerDto)
          .expect(201);

        const loginResponse = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email, password })
          .expect(200);

        accessToken = loginResponse.body.accessToken;
      }

      return request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should fail without token', () => {
      return request(app.getHttpServer()).post('/api/auth/logout').expect(401);
    });
  });

  describe('/auth/refresh (POST)', () => {
    it('should refresh token with valid refresh cookie', async () => {
      if (!refreshTokenCookie) {
        const email = `test-refresh-${Date.now()}@example.com`;
        const password = 'Test1234!';

        const registerDto = {
          fullName: 'Test User',
          email,
          password,
          age: 25,
          gender: 'male',
          role: 'user',
          phone: '+37412345678',
          city: 'Yerevan',
        };

        await request(app.getHttpServer())
          .post('/api/auth/register')
          .send(registerDto)
          .expect(201);

        const loginResponse = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send({ email, password })
          .expect(200);

        const cookies = loginResponse.headers['set-cookie'];
        if (cookies && Array.isArray(cookies)) {
          const refreshCookie = cookies.find((cookie: string) =>
            cookie.startsWith('refreshToken='),
          );
          if (refreshCookie) {
            refreshTokenCookie = refreshCookie;
          }
        }
      }

      if (refreshTokenCookie) {
        const response = await request(app.getHttpServer())
          .post('/api/auth/refresh')
          .set('Cookie', refreshTokenCookie)
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        accessToken = response.body.accessToken;
      }
    });

    it('should fail without refresh token cookie', () => {
      return request(app.getHttpServer()).post('/api/auth/refresh').expect(401);
    });
  });

  describe('/auth/check-verification-access (GET)', () => {
    it('should check verification access', () => {
      return request(app.getHttpServer())
        .get('/api/auth/check-verification-access')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('canAccess');
        });
    });
  });
});
