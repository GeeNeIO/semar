import { PartialType } from "@nestjs/mapped-types";
import { BankAccountData, GetBankAccountResponse } from "../../bank-accounts/dto/bank-account.dto";

export type EdcFee = {
  readonly mdrOnUs: number;
  readonly mdrOffUs: number;
}

export class EdcData {
  readonly agentId?: string;
  readonly serialNumber: string;
  readonly merchantName: string;
  readonly issuer: string;
  readonly fee: EdcFee;
  readonly settlementAccount: BankAccountData;
  readonly limitPerMonth: string;
}

export class GetEdcRequest {
  readonly edcId: string;  
}

export class GetEdcResponse extends EdcData {
  readonly edcId: string;
  readonly balance: number;
  readonly settlementAccount: GetBankAccountResponse;
  readonly createdTime: Date;
  readonly lastUpdatedTime: Date;
}

export class CreateEdcRequest extends EdcData {
}

export class CreateEdcResponse extends GetEdcResponse {
}

export class UpdateEdcRequest extends PartialType(EdcData) {
}

export class UpdateEdcResponse extends GetEdcRequest {
}

export class DeleteEdcRequest {
  readonly bankId: string;
}

export class DeleteEdcResponse extends GetEdcRequest {
}

export class ListEdcRequest {
  agentId?: string;
  merchantName?: string;
  serialNumber?: string;
  issuer?: string;
  ordering?: Array<string>;
  offset?: number;
  limit?: number;
}

export class ListEdcResponse {
  count: number;
  prev?: string;
  next?: string;
  results: Array<GetEdcResponse>;
}

