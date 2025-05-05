import { Permission } from '../../interfaces/PermissionInterface'

import { PermissionModel } from '../../database/models/PermissionModel'


const getPermissionFromModel = (permissionModel: any) => {
  const { id, description, } = permissionModel

  const permission: Permission = {
    id: id.toString(),
    description,
  }
  return permission;
}

export const createPermission = async (description: string,) : Promise<Permission|null> => {
  const permission = await PermissionModel.create({
    description,
  });

  return permission ? getPermissionFromModel(permission) : null;
}

export const retrievePermissions = async () => {
  const permissions: Permission[] = [];
  const permissionModels = await PermissionModel.findAll({
    attributes: ['id', 'description'],
  });
  
  if (permissionModels && permissionModels.length) {
    for (let i = 0; i < permissionModels.length; i++) {
      permissions.push(getPermissionFromModel(permissionModels[i]));
    }
  }
  return permissions;
}

export const retrievePermission = async (id: string) => {
  const permission = await PermissionModel.findByPk(id);
  return permission ? getPermissionFromModel(permission) : null;
}

export const retrievePermissionByDescription = async (description: string) => {
  const permission = await PermissionModel.findOne({
    where: { description: description }
  });
  return permission ? getPermissionFromModel(permission) : null;
}

export const updatePermission = async (id: string, fieldsToUpdate: any) => {
  const permission = await PermissionModel.findByPk(id);
  await permission?.update({...fieldsToUpdate});
  permission?.reload();
  return permission ? getPermissionFromModel(permission) : null;
}

export const deletePermission = async (id: string,) : Promise<void> => {
  const permission = await PermissionModel.findByPk(id);
  if (permission) {
    await permission.destroy();
  }
}
