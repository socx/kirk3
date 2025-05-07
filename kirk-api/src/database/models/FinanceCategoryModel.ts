import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
} from "sequelize-typescript";


interface FinanceCategoryAttributes {
  id?: string;
  name: string;
  description: string;
  code: string;
}

interface FinanceCategoryCreationAttributes extends
  Optional <FinanceCategoryAttributes, "id"> {}

@Table({
  timestamps: false,
  tableName: "finance_categories",
  modelName: "financeCategory",
})
export class FinanceCategoryModel extends Model <
  FinanceCategoryAttributes,
  FinanceCategoryCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare code: Date;

}
