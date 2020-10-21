import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table({
  tableName: 'Edcs',
  timestamps: true,
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

  @CreatedAt
  createdTime: Date;

  @UpdatedAt
  lastUpdatedTime: Date;
}
