import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import {
  createUser,
  fetchAllUsers,
  findUserByEmail,
} from "../services/mysql/userServices";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await fetchAllUsers();
  if (users) {
    return res.status(StatusCodes.OK).json({message: "Users fetched successfully", users}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any users`});
};


export const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, password,} = req.body;
  if (!fullname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Username and password are required.' });
  }

  // check for duplicates
  const duplicate = await findUserByEmail(email);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "User with this email already exists",});
  }

  const user = await createUser(fullname, email, password);
  if (user) {
    return res.status(StatusCodes.CREATED).json({success: "User registered successfully", user});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not register user at this time`});
  }
};
