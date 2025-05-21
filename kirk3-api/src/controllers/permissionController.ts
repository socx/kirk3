import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getAllPermissions, getPermissionById, savePermission, updatePermissionById } from "../services/permissionService";
import { Permission } from "../interfaces/PermissionInterface";


export const createPermission = async (req: Request, res: Response) => {
  const { permissionName } = req.body;
  if ( !permissionName) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 'message': 'permissionName is required.' });
  }
  const permission = await savePermission(permissionName);
  if (permission) {
    return res.status(StatusCodes.CREATED).json({success: "Permission created successfully", permission});
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({message : `Could not create permission at this time`});
  }
};

export const getPermissions = async (req: Request, res: Response) => {
  const permissions : Permission[] = await getAllPermissions();
  if (permissions && permissions.length) {
    return res.status(StatusCodes.OK).json({message: "Fetched permissions successfully", permissions});
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({ message: 'No permissions found' });
  }
}

export const getPermission = async (req: Request, res: Response) => {
  const { permissionId, } = req.params;
  const permission: Permission = await getPermissionById(permissionId);
  if (permission) {
    return res.status(StatusCodes.OK).json({message: "Fetched permission successfully", permission});
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({ message: 'No permission found' });
  }
}

export const updatePermission = async (req: Request, res: Response) => {
  const { permissionId, } = req.params;
  const { permissionName, } = req.body;
  const foundPermission: Permission = await getPermissionById(permissionId);
  if (foundPermission) {
    const permission = await updatePermissionById(permissionId, permissionName,)
    return res.status(StatusCodes.OK).json({message: "Updated permission successfully", permission});
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({ message: 'No matching permission found' });
  }
}
