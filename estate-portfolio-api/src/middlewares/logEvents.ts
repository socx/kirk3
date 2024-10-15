import dayjs, { Dayjs } from 'dayjs';
import { NextFunction, Request, Response } from "express";
import fs from 'fs';
import path from "path";
import { v4 as random } from "uuid";


export const logEvents = async (message: string, logName: string ) => {
  const dateTime = dayjs().format('YYYY-MM-DD\tHH:mm:ss');
  const logItem = `${dateTime}\t${random()}\t${message}\n`;
  
  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fs.promises.mkdir(path.join(__dirname, '..', 'logs'));
    }
    await fs.promises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
  } catch (err) {
    console.log(err);
  }
}

export const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requestLogs.txt');
  console.log(`${req.method} ${req.path}`);
  next();
}
