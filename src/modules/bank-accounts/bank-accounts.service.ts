import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Observable, of } from 'rxjs';
import { BankAccountModel } from './entities/bank-account.entity';
import { BankAccount } from './types/bank-account.types';

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
    return of(null);
  }

  updateAccount(
    bankId: string, 
    account: Partial<BankAccount>): Observable<BankAccount> {
    return of(null);
  }

  deleteAccount(bankId: string): Observable<BankAccount> {
    return of(null);
  }

  getAccount(bankId: string): Observable<BankAccount> {
    return of(null);
  }

  getAccounts(fkTableName: string, fkTableId: string): Observable<BankAccount[]> {
    return of(null);
  }

}
