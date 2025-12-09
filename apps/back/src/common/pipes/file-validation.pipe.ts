import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export interface FileValidationOptions {
  maxSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  isRequired?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize: number;
  private readonly allowedMimeTypes: string[];
  private readonly allowedExtensions: string[];
  private readonly isRequired: boolean;

  constructor(options: FileValidationOptions = {}) {
    this.maxSize = options.maxSize || 10 * 1024 * 1024; 
    this.allowedMimeTypes = options.allowedMimeTypes || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
    ];
    this.allowedExtensions = options.allowedExtensions || [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'svg',
      'gif',
    ];
    this.isRequired = options.isRequired || false;
  }

  transform(
    value: Express.Multer.File | undefined,
    metadata: ArgumentMetadata,
  ): Express.Multer.File | undefined {
    if (!this.isRequired && !value) {
      return undefined;
    }

    if (this.isRequired && !value) {
      throw new BadRequestException('File is required');
    }

    if (!value) {
      throw new BadRequestException('No file provided');
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${
          this.maxSize / 1024 / 1024
        }MB`,
      );
    }

    if (!this.allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    const fileExtension = this.getFileExtension(value.originalname);
    if (!this.allowedExtensions.includes(fileExtension.toLowerCase())) {
      throw new BadRequestException(
        `Invalid file extension. Allowed extensions: ${this.allowedExtensions.join(', ')}`,
      );
    }

    return value;
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
}
