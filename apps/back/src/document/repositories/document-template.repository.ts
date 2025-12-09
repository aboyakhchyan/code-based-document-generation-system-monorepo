import {
  IDocumentTemplateWithBlocks,
} from '@document/interfaces/document';
import { Injectable } from '@nestjs/common';
import { Block, DocumentTemplate, Prisma, PrismaClient } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class DocumentTemplateRepository extends BaseRepository<DocumentTemplate> {
  private readonly db: PrismaClient;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'DocumentTemplate' as Prisma.ModelName);
    this.db = databaseService;
  }

    async findTemplatesWithBlocks(): Promise<IDocumentTemplateWithBlocks[]> {
      const templates = await this.db['DocumentTemplate'].findMany({
        include: { blocks: true },
      });

      return templates;
    }

    async findTemplatesWithBlockById(id: string): Promise<IDocumentTemplateWithBlocks> {
      const template = await this.db['DocumentTemplate'].findUnique({
        where: { id },
        include: { blocks: true },
      });

      return template;
    }
}
