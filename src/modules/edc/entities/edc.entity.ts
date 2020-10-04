import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'Edcs',
  timestamps: false,
})
export class EdcModel extends Model<EdcModel> {
  @PrimaryKey
  @Column
  edcId: string;

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
  fee: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 2
  })
  feeDecimalPoint: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    defaultValue: '1000000000',
  })
  limitPerMonth: string;

  @Column(DataType.DATE)
  createdTime: Date;

  @Column(DataType.DATE)
  lastUpdatedTime: Date;
}
