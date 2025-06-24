import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const fileStorage = (directoryPath: string) => multer.diskStorage({
  destination: (
      request: Request,
      file: Express.Multer.File,
      callback: DestinationCallback
  ): void => {
    callback(null, directoryPath);
  },

  filename: (
      req: Request, 
      file: Express.Multer.File, 
      callback: FileNameCallback
  ): void => {
    const arr = file.originalname.split('.');
    const ext = arr[arr.length - 1];
    const filefull = `${file.fieldname}-${Math.round(Math.random() * 1E9).toString()}-${Date.now()}.${ext}`;
    callback(null, filefull);
  }
});

export const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  const legalFileTypes = [
    'image/jpg', 'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (legalFileTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const fileUploadHandler = multer({ storage: fileStorage('./upload'), fileFilter: fileFilter });
