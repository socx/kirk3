import { allowedOrigins } from "../config/allowedOrigins";
import { NextFunction, Request, Response } from "express";

export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin: string = req.headers.origin as string;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials');
  }
  next();
}
