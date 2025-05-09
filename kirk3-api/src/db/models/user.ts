import { Model, Optional } from 'sequelize';
import { sequelize } from '.';

interface UserAttributes {
  id: string;
  fullname: string;
  email: string;
  password: string;
};

/*
  We have to declare the UserCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }