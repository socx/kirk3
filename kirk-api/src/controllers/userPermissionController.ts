import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import {
  createUserPermission,
  retrieveUserPermissions,
  retrieveUserPermission,
  deleteUserPermission,
} from "../services/mysql/userPermissionService";


export const getUserPermissions = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const userPermissions = await retrieveUserPermissions(userId);
  if (userPermissions) {
    return res.status(StatusCodes.OK).json({message: "User Permissions fetched successfully", userPermissions}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any user permissions`});
};

export const insertUserPermission = async (req: Request, res: Response) => {
  const { userId, permissionId } = req.body;
  if (!userId || !permissionId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'userId and permissionId are required.' });
  }

  // check for duplicates
  const duplicate = await retrieveUserPermission(userId, permissionId);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "This user permission already exists",});
  }

  const userPermission = await createUserPermission(userId, permissionId);
  if (userPermission) {
    return res.status(StatusCodes.CREATED).json({success: "User permission inserted successfully", userPermission});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not insert user permission at this time`});
  }
};

export const removeUserPermission = async (req: Request, res: Response) => {
  const { userId, permissionId } = req.params;
  await deleteUserPermission(userId, permissionId);
  return res.status(StatusCodes.OK).json({message: "User permission deleted successfully"});
};
