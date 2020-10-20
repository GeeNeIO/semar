import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { from, Observable, of, throwError } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { BankAccountModel } from './entities/bank-account.entity';
import { BankAccount, BankAccountData } from './types/bank-account.types';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectModel(BankAccountModel)
    private readonly bankAccountRepository: typeof BankAccountModel,
  ) { }

  createAccount(
    fkTableName: string,
    fkTableId: string,
    account: BankAccountData,
  ): Observable<BankAccount> {
    return from(this.bankAccountRepository.create({
      bankId: uuidv4(),
      fkTableName,
      fkTableId,
      ...account,
    })).pipe(
      map((accountRecord: BankAccountModel): BankAccount => ({
        bankId: accountRecord.bankId,
        accountName: accountRecord.accountName,
        accountNumber: accountRecord.accountNumber,
        bankName: accountRecord.bankName,
        createdTime: accountRecord.createdTime,
        updatedTime: accountRecord.updatedTime,
      }))
    );
  }

  updateAccount(
    bankId: string,
    account: BankAccountData,
  ): Observable<BankAccount> {
    return from(this.bankAccountRepository.update({
      ...account,
    }, {
      where: {
        bankId,
      },
      returning: true,
    })).pipe(
      flatMap(([total, accountRecord]): Observable<BankAccount> => (
        total === 0 ?
          throwError(new HttpException(
            'bank_account_not_found',
            HttpStatus.NOT_FOUND,
          )) :
          of({
            ...accountRecord[0].get(),
          })
      ))
    )
  }

  deleteAccount(bankId: string): Observable<BankAccount> {
    return this.getAccountById(bankId).pipe(
      flatMap((bankAccount: BankAccount): Observable<BankAccount> => (
        from(this.bankAccountRepository.destroy({
          where: {
            bankId,
          }
        })).pipe(
          map(() => bankAccount),
        )
      )),
    );
  }

  getAccountByIds(
    bankIds: string[],
  ): Observable<BankAccount[]> {
    return from(this.bankAccountRepository.findAll({
      where: {
        bankId: {
          [Op.in]: bankIds,
        },
      },
    })).pipe(
      map((accountRecords: BankAccountModel[]) => (
        accountRecords.map((b) => ({
          ...b,
        }))
      )),
    );
  }

  getAccountById(
    bankId: string,
  ): Observable<BankAccount> {
    return this.getAccountByIds([bankId]).pipe(
      map((results) => (
        results.length === 0 ?
          null :
          results[0]
      )),
    );
  }

  getAccountByReference(
    fkTableName: string,
    fkTableId: string
  ): Observable<BankAccount[]> {
    return from(this.bankAccountRepository.findAll({
      where: {
        fkTableName,
        fkTableId,
      },
    })).pipe(
      map((accountRecords: BankAccountModel[]): BankAccount[] => (
        accountRecords.map((record) => ({
          ...record,
        }))
      )),
    );
  }
}
