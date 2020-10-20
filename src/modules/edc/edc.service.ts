import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { forkJoin, from, Observable, of } from "rxjs";
import { flatMap, map, tap } from "rxjs/operators";
import { BankAccountsService } from "../bank-accounts/bank-accounts.service";
import { EdcModel } from "./entities/edc.entity";
import { Edc, EdcData } from "./types/edc.types";
import { v4 as uuidv4 } from 'uuid';
import { BankAccount, BankAccountData } from "../bank-accounts/types/bank-account.types";
import { ListEdcRequest } from "./dto/edc.dto";
import { BankAccountModel } from "../bank-accounts/entities/bank-account.entity";
import { FindOptions, Op } from "sequelize";

const REF_TABLE = `edc`;

@Injectable()
export class EdcService {
  constructor(
    @InjectModel(EdcModel)
    private readonly edcRepository: typeof EdcModel,
    private readonly bankAccountsService: BankAccountsService,
  ) { }

  private createEdcData(
    edcId: string, 
    edcData: Omit<EdcData, 'settlementAccount'>,
  ): Observable<Edc> {
    return of(null);
  }

  private createAccount(
    edcId: string, 
    accountData: BankAccountData,
  ): Observable<BankAccount> {
    return of(null);
  }

  private setAccount(
    edcId: string,
    settlementAccountBankId: string,
  ): Observable<EdcModel> {
    return of(null);
  }

  private updateEdcData(
    edcId: string,
    edcData: Partial<EdcData>,
  ): Observable<EdcModel> {
    return of(null);
  }

  private updateEdcAccountData(
    edcId: string,
    accountData: BankAccountData,
  ): Observable<BankAccountModel> {
    return of(null);
  }

  private deleteEdcDataAndAccount(
    edcId: string,
  ): Observable<boolean> {
    return of(false);
  }

  create(edcData: EdcData): Observable<Edc> {
    const edcId = uuidv4();
    const {
      settlementAccount,
      ...edc
    } = edcData;
    return this.createEdcData(edcId, edc).pipe(
      flatMap(() => this.createAccount(edcId, settlementAccount)),
      flatMap((account) => this.setAccount(edcId, account.bankId)),
      flatMap(() => this.get(edcId)),
    );
  }

  update(
    edcId: string, 
    edcData: Partial<EdcData>
  ): Observable<Edc> {
    const {
      settlementAccount,
      ...edcOnlyData
    } = edcData;

    return forkJoin(
      this.updateEdcData(edcId, edcOnlyData),
      this.updateEdcAccountData(edcId, settlementAccount),
    ).pipe(
      flatMap(() => this.get(edcId)),
    );
  }

  delete(edcId: string): Observable<Edc> {
    return this.get(edcId).pipe(
      tap(() => this.deleteEdcDataAndAccount(edcId)),
    );
  }

  get(edcId: string): Observable<Edc> {
    const edcRecord$ = from(this.edcRepository.findOne({
      where: {
        edcId,
      }
    })).pipe(
      map((edcRecord: EdcModel): EdcModel => edcRecord),
    );
    const accountData$ = this.bankAccountsService.getAccountByReference(
      REF_TABLE,
      edcId,
    );

    return forkJoin(
      edcRecord$,
      accountData$,
    ).pipe(
      map(([edcRecord, accountData]): Edc => ({
        edcId,
        agentId: edcRecord.agentId,
        merchantName: edcRecord.merchantName,
        serialNumber: edcRecord.serialNumber,
        issuer: edcRecord.issuer,
        fee: {
          mdrOffUs: edcRecord.feeOffUs,
          mdrOnUs: edcRecord.feeOnUs,
        },
        limitPerMonth: edcRecord.limitPerMonth,
        settlementAccount: accountData[0],
        createdTime: edcRecord.createdTime,
        lastUpdatedTime: edcRecord.lastUpdatedTime,
      })),
    );
  }

  private fillSettlementAccount(edcs: EdcModel[]): Observable<Edc[]> {
    const accountIds = Object.keys(edcs.reduce((accountIdMap, edc) => {
      accountIdMap[edc.bankAccountId] = 1;
      return accountIdMap;
    }, {}));

    return this.bankAccountsService.getAccountByIds(accountIds).pipe(
      map((accounts) => Object.assign({}, {
        ...accounts.reduce((accountMap, account) => {
          accountMap[account.bankId] = account;

          return accountMap;
        }, {}), 
      })),
      map((accountMap): Edc[] => edcs.map((edc) => ({
        edcId: edc.edcId,
        agentId: edc.agentId,
        merchantName: edc.merchantName,
        serialNumber: edc.serialNumber,
        issuer: edc.issuer,
        fee: {
          mdrOnUs: edc.feeOnUs,
          mdrOffUs: edc.feeOffUs,
        },
        limitPerMonth: edc.limitPerMonth,
        settlementAccount: accountMap[edc.bankAccountId],
        createdTime: edc.createdTime,
        lastUpdatedTime: edc.lastUpdatedTime,
      }))),
    );
  }

  createListQuery(query: ListEdcRequest): FindOptions {
    const options: FindOptions = {};
    options.where = {};
    
    ['agentId', 'merchantName', 'serialNumber', 'issuer'].forEach((qname) => {
      if(query[qname] && query[qname]?.length > 0) {
        if(query[qname].charAt(0) === '-') {
          options.where[qname] = {
            [Op.ne]: query[qname],
          };
        } else {
          options.where[qname] = query[qname];
        }
      }
    })

    if(Object.keys(options.where).length === 0) {
      delete options.where;
    }

    const order = query?.ordering?.reduce((order, orderInput) => {
      const isAsc = orderInput.charAt(0) !== '-';
      const field = isAsc ? order : orderInput.substr(1);

      order.push([field, isAsc ? 'ASC' : 'DESC']);

      return order;
    }, []);

    if(order && order.length > 0) {
      options.order = order;
    }

    if(query.limit) {
      options.limit = query.limit;
    }
    if(query.offset) {
      options.offset = query.offset;
    }

    return options;
  }

  list(query: ListEdcRequest): Observable<Edc[]> {
    const queryCondition = this.createListQuery(query);
    const edcList$ = from(this.edcRepository.findAll(queryCondition)).pipe(
      map((edcs: EdcModel[]): EdcModel[] => edcs)
    );

    return edcList$.pipe(
      flatMap((edcs) => this.fillSettlementAccount(edcs)),
    );
  }

  totalRows(query: ListEdcRequest): Observable<number> {
    const {
      limit,
      offset,
      ordering,
      ...whereClauseQuery
    } = query;
    const queryCondition = this.createListQuery(whereClauseQuery);
    return from(this.edcRepository.count(queryCondition)).pipe(
      map((total: number) => total),
    );
  }
}
