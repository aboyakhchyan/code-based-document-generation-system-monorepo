import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { IApiConfig, IClientConfig } from '@common/interfaces';
import * as fs from 'fs';

describe('UserController (e2e)', () => {
  let app: NestExpressApplication;
  let accessToken: string;
  let testUserEmail: string;

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

    // Create test user and get access token
    testUserEmail = `test-user-${Date.now()}@example.com`;
    const password = 'Test1234!';

    const registerDto = {
      fullName: 'Test User',
      email: testUserEmail,
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

    // Note: In a real scenario, user should be verified first
    // For testing purposes, we assume user is verified or bypass verification
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUserEmail, password })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/edit (PATCH)', () => {
    it('should edit user profile with valid token', () => {
      const editDto = {
        fullName: 'Updated Name',
        age: 30,
        city: 'Gyumri',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('fullName');
          expect(res.body.fullName).toBe(editDto.fullName);
          expect(res.body.age).toBe(editDto.age);
          expect(res.body.city).toBe(editDto.city);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should edit user with phone number', () => {
      const editDto = {
        phone: '+37498765432',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('phone');
          expect(res.body.phone).toBe(editDto.phone);
        });
    });

    it('should edit user with gender', () => {
      const editDto = {
        gender: 'female',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('gender');
          expect(res.body.gender).toBe(editDto.gender);
        });
    });

    it('should fail without authentication token', () => {
      const editDto = {
        fullName: 'Updated Name',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .send(editDto)
        .expect(401);
    });

    it('should fail with invalid token', () => {
      const editDto = {
        fullName: 'Updated Name',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', 'Bearer invalid-token')
        .send(editDto)
        .expect(401);
    });

    it('should fail with invalid email format', () => {
      const editDto = {
        email: 'invalid-email',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(400);
    });

    it('should fail with invalid age (too young)', () => {
      const editDto = {
        age: 10,
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(400);
    });

    it('should fail with invalid age (too old)', () => {
      const editDto = {
        age: 200,
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(400);
    });

    it('should fail with invalid phone format', () => {
      const editDto = {
        phone: '123',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(400);
    });

    it('should fail with invalid gender', () => {
      const editDto = {
        gender: 'invalid-gender',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(400);
    });

    it('should fail if email is already taken by another user', async () => {
      // Create another user
      const anotherEmail = `another-user-${Date.now()}@example.com`;
      const password = 'Test1234!';

      const registerDto = {
        fullName: 'Another User',
        email: anotherEmail,
        password,
        age: 25,
        gender: 'male',
        role: 'user',
        phone: '+37411111111',
        city: 'Yerevan',
      };

      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(registerDto)
        .expect(201);

      // Try to update current user with the same email
      const editDto = {
        email: anotherEmail,
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(400);
    });

    it('should edit user with picture upload', async () => {
      // Create a dummy image file for testing
      const testImagePath = join(process.cwd(), 'test', 'test-image.png');

      // Create test directory if it doesn't exist
      const testDir = join(process.cwd(), 'test');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }

      // Create a minimal PNG file (1x1 transparent pixel)
      const pngBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        'base64',
      );

      fs.writeFileSync(testImagePath, pngBuffer);

      try {
        const response = await request(app.getHttpServer())
          .patch('/api/user/edit')
          .set('Authorization', `Bearer ${accessToken}`)
          .attach('picture', testImagePath)
          .expect(200);

        expect(response.body).toHaveProperty('picture');
        expect(response.body.picture).toBeTruthy();
      } finally {
        // Clean up test file
        if (fs.existsSync(testImagePath)) {
          fs.unlinkSync(testImagePath);
        }
      }
    });

    it('should allow partial updates (only some fields)', () => {
      const editDto = {
        fullName: 'Partially Updated Name',
      };

      return request(app.getHttpServer())
        .patch('/api/user/edit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(editDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('fullName');
          expect(res.body.fullName).toBe(editDto.fullName);
        });
    });
  });
});
