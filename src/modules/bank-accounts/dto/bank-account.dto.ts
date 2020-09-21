export class BankAccountCreateDTO {
  readonly bankName: string;
  readonly accountName: string;
  readonly accountNumber: string;
}

export class BankAccountUpdateDTO {
  readonly bankName: string;
  readonly accountName: string;
  readonly accountNumber: string;
}

export class BankAccountDeleteDTO {
  readonly bankId: string;
}

export class BankAccountGetByIdDTO {
  readonly bankId: string;
}
