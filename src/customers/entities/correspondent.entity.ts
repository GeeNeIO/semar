import { Model, Table, PrimaryKey, Column, DataType, BelongsTo } from "sequelize-typescript";
import { CustomerModel } from "./customer.entity";

@Table({
  tableName: 'correspondence',
  modelName: 'correspondence',
  timestamps: false,
})
export class CorrespondentModel extends Model<CorrespondentModel> {
  @PrimaryKey
  @Column
  correspondentId: string;

  @BelongsTo(() => CustomerModel, {
    foreignKey: 'customerId',
    onDelete: 'CASCADE',
  })
  customerData: CustomerModel;

  @Column
  title: string;
  @Column
  phoneNumber: string;
  @Column
  address: string;
  @Column(DataType.TEXT)
  notes: string;

  @Column
  createdTime: Date
  @Column
  lastUpdatedTime: Date
}
