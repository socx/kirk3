import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

import { UserModel } from "./UserModel";
import { PermissionModel } from "./PermissionModel";

interface UserPermissionAttributes {
  permissionId: string;
  userId: string;
}

@Table({
  timestamps: false,
  tableName: "user_permissions",
  modelName: "UserPermission",
})
export class UserPermissionModel extends Model <
  UserPermissionAttributes
> {
  // @ForeignKey(() => PermissionModel)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare permissionId: string;

  @ForeignKey(() => UserModel)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare userId: string;

}
