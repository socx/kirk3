import {
  Table,
  Model,
  Column,
  DataType,
} from "sequelize-typescript";

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
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare permissionId: string;

  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare userId: string;

}
