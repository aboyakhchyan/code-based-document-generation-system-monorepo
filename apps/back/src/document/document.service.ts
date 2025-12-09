import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DocumentTemplateRepository } from './repositories/document-template.repository';
import { DocumentRepository } from './repositories/document.repository';
import {
  IBlock,
  IDocumentTemplateWithBlocks,
  IDocumentWithoutBlocks,
} from './interfaces/document';

@Injectable()
export class DocumentService {
  constructor(
    private readonly documentTemplateRepo: DocumentTemplateRepository,
    private readonly documentRepo: DocumentRepository,
  ) {}

  async getTemplates() {
    const templates = await this.documentTemplateRepo.findTemplatesWithBlocks();

    const formattedTemplates = templates.map((template) => {
      const blocks = template.blocks.map((block) => {
        const { metadata, ...blockWithoutMetadata } = block;
        return {
          ...blockWithoutMetadata,
          ...(metadata && typeof metadata === 'object' ? metadata : {}),
        };
      });

      const {
        styles,
        blocks: blocksWithoutStyles,
        ...templateWithoutAll
      } = template;

      const contentBlocks = blocks.filter(
        (block) => block.blockType === 'content',
      );
      const imageBlocks = blocks.filter((block) => block.blockType === 'image');
      const shapeBlocks = blocks.filter((block) => block.blockType === 'shape');

      const { backgroundColor, isEditMode } = styles || {};
      return {
        ...templateWithoutAll,
        ...(styles && {
          backgroundColor: backgroundColor || '#FFFFFF',
          isEditMode: isEditMode || false,
        }),
        contentBlocks,
        imageBlocks,
        shapeBlocks,
      };
    });

    return formattedTemplates;
  }

  async selectTemplate(id: string, userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }

    const existingTemplate =
      await this.documentTemplateRepo.findTemplatesWithBlockById(id);

    if (!existingTemplate) {
      throw new NotFoundException('Template not found');
    }

    const { blocks, id: _, ...documentDataWithoutBlocks } = existingTemplate;

    const blocksWithTemplateId = blocks.map((block) => {
      const {
        id,
        templateId,
        updatedAt,
        createdAt,
        ...blockWithoutTemplateId
      } = block;
      return {
        ...blockWithoutTemplateId,
      } as IBlock;
    });

    const documentWithUserId = {
      ...documentDataWithoutBlocks,
      userId,
    } as IDocumentWithoutBlocks;

    const createdDocument = await this.documentRepo.createDocumentWithBlocks(
      documentWithUserId,
      blocksWithTemplateId,
    );

    const formattedTemplate = this.formatTemplate(createdDocument);

    return formattedTemplate;
  }

  private formatTemplate(template: IDocumentTemplateWithBlocks) {
    const blocks = template.blocks.map((block) => {
      const { metadata, ...blockWithoutMetadata } = block;
      return {
        ...blockWithoutMetadata,
        ...(metadata && typeof metadata === 'object' ? metadata : {}),
      };
    });

    const {
      styles,
      blocks: blocksWithoutStyles,
      ...templateWithoutAll
    } = template;

    const contentBlocks = blocks.filter(
      (block) => block.blockType === 'content',
    );
    const imageBlocks = blocks.filter((block) => block.blockType === 'image');
    const shapeBlocks = blocks.filter((block) => block.blockType === 'shape');

    const { backgroundColor, isEditMode } = styles || {};
    return {
      ...templateWithoutAll,
      ...(styles && {
        backgroundColor: backgroundColor || '#FFFFFF',
        isEditMode: isEditMode || false,
      }),
      contentBlocks,
      imageBlocks,
      shapeBlocks,
    };
  }
}
