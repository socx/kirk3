import { Optional } from "sequelize";
import { Table, Model, Column, DataType, CreatedAt, UpdatedAt, } from "sequelize-typescript";

interface UserAttributes {
  id?: number;
  fullname: string;
  email: string;
  password: string;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

interface UserCreationAttributes extends Optional <UserAttributes, "id"> {}

@Table({
  timestamps: false,
  tableName: "users",
  modelName: "UserModel",
})
export class User extends Model <
  UserAttributes,
  UserCreationAttributes
> {
  @Column({
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

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

}
