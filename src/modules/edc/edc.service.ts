import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { forkJoin, from, Observable, of, throwError } from "rxjs";
import { catchError, flatMap, map, tap } from "rxjs/operators";
import { BankAccountsService } from "../bank-accounts/bank-accounts.service";
import { EdcModel } from "./entities/edc.entity";
import { Edc, EdcData } from "./types/edc.types";
import { v4 as uuidv4 } from 'uuid';
import { BankAccount, BankAccountData } from "../bank-accounts/types/bank-account.types";
import { ListEdcRequest } from "./dto/edc.dto";
import { FindOptions, Op } from "sequelize";
import * as R from 'ramda';

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
    return from(this.edcRepository.create({
      edcId,
      agentId: edcData.agentId,
      serialNumber: edcData.serialNumber,
      merchantName: edcData.merchantName,
      issuer: edcData.issuer,
      feeOnUs: edcData.fee.mdrOnUs,
      feeOffUs: edcData.fee.mdrOffUs,
      limitPerMonth: edcData.limitPerMonth,
    })).pipe(
      map((record: EdcModel): Edc => ({
        edcId: record.edcId,
        merchantName: record.merchantName,
        serialNumber: record.serialNumber,
        issuer: record.issuer,
        agentId: record.agentId,
        fee: {
          mdrOffUs: record.feeOffUs,
          mdrOnUs: record.feeOnUs,
        },
        limitPerMonth: record.limitPerMonth,
        settlementAccount: null,
        createdTime: record.createdTime,
        lastUpdatedTime: record.lastUpdatedTime,
      })),
    );
  }

  private createAccount(
    edcId: string, 
    accountData: BankAccountData,
  ): Observable<BankAccount> {
    return this.bankAccountsService.createAccount(
      REF_TABLE,
      edcId,
      accountData,
    );
  }

  private setAccount(
    edcId: string,
    settlementAccountBankId: string,
  ): Observable<EdcModel> {
    return from(this.edcRepository.update({
      bankAccountId: settlementAccountBankId,
    }, {
      where: {
        edcId,
      },
      returning: true,
    })).pipe(
      map(([total, record]) => record[0].get()),
    );
  }

  private updateEdcData(
    edcId: string,
    edcData: Partial<Omit<EdcData, 'settlementAccount'>>,
  ): Observable<EdcModel> {
    return from(this.edcRepository.update(R.pickBy(
      (val) => val !== undefined, {
        agentId: edcData.agentId,
        serialNumber: edcData.serialNumber,
        merchantName: edcData.merchantName,
        issuer: edcData.issuer,
        feeOnUs: edcData.fee?.mdrOnUs,
        feeOffUs: edcData.fee?.mdrOffUs,
        limitPerMonth: edcData.limitPerMonth,
    }), {
      where: {
        edcId,
      },
      returning: true
    })).pipe(
      map(([total, record]) => record[0].get()),
    );
  }

  private updateEdcAccountData(
    edcId: string,
    accountData: BankAccountData,
  ): Observable<BankAccount> {
    return this.bankAccountsService.updateAccountByReference(
      REF_TABLE,
      edcId,
      accountData,
    );
  }

  private deleteEdcDataAndAccount(
    edcId: string,
  ): Observable<boolean> {
    const accountDeletion$ = this.bankAccountsService.deleteAccountByReference(
      REF_TABLE,
      edcId,
    )
    const edcDeletion$ = from(this.edcRepository.destroy({
      where: {
        edcId,
      }
    }));

    return forkJoin(
      edcDeletion$,
      accountDeletion$,
    ).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
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
      tap((edc) => {
        if(edc === null) {
          throw new NotFoundException('edc_not_found');
        }
      }),
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
      tap(([edcRecord, _]) => {
        if(edcRecord === null) {
          throw new NotFoundException('edc_not_found');
        }
      }),
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
    const where =  [
      'agentId', 
      'merchantName', 
      'serialNumber', 
      'issuer'
    ].reduce((w, qname) => {
      if(query[qname] !== undefined) {
        if(query[qname].charAt(0) === '-') {
          w[qname] = {
            [Op.ne]: query[qname].substr(1),
          };
        } else {
          w[qname] = query[qname];
        }
      }
      return w;
    }, {});

    if(Object.keys(where).length > 0) {
      options.where = where;
    }

    const order = query?.ordering?.reduce((order, orderInput) => {
      if([
        'agentId', 
        'merchantName', 
        'serialNumber', 
        'issuer',
      ].filter((valid) => 
          valid === orderInput || `-${valid}` === orderInput
        ).length > 0) {
        const isAsc = orderInput.charAt(0) !== '-';
        const field = isAsc ? orderInput : orderInput.substr(1);
  
        order.push([field, isAsc ? 'ASC' : 'DESC']);
      }
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
