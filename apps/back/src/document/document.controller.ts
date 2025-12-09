import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Verified } from '@common/decorators/method/verified.decorator';
import { Auth } from '@common/decorators/method';
import { IDocumentTemplate } from './interfaces/document';
import { User } from '@common/decorators/param';
import { IUser } from '@auth/interface';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('templates')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.OK)
  async getTemplates() {
    return this.documentService.getTemplates();
  }

  @Post('template/select/:id')
  @Verified()
  @Auth('jwt')
  @HttpCode(HttpStatus.CREATED)
  async selectTemplate(@Param('id') id: string, @User() user: IUser) {
    return this.documentService.selectTemplate(id, user.id as string);
  }
}
