import { Injectable } from '@nestjs/common';
import { IUser } from './interface';
import { Prisma } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class AuthRepository extends BaseRepository<IUser> {
  private readonly db: DatabaseService;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'User' as Prisma.ModelName);
    this.db = databaseService;
  }

  async findCurrentUser(id: string) {
    return this.db.user.findUnique({
      where: {
        id,
      },
      include: {
        subscription: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email,
      },
    });
  }
}
