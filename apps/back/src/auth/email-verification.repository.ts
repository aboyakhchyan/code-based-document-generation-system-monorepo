import { Injectable } from '@nestjs/common';
import { IEmailVerification, EmailVerificationPurpose } from './interface';
import { Prisma } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class EmailVerificationRepository extends BaseRepository<IEmailVerification> {
  private readonly db: DatabaseService;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'EmailVerification' as Prisma.ModelName);
    this.db = databaseService;
  }

  async findByCodeAndPurpose(
    code: string,
    purpose: EmailVerificationPurpose,
  ): Promise<IEmailVerification | null> {
    return (this.db.emailVerification as any).findFirst({
      where: {
        code,
        purpose,
      },
      include: {
        user: true,
      },
    });
  }

  async findByUserIdAndPurpose(
    userId: string,
    purpose: EmailVerificationPurpose,
  ): Promise<IEmailVerification | null> {
    return (this.db.emailVerification as any).findFirst({
      where: {
        userId,
        purpose,
      },
    });
  }

  async deleteByUserIdAndPurpose(
    userId: string,
    purpose: EmailVerificationPurpose,
  ): Promise<void> {
    await (this.db.emailVerification as any).deleteMany({
      where: {
        userId,
        purpose,
      },
    });
  }

  async createOrUpdate(
    userId: string,
    purpose: EmailVerificationPurpose,
    code: string,
    expiredAt: Date,
  ): Promise<IEmailVerification> {
    const existing = await this.findByUserIdAndPurpose(userId, purpose);

    if (existing && existing.id) {
      return (this.db.emailVerification as any).update({
        where: { id: existing.id },
        data: {
          code,
          expiredAt,
        },
      });
    }

    return (this.db.emailVerification as any).create({
      data: {
        userId,
        purpose,
        code,
        expiredAt,
      },
    });
  }
}
