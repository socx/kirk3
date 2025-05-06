import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import { UserPermissionModel } from "./UserPermissionModel";

interface UserAttributes {
  id?: string;
  fullname: string;
  email: string;
  password: string;
  activatedAt?: Date; 
}

interface UserCreationAttributes extends
  Optional <UserAttributes, "id"> {}

@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
export class UserModel extends Model <
  UserAttributes,
  UserCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare fullname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare activatedAt: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => UserPermissionModel)
  declare userPermissions: UserPermissionModel[];

}
