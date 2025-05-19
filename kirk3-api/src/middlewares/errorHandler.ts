import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { logEvents } from "./logEvents";


export const errorHandler = (err: Error, req: Request, res: Response) => {
  logEvents(`${err.name}: ${err.message}`, 'errorLog.txt');
  const statusCode = res.statusCode ? res.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
  });
};
