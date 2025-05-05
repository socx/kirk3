import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
} from "sequelize-typescript";

interface PermissionAttributes {
  id?: string;
  description: string;
}

interface PermissionCreationAttributes extends
  Optional <PermissionAttributes, "id"> {}

@Table({
  timestamps: false,
  tableName: "permissions",
  modelName: "Permission",
})
export class PermissionModel extends Model <
  PermissionAttributes,
  PermissionCreationAttributes
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
  declare description: string;

}
