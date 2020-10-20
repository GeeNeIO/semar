import { BankAccount, BankAccountData } from "../../bank-accounts/types/bank-account.types";

export type FeeData = {
  mdrOnUs: number;
  mdrOffUs: number;
};

export type EdcData = {
  serialNumber: string;
  merchantName: string;
  issuer: string;
  limitPerMonth: string;
  fee: FeeData;
  settlementAccount: BankAccountData;
}

export type Edc = EdcData & {
  edcId: string;
  agentId?: string;
  settlementAccount: BankAccount;
  createdTime: Date;
  lastUpdatedTime: Date;
}
