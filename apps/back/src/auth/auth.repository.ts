import { Injectable } from '@nestjs/common';
import { IUser } from './interface';
import { Prisma } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class AuthRepository extends BaseRepository<IUser> {
  private readonly db: DatabaseService;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'Users' as Prisma.ModelName);
    this.db = databaseService;
  }
}
