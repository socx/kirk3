import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";

import { ExpenseModel } from "./ExpenseModel";


interface ExpenseItemAttributes {
  expenseItemId?: string;
  amount: number;
  description: string;
  document: string;
  expenseItemDate: Date;
  expenseId: string;
}

interface ExpenseItemCreationAttributes extends
  Optional <ExpenseItemAttributes, "expenseItemId"> {}

@Table({
  timestamps: false,
  tableName: "expense_items",
  modelName: "ExpenseItem",
})
export class ExpenseItemModel extends Model <
  ExpenseItemAttributes,
  ExpenseItemCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare expenseItemId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare document: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expenseItemDate: Date;

  @ForeignKey(() => ExpenseModel)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  declare expenseId: string;

  // @BelongsTo(() => ExpenseModel, 'expenseId')
  // declare expense: ExpenseModel;

}
