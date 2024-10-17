import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes"

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!(authHeader as string)?.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({message : `Invalid header`});
    }
    const token = (authHeader as string)?.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    next();

  } catch (error: unknown) {
    const err = error as Error;
    return res.status(StatusCodes.UNAUTHORIZED).json({message: err.message});
  }
};
