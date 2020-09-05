import { Model, Table, PrimaryKey, Column, DataType, HasMany } from 'sequelize-typescript';
import { CustomerStatus } from '../customers.types';
import { CorrespondentModel } from './correspondent.entity';

@Table({
  tableName: 'customers',
  modelName: 'customers',
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

  @HasMany(() => CorrespondentModel, 'customerId')
  correspondence: CorrespondentModel[];

  @Column
  createdTime: Date;
  @Column
  normalTime: Date;
  @Column
  blockedTime: Date;
}
