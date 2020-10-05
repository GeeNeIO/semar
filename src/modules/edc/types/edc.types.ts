import { BankAccount } from "src/modules/bank-accounts/types/bank-account.types";

export type Edc = {
  edcId: string;
  serialNumber: string;
  merchantName: string;
  issuer: string;
  fee: {
    mdrOnUs: string;
    mdrOffUs: string;
  };
  settlementAccount: BankAccount;
}
