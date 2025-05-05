import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import {
  createPermission,
  retrievePermissions,
  retrievePermission,
  retrievePermissionByDescription,
  updatePermission,
  deletePermission,
} from "../services/mysql/permissionService";


export const getPermissions = async (req: Request, res: Response) => {
  const permissions = await retrievePermissions();
  if (permissions) {
    return res.status(StatusCodes.OK).json({message: "Permissions fetched successfully", permissions}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any permissions`});
};

export const getPermission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const permission = await retrievePermission(id);
  if (permission) {
    return res.status(StatusCodes.OK).json({message: "Permission fetched successfully", permission}); 
  }

  return res.status(StatusCodes.NOT_FOUND).json({message : `Could not find any permission`});
};

export const insertPermission = async (req: Request, res: Response) => {
  const { description,} = req.body;
  if (!description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'description is required.' });
  }

  // check for duplicates
  const duplicate = await retrievePermissionByDescription(description);
  if (duplicate) {
    return res.status(StatusCodes.CONFLICT).json({message: "Permission with this description already exists",});
  }

  const permission = await createPermission(description);
  if (permission) {
    return res.status(StatusCodes.CREATED).json({success: "Permission inserted successfully", permission});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not insert permission at this time`});
  }
};

export const editPermission = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'description is required.'});
  }

  const permission = await updatePermission(id, description);
  if (permission) {
    return res.status(StatusCodes.OK).json({success: "Permission updated successfully", permission});
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({message : `Could not update permission at this time`});
  }
};

export const removePermission = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deletePermission(id);
  return res.status(StatusCodes.OK).json({message: "Permission deleted successfully"});
};
