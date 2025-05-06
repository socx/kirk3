import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import {
  authenticate,
  createUser,
  fetchAllUsers,
  fetchUser,
  findUserByEmail,
} from "../services/mysql/userServices";
import { createMultipleUserPermissions } from "../services/mysql/userPermissionService";

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await fetchUser(userId);

  if (user) {
    return res.status(StatusCodes.OK).json({message: "User fetched successfully", user}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any users`});
};

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
    // add default permissions
    const defaultUserPermissions = process.env.DEFAULT_USER_PERMISSIONS;
    const userPermissionIds = defaultUserPermissions?.split("|");
    if (userPermissionIds) {
      createMultipleUserPermissions(user.id, userPermissionIds)
    }
    // TODO: send notification email
    return res.status(StatusCodes.CREATED).json({success: "User registered successfully", user});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not register user at this time`});
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, } = req.body;
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'Email and password are required.' });
    }

    const user = await authenticate(email as string, password as string);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({message : `Invalid email and/or password`});
    }

    return res.status(StatusCodes.OK).json({ message: 'Authenticated successfully', user});
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
}
