export type BankAccountData = {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export type BankAccount = BankAccountData & {
  bankId: string;
  createdTime: Date;
  updatedTime: Date;
}
