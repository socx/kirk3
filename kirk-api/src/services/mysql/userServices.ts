import bcryptjs from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

import { AuthenticatedUser, User } from '../../interfaces/userInterfaces'
import { UserModel } from '../../database/models/UserModel';
import { UserPermissionModel } from '../../database/models/UserPermissionModel';


const getUserFromModel = (userModel: any) => {
  const { id, email, fullname, userPermissions, createdAt, updatedAt, activatedAt } = userModel

  const user: User = {
    id: id.toString(),
    fullname,
    email,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    activatedAt: activatedAt ? activatedAt.toISOString() : null,
    userPermissions: userPermissions
  }

  return user;
}

export const fetchAllUsers = async () => {
  const users: User[] = [];
  const userModels = await UserModel.findAll({
    include: [UserPermissionModel],
    attributes: ['id', 'fullname', 'email', 'activatedAt', 'createdAt', 'updatedAt'],
  });
  
  if (userModels && userModels.length) {
    for (let i = 0; i < userModels.length; i++) {
      users.push(getUserFromModel(userModels[i]));
    }
  }
  return users;
}

export const fetchUser = async (id: string) => {
  const userModel = await UserModel.findOne({
    where: { id: id },
    include: [UserPermissionModel],
    attributes: ['id', 'fullname', 'email', 'activatedAt', 'createdAt', 'updatedAt'],
  });

  return userModel ? getUserFromModel(userModel) : null;
}

export const updateUser = async (id: string, fieldsToUpdate: any) => {
  let user = await UserModel.findByPk(id);
  await user?.update({...fieldsToUpdate});
  user?.reload();
  return user ? getUserFromModel(user) : null;
}

export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });
  return user ? getUserFromModel(user) : null;
}

export const createUser = async (fullname: string, email: string, password: string, activatedAt?: Date) : Promise<User|null> => {
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  const user = await UserModel.create({
    fullname,
    email: email.toLowerCase(),
    password: hashedPassword,
    activatedAt: (new Date())
  });

  return user ? getUserFromModel(user) : null;
}

export const authenticate = async (email: string, password: string): Promise<AuthenticatedUser | undefined> => {
  const user = await UserModel.findOne({ where: { email: email.toLowerCase() } });
  if (!user || !user.activatedAt || user.deletedAt)  {
    return;
  }

  const passwordMatch = await bcryptjs.compare(password, user.password);

  if (!passwordMatch) {
    return;
  }

  const accessToken = jwt.sign(
    {
      userInfo: {
        email: user.email,
      }
    },
    (<Secret>(process.env.ACCESS_TOKEN_SECRET as string)),
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '30d' }
  );
  
  const authenticatedUser = await user.save();

  return {
    ...getUserFromModel(authenticatedUser),
    accessToken,
    refreshToken
  };
};

export const getUserFromToken = async (token: string) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  const decoded: any = jwt.verify(token, accessTokenSecret);
  const { userInfo } = decoded;
  let tokenUser = null;
  if (userInfo && userInfo.email && typeof userInfo.email === 'string') {
    tokenUser = await findUserByEmail(userInfo.email);
    return tokenUser;
  }
  return;
};
