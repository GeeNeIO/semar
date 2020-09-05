import { Model, Table, PrimaryKey, Column, DataType } from 'sequelize-typescript';
import { CustomerType, CustomerStatus } from '../customers.types';

@Table({
  tableName: 'customers',
  underscored: true,
  timestamps: false,
})
export class CustomerModel extends Model<CustomerModel> {
  @PrimaryKey
  @Column
  customerId: string;

  @Column
  customerName: string;
  @Column
  contactPhoneNumber: string;
  
  @Column(DataType.STRING)
  customerType: CustomerType;
  @Column(DataType.STRING)
  latestStatus: CustomerStatus;

  @Column
  createdTime: Date;
  @Column
  normalTime: Date;
  @Column
  blockedTime: Date;
}
