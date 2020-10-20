import { PartialType } from "@nestjs/mapped-types";

export class BankAccountData {
  readonly bankName: string;
  readonly accountName: string;
  readonly accountNumber: string;
}

export class GetBankAccountRequest {
  readonly bankId: string;
}

export class GetBankAccountResponse extends BankAccountData {
  readonly bankId: string;
  readonly createdTime: Date;
  readonly updatedTime: Date;
}

export class CreateBankAccountRequest extends BankAccountData {
}

export class CreateBankAccountResponse extends GetBankAccountResponse  {
}

export class UpdateBankAccountRequest extends PartialType(CreateBankAccountRequest) {
}

export class UpdateBankAccountResponse extends GetBankAccountResponse {
}

export class DeleteBankAccountRequest {
  readonly bankId: string;
}

export class DeleteBankAccountResponse extends GetBankAccountResponse {
}
