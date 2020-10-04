import { BankAccount } from "src/modules/bank-accounts/types/bank-account.types";

export type Edc = {
  edcId: string;
  merchantName: string;
  issuer: string;
  fee: {
    mdrOnUs: string;
    mdrOffUs: string;
  };
  settlementAccount: Partial<BankAccount>;
}
