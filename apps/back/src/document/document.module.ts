import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { DocumentTemplateRepository } from './repositories/document-template.repository';
import { DatabaseModule } from '@services';
import { DocumentRepository } from './repositories/document.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentTemplateRepository, DocumentRepository],
})
export class DocumentModule {}
