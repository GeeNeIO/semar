import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'Edcs',
  timestamps: false,
})
export class EdcModel extends Model<EdcModel> {
  @PrimaryKey
  @Column
  edcId: string;

  @Column
  agentId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  serialNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  merchantName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  issuer: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 200,
  })
  feeOnUs: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 200,
  })
  feeOffUs: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: '1000000000',
  })
  limitPerMonth: string;

  @Column
  bankAccountId: string;

  @Column(DataType.DATE)
  createdTime: Date;

  @Column(DataType.DATE)
  lastUpdatedTime: Date;
}
