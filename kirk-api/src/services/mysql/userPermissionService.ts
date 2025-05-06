import { UserPermission } from '../../interfaces/UserPermissionInterface'
import { UserPermissionModel } from '../../database/models/UserPermissionModel'


const getUserPermissionFromModel = (userPermissionModel: any) => {
  const { userId, permissionId, } = userPermissionModel

  const userPermission: UserPermission = {
    userId: userId.toString(),
    permissionId,
  }
  return userPermission;
}

export const createUserPermission = async (userId: string, permissionId: string,) : Promise<UserPermission|null> => {
  const userPermissionModel = await UserPermissionModel.create({
    userId,
    permissionId,
  });

  return userPermissionModel ? getUserPermissionFromModel(userPermissionModel) : null;
}

export const retrieveUserPermissions = async (userId: string) => {
  const userPermissions: UserPermission[] = [];
  const userPermissionModels = await UserPermissionModel.findAll({
    where: {
      userId: userId
    },
    attributes: ['userId', 'permissionId'],
  });
  
  if (userPermissionModels && userPermissionModels.length) {
    for (let i = 0; i < userPermissionModels.length; i++) {
      userPermissions.push(getUserPermissionFromModel(userPermissionModels[i]));
    }
  }
  return userPermissions;
}

export const retrieveUserPermission = async (userId: string, permissionId: string) => {
  const userPermissionModel = await UserPermissionModel.findOne({
    where: {
      userId: userId,
      permissionId: permissionId
    }
  });
  return userPermissionModel ? getUserPermissionFromModel(userPermissionModel) : null;
}

export const deleteUserPermission = async (userId: string, permissionId: string) : Promise<void> => {
  const userPermission = await UserPermissionModel.findOne({
    where: {
      userId: userId,
      permissionId: permissionId
    },
  });
  if (userPermission) {
    await userPermission.destroy();
  }
}
