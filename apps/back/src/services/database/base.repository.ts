import { IBaseRepository } from '@common/interfaces';
import { Prisma, PrismaClient } from '@prisma/client';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly model: Prisma.ModelName,
  ) {}

  async findAll(): Promise<T[]> {
    return this.prisma[this.model].findMany();
  }

  async findOne(id: string): Promise<T> {
    return this.prisma[this.model].findUnique({ where: { id } });
  }

  async create(data: T): Promise<T> {
    return this.prisma[this.model].create({ data });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.prisma[this.model].update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma[this.model].delete({ where: { id } });
  }
}
