import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import { ExpenseItemModel } from "./ExpenseItemModel";
import { UserModel } from "./UserModel";


interface ExpenseAttributes {
  expenseId?: string;
  description: string;
  status: string;
  team: string;
  totalAmount: number;
  claimant: string;
}

interface ExpenseCreationAttributes extends
  Optional <ExpenseAttributes, "expenseId"> {}

@Table({
  timestamps: true,
  tableName: "expenses",
  modelName: "Expense",
})
export class ExpenseModel extends Model <
  ExpenseAttributes,
  ExpenseCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare expenseId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare team: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare totalAmount: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => ExpenseItemModel, {
    onDelete: "CASCADE",
    hooks: true
  })
  declare expenseItems: ExpenseItemModel[];

  // @BelongsTo(() => UserModel, 'id')
  // declare claimant: UserModel;

  @ForeignKey(() => UserModel)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare claimant: string;
  

}
