import { IBlock, IDocumentWithoutBlocks } from '@document/interfaces/document';
import { Injectable } from '@nestjs/common';
import { Block, Document, Prisma, PrismaClient } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@services';

@Injectable()
export class DocumentRepository extends BaseRepository<Document> {
  private readonly db: PrismaClient;

  constructor(private readonly databaseService: DatabaseService) {
    super(databaseService, 'Document' as Prisma.ModelName);
    this.db = databaseService;
  }

  async createDocumentWithBlocks(
    data: IDocumentWithoutBlocks,
    blocks: IBlock[],
  ) {
    const createdDocument = await this.db['Document'].create({
      data: data,
    });

    const createdBlocks = await this.db['Block'].createManyAndReturn({
      data: blocks.map((block) => ({
        ...block,
        documentId: createdDocument.id,
      })),
    });
    return {
        ...createdDocument,
        blocks: createdBlocks,
    };
  }
}
