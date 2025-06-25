import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import fs from 'fs';
import path from "path";


const allowedExtensions = ['.pdf', '.jpg', '.png', '.gif', '.docx'];

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;

    const filePath =path.resolve(`./receipts/${fileName}`);
    const fileExtension = path.extname(fileName);

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid file type' });
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'File not found on server' });
    }

    // Send the file for download
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
}
