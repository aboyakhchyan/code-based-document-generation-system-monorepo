import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

export const Upload = (field: string) => {
  return applyDecorators(UseInterceptors(FileInterceptor(field)));
};
