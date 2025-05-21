import bcryptjs from 'bcryptjs';
import { Request } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dayjs from 'dayjs';

import { AuthenticatedUser, User } from '../interfaces/UserInterfaces';
import { UserModel } from '../models/UserModel';


const getUserFromModel = (userModel: any) => {
  const { _id, email, fullname, permissions, team, createdAt, updatedAt, activatedAt } = userModel;

  const user: User = {
    userId: _id,
    fullname,
    email,
    permissions,
    team,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    activatedAt: activatedAt ? activatedAt.toISOString() : null,
  }
  return user;
}

export const createUser = async (fullname: string, email: string, password: string, team: string) : Promise<User> => {
  // Hash the password before saving it to the database
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newUser = await UserModel.create({
    fullname,
    email,
    password: hashedPassword,
    team,
    activatedAt: Date.now(),
  });
  return getUserFromModel(newUser);
}

export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  return user ? getUserFromModel(user) : null;
}

export const activateUser = async (token: string, email: string) : Promise<User | null> => {
  const modelUser = await UserModel.findOneAndUpdate({ email, userId: token }, { activatedAt: Date.now() }, { new: true });
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

  const authenticatedUser = await user.save();

  return {
    ...getUserFromModel(authenticatedUser),
    accessToken
  };
};

export const clearToken = async (accessToken: string): Promise<User | undefined> => {
  const user = await UserModel.findOne({ accessToken });
  if (!user || !user.activatedAt || user.deletedAt)  {
    return;
  }
  user.accessToken = '';
  const loggedOutUser = await user.save();

  return getUserFromModel(loggedOutUser);
};

export const generatePasswordResetToken = async (email: string) => {
  return jwt.sign({ email, expiry: dayjs().add(1, 'hour') }, (<Secret>process.env.ACCESS_TOKEN_SECRET), {
    expiresIn: '1 hour'
  });
};

export const findUserByEmailAndUpdatePassword = async (email: string, password: string) : Promise<User> => {
  const salt = await bcryptjs.genSalt();
  password = await bcryptjs.hash(password, salt);

  const modelUser = await UserModel.findOneAndUpdate({ email }, { password, updatedAt: Date.now() }, { new: true });
  if (!modelUser)  {
    throw new Error("User not found");
  }
  return getUserFromModel(modelUser);
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
    for (let i = 0; i < userModels.length; i++) {
      users.push(getUserFromModel(userModels[i] as any));
    }
  }
  return users;
}

export const fetchUser = async (userId: string) => {
  const user = await UserModel.findOne({ _id: userId }).populate('permissions');;
  return user ? getUserFromModel(user as any) : null;
}

export const updateUser = async (userId: string, fieldsToUpdate: Object) => {
  const user = await UserModel.findByIdAndUpdate(userId, fieldsToUpdate, { new: true } );
  return user ? getUserFromModel(user as any) : null;
}
