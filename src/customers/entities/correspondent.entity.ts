import { Model, Table, PrimaryKey, Column } from "sequelize-typescript";

@Table({
  tableName: 'correspondence',
  underscored: true,
  timestamps: false,
})
export class CorrespondentModel extends Model<CorrespondentModel> {
  @PrimaryKey
  @Column
  correspondentId: string;

  @Column
  title: string;
  @Column
  phoneNumber: string;
  @Column
  address: string;
  @Column
  notes: string;

  @Column
  createdTime: Date
  @Column
  lastUpdatedTime: Date
}
