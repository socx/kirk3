import { User } from '../../interfaces/userInterfaces'

import { UserModel } from '../../database/models/UserModel';


const getUserFromModel = (userModel: any) => {
  const { id, email, fullname, permissions, createdAt, updatedAt, activatedAt } = userModel

  const user: User = {
    id: id.toString(),
    fullname,
    email,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    activatedAt: activatedAt ? activatedAt.toISOString() : null,
  }
  return user;
}

export const fetchAllUsers = async () => {
  const users: User[] = [];
  const userModels = await UserModel.findAll({
    attributes: ['id', 'fullname', 'email', 'activatedAt', 'createdAt', 'updatedAt'],
  });
  
  if (userModels && userModels.length) {
    for (let i = 0; i < userModels.length; i++) {
      users.push(getUserFromModel(userModels[i]));
    }
  }
  return users;
}

export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ where: { email: email } });
  return user ? getUserFromModel(user) : null;
}


export const createUser = async (fullname: string, email: string, password: string, activatedAt?: Date) : Promise<User|null> => {

  await UserModel.sync();
  const user = await UserModel.create({
    fullname,
    email,
    password,
  });

  return user ? getUserFromModel(user) : null;
}
