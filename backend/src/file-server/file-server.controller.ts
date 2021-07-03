import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateFileName } from './generate-file-name';
import { imageFileFilter } from './file-filters';
import { IMAGE_DIR_PATH } from './const';

@Controller('static')
export class FileServerController {
  constructor() {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: IMAGE_DIR_PATH,
        filename: generateFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(@UploadedFile() file: SavedFile) {
    return {
      filename: file.filename,
      path: `${IMAGE_DIR_PATH}/${file.filename}`,
    };
  }
}
