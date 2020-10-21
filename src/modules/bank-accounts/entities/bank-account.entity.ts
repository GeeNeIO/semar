import { Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: 'BankAccounts',
  timestamps: true,
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

  @CreatedAt
  createdTime: Date;
  @UpdatedAt
  updatedTime: Date;
}