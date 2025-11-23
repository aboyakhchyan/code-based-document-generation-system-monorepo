import { Module } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { MulterService } from './multer.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/svg+xml',
          'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Invalid file type. Only images (jpeg, jpg, png, webp, svg, gif) are allowed.',
            ),
            false,
          );
        }
      },
    }),
  ],
  providers: [MulterService],
  exports: [MulterService, MulterModule],
})
export class MulterConfigModule {}
