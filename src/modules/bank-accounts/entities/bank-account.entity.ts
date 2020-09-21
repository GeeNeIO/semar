import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'bankAccounts',
  modelName: 'bankAccount',
  timestamps: false,
})
export class BankAccountModel extends Model<BankAccountModel> {
  @PrimaryKey
  @Column
  bankId: string;

  @Column
  fkTableName: string;
  @Column
  fkTableId: string;
  
  @Column
  accountName: string;
  @Column
  accountNumber: string;
  @Column
  bankName: string;

  @Column
  createTime: Date;
  @Column
  updatedTime: Date;
}