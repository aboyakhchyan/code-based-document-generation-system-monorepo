import { generateUniqueFilename } from '@common/utils';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import * as sharp from 'sharp';
import { join } from 'node:path';
import { CustomLogger } from '@services/logger';

interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

@Injectable()
export class MulterService {
  private readonly PATH_DIR = join(process.cwd(), 'public', 'uploads');

  constructor(private readonly logger: CustomLogger) {
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    if (!existsSync(this.PATH_DIR)) {
      mkdirSync(this.PATH_DIR, { recursive: true });
      this.logger.log(`Created upload directory: ${this.PATH_DIR}`);
    }
  }

  async save(
    file: Express.Multer.File,
    path: string = '',
    options: ImageProcessingOptions = {},
  ): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const subPath = path ? join('uploads', path) : 'uploads';
      const fullPath = join(process.cwd(), 'public', subPath);

      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }

      const format = options.format || 'webp';
      const filename = generateUniqueFilename(format);
      const filePath = join(fullPath, filename);

      let imageProcessor = sharp(file.buffer);

      if (options.width || options.height) {
        imageProcessor = imageProcessor.resize(options.width, options.height, {
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      const quality = options.quality || 80;
      let buffer: Buffer;

      switch (format) {
        case 'webp':
          buffer = await imageProcessor.webp({ quality }).toBuffer();
          break;
        case 'jpeg':
          buffer = await imageProcessor.jpeg({ quality }).toBuffer();
          break;
        case 'png':
          buffer = await imageProcessor
            .png({ quality: quality / 100 })
            .toBuffer();
          break;
        default:
          buffer = await imageProcessor.webp({ quality }).toBuffer();
      }

      writeFileSync(filePath, buffer);

      const relativePath = path ? `${path}/${filename}` : filename;
      this.logger.log(`File saved: ${relativePath}`);

      return relativePath;
    } catch (error) {
      this.logger.error(`Error saving file: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error saving file');
    }
  }

  async delete(filename: string, path: string = ''): Promise<boolean> {
    try {
      const subPath = path ? join('uploads', path) : 'uploads';
      const filePath = join(process.cwd(), 'public', subPath, filename);

      if (existsSync(filePath)) {
        unlinkSync(filePath);
        this.logger.log(`File deleted: ${path ? `${path}/` : ''}${filename}`);
        return true;
      }

      this.logger.warn(`File not found: ${filePath}`);
      return false;
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`, error.stack);
      return false;
    }
  }

  async getFileInfo(file: Express.Multer.File): Promise<{
    width: number;
    height: number;
    format: string;
    size: number;
  }> {
    try {
      const metadata = await sharp(file.buffer).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: file.size,
      };
    } catch (error) {
      this.logger.error(`Error getting file info: ${error.message}`);
      throw new InternalServerErrorException('Error processing file metadata');
    }
  }
}
