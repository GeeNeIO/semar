import { BankAccount } from "src/modules/bank-accounts/types/bank-account.types";

type EdcFee = {
  mdrOnUs: number;
  mdrOffUs: number;
}

export interface GetEdcRequestDto {
  edcId: string;
}

export interface GetEdcResponseDto extends GetEdcRequestDto {
  merchantName: string;
  issuer: string;
  fee: EdcFee;
  settlementAccount: BankAccount;
  balance: number;
}

export interface CreateEdcRequestDto {
  merchantName: string;
  issuer: string;
  fee: EdcFee;
  settlementAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

export interface CreateEdcResponseDto extends GetEdcResponseDto {
}

export interface DeleteEdcRequestDto {
  edcId: string;
}

export interface DeleteEdcResponseDto extends GetEdcResponseDto {
}

export interface UpdateEdcRequestDto extends Partial<CreateEdcRequestDto> {
}

export interface UpdateEdcResponseDto extends GetEdcResponseDto {
}
