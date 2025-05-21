import { Permission } from '../interfaces/PermissionInterface';
import { PermissionModel } from '../models/PermissionModel';


const getPermissionFromModel = (permissionModel: any) => {
  const { _id, permissionNo, permissionName } = permissionModel;
  return { permissionId: _id, permissionNo, permissionName };
}

export const getPermissionsFromModel = (permissionModels: any[]) : Permission[] => {
  const permission: Permission[]  = [];
  permissionModels.forEach((permissionModel) => {
    permission.push(getPermissionFromModel(permissionModel))
  });
  return permission;
}

export const getAllPermissions = async () => {
  const permissionModels = await PermissionModel.find({}).sort({number: -1});
  return getPermissionsFromModel(permissionModels as any);
}

export const getPermissionById = async (permissionId: string) => {
  const permissionModel = await PermissionModel.findById(permissionId)
  return getPermissionFromModel(permissionModel as any);
}

export const savePermission = async (permissionName: string ) : Promise<Permission> => {
  const newPermission = await PermissionModel.create({ permissionName, });
  return getPermissionFromModel(newPermission as any);
}

export const updatePermissionById = async (permissionId: string, permissionName: string,) : Promise<Permission | null> => {
  const updatedPermission = await PermissionModel.findByIdAndUpdate(permissionId, { permissionName, }, { new: true });
  return updatedPermission ? getPermissionFromModel(updatedPermission as any) : null;
}

export const deletePermission = async (permissionId: string) : Promise<Permission | null> => {
  const updatedPermission = await PermissionModel.findByIdAndUpdate(permissionId, { deleted  : (new Date())}, { new: true });
  return updatedPermission ? getPermissionFromModel(updatedPermission as any) : null;
}
