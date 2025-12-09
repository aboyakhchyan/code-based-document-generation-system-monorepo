import { Injectable } from '@nestjs/common';
import { IUser } from '@auth/interface';
import { Prisma } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class UserRepository extends BaseRepository<IUser> {
  private readonly db: DatabaseService;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'User' as Prisma.ModelName);
    this.db = databaseService;
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: {
        email,
      },
    });
  }
}
