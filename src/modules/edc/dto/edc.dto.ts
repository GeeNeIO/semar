import { BankAccount } from "src/modules/bank-accounts/types/bank-account.types";

type EdcFee = {
  mdrOnUs: number;
  mdrOffUs: number;
}

export interface GetEdcRequestDto {
  edcId: string;
}

export interface GetEdcResponseDto extends GetEdcRequestDto {
  serialNumber: string;
  merchantName: string;
  issuer: string;
  fee: EdcFee;
  settlementAccount: BankAccount;
  balance: number;
}

export interface CreateEdcRequestDto {
  serialNumber: string;
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

export interface ListEdcRequestDto {
  merchantName?: string;
  serialNumber?: string;
  issuer?: string;
  ordering?: Array<string>;
  limit?: number;
  offset?: number;
}

export interface ListEdcResponseDto {
  count: number;
  prev?: string;
  next?: string;
  results: Array<GetEdcResponseDto>;
}
