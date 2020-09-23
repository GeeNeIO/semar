import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { from, Observable, of, throwError } from 'rxjs';
import { flatMap, map, mergeMap } from 'rxjs/operators';
import { BankAccountModel } from './entities/bank-account.entity';
import { BankAccount } from './types/bank-account.types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectModel(BankAccountModel)
    private readonly bankAccountRepository: typeof BankAccountModel,
  ) { }

  createAccount(account: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    fkTableName: string;
    fkTableId: string;
  }): Observable<BankAccount> {
    return from(this.bankAccountRepository.create({
      bankId: uuidv4(),
      ...account,
    })).pipe(
      map((accountModel: BankAccountModel): BankAccount => ({
        bankId: accountModel.bankId,
        accountName: accountModel.bankName,
        accountNumber: accountModel.accountNumber,
        bankName: accountModel.bankName,
      })),
    );
  }

  updateAccount(
    bankId: string, 
    account: Partial<BankAccount>): Observable<BankAccount> {
    const { bankId: _, ...updatedFields } = account;
    return from(this.bankAccountRepository.update({
      ...updatedFields,
    }, {
      where: {
        bankId,
      },
      returning: true,
    })).pipe(
      flatMap(([total, data]): Observable<BankAccount> => (
        total === 0 ?
          throwError(new HttpException(
            'bank account not found', 
            HttpStatus.NOT_FOUND
          )) :
          of({
            bankId: data[0].bankId,
            accountName: data[0].accountName,
            accountNumber: data[0].accountNumber,
            bankName: data[0].bankName,
          })
      )),
    );
  }

  deleteAccount(bankId: string): Observable<BankAccount> {
    return this.getAccount(bankId).pipe(
      flatMap((bankAccount: BankAccount): Observable<BankAccount> => (
        from(this.bankAccountRepository.destroy({
          where: {
            bankId,
          }
        })).pipe(
          map(() => bankAccount)
        )
      ))  
    );
  }

  getAccount(bankId: string): Observable<BankAccount> {
    return from(this.bankAccountRepository.findOne({
      where: {
        bankId,
      }
    })).pipe(
      flatMap((bankAccountModel: BankAccountModel): Observable<BankAccount> => (
        bankAccountModel === null ?
          throwError(new HttpException(
            'bank account not found',
            HttpStatus.NOT_FOUND
          )) :
          of({
            bankId: bankAccountModel.bankId,
            accountName: bankAccountModel.accountName,
            accountNumber: bankAccountModel.accountNumber,
            bankName: bankAccountModel.bankName,
          })
      )),
    );
  }

  getAccounts(fkTableName: string, fkTableId: string): Observable<BankAccount[]> {
    return from(this.bankAccountRepository.findAll({
      where: {
        fkTableName,
        fkTableId,
      },
    })).pipe(
      map((bankAccountModels: BankAccountModel[]): BankAccount[] => (
        bankAccountModels.map((model) => ({
          bankId: model.bankId,
          accountName: model.accountNumber,
          accountNumber: model.accountNumber,
          bankName: model.bankName,
        }))
      )),
    );
  }
}
