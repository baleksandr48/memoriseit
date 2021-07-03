import { Request } from '@nestjs/common';

export const imageFileFilter = (
  req: Request,
  file: any,
  callback: (...args: any[]) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
