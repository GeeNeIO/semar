import { Model, Table, PrimaryKey, Column, DataType } from 'sequelize-typescript';
import { CustomerStatus } from '../customers.types';

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
  @Column
  customerIdNumber: string;
  @Column(DataType.DATEONLY)
  customerBirthdate: string;
  
  @Column(DataType.STRING)
  latestStatus: CustomerStatus;

  @Column
  createdTime: Date;
  @Column
  normalTime: Date;
  @Column
  blockedTime: Date;
}
