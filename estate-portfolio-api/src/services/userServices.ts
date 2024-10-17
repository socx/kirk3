import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dayjs from 'dayjs';

import { AuthenticatedUser, User } from '../interfaces/userInterfaces';
import { UserModel } from '../models/userModel';

import { hasOwnProperty } from '../lib/utils';

const getUserFromModel = (userModel: any) => {
  const { _id, email, fullname, permissions, createdAt, updatedAt, activatedAt } = userModel

  const permissionNos =  permissions.map((permission: any) => permission?.permissionNo);

  const user: User = {
    id: _id.toString(),
    fullname,
    email,
    permissions: permissionNos,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    activatedAt: activatedAt ? activatedAt.toISOString() : null,
  }
  return user;
}

export const createUser = async (fullname: string, email: string, password: string) : Promise<User> => {
  // Hash the password before saving it to the database
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newUser = await UserModel.create({
    fullname,
    email,
    password: hashedPassword,
  });
  return getUserFromModel(newUser.toObject());
}

export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  return user ? getUserFromModel(user?.toObject()) : null;
}

export const activateUser = async (_id: string, email: string) : Promise<User | null> => {
  const modelUser = await UserModel.findOneAndUpdate({ email, _id }, { activatedAt: Date.now() }, { new: true });
  return modelUser ? getUserFromModel(modelUser.toJSON()) : null;
}

export const authenticate = async (email: string, password: string): Promise<AuthenticatedUser | undefined> => {
  const user = await UserModel.findOne({ email });
  if (!user || !user.activatedAt || user.deletedAt)  {
    return;
  }

  const passwordMatch = await bcryptjs.compare(password, user.password);

  if (!passwordMatch) {
    return;
  }

  const permissions = user.permissions ? Object.values(user.permissions).filter(Boolean) : null;

  const accessToken = jwt.sign(
    {
      userInfo: {
        email: user.email,
        permissions,
      }
    },
    (<Secret>(process.env.ACCESS_TOKEN_SECRET as string)),
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '30d' }
  );

  user.refreshToken = refreshToken;
  const authenticatedUser = await user.save();

  return {
    ...getUserFromModel(authenticatedUser),
    accessToken,
    refreshToken
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<AuthenticatedUser | undefined> => {
  const user = await UserModel.findOne({ refreshToken });
  if (!user || !user.activatedAt || user.deletedAt)  {
    return;
  }

  const permissions = user.permissions ? Object.values(user.permissions).filter(Boolean) : null;
  const accessToken = jwt.sign(
    {
      userInfo: {
        email: user.email,
        permissions
      }
    },
    (<Secret>(process.env.ACCESS_TOKEN_SECRET as string)),
    { expiresIn: '1d' }
  );

  return {
    ...getUserFromModel(user),
    accessToken,
    refreshToken
  };
};

export const clearToken = async (refreshToken: string): Promise<User | undefined> => {
  const user = await UserModel.findOne({ refreshToken });
  if (!user || !user.activatedAt || user.deletedAt)  {
    return;
  }
  user.refreshToken = '';
  const loggedOutUser = await user.save();

  return getUserFromModel(loggedOutUser);
};

export const generatePasswordResetToken = async (email: string) => {
  return jwt.sign({ email, expiry: dayjs().add(1, 'hour') }, (<Secret>process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: '1 hour'
  });
};

export const findUserByEmailAndUpdatePassword = async (password: string, token: string) : Promise<User | null> => {
  const salt = await bcryptjs.genSalt();
  password = await bcryptjs.hash(password, salt);

  const verified: unknown = jwt.verify(token, (<Secret>process.env.ACCESS_TOKEN_SECRET));

  if (verified && hasOwnProperty(verified, 'email')) {
    const email = verified.email;
    const modelUser = await UserModel.findOneAndUpdate({ email }, { password, updatedAt: Date.now() }, { new: true });
    if (!modelUser)  {
      throw new Error("User not found");
    }
    return getUserFromModel(modelUser);
  }
  return null;
}

export const getUserFromToken = async (req: Request) => {
  const token = req.body.token || (req.get("Authorization") || "").replace("Bearer ", "");
  const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  const { userInfo } = decoded;
  let tokenUser = null;
  if (userInfo && userInfo.email && typeof userInfo.email === 'string') {
    tokenUser = await findUserByEmail(userInfo.email);
    return tokenUser;
  }
  return;
};

export const fetchAllUsers = async () => {
  const users: User[] = [];
  const userModels = await UserModel.find({});
  if (userModels && userModels.length) {
    for (let i = 0; i < 3; i++) {
      users.push(getUserFromModel(userModels[i]?.toObject()));
    }
  }
  return users;
}

export const fetchUser = async (id: string) => {
  const user = await UserModel.findById(id);
  return user ? getUserFromModel(user?.toObject()) : null;
}

export const updateUser = async (id: string, fieldsToUpdate: Object) => {
  const user = await UserModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true } );
  return user ? getUserFromModel(user?.toObject()) : null;
}
