import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankAccountsService } from './bank-accounts.service';
import { GetBankAccountResponse, UpdateBankAccountRequest, UpdateBankAccountResponse } from './dto/bank-account.dto';
import { BankAccount } from './types/bank-account.types';

@Controller('bank-accounts')
export class BankAccountsController {

  constructor(
    private bankAccountsService: BankAccountsService,
  ) { }

  @Get(':fkTableName/id/:fkTableId')
  list(
    @Param() params: {
      fkTableName: string;
      fkTableId: string;
    },
  ): Observable<GetBankAccountResponse[]> {
    return this.bankAccountsService.getAccountByReference(
      params.fkTableName,
      params.fkTableId,
    );
  }

  @Put(':bankId')
  update(
    @Param('bankId') bankId: string, 
    @Body() data: UpdateBankAccountRequest
  ): Observable<UpdateBankAccountResponse> {
    return this.bankAccountsService.updateAccount(bankId, {
      ...data,
    });
  }

  @Delete(':bankId')
  delete(
    @Param('bankId') bankId: string,
  ): Observable<BankAccount> {
    return this.bankAccountsService.deleteAccount(bankId);
  }

  @Get(':bankId')
  get(
    @Param('bankId') bankId: string,
  ): Observable<BankAccount> {
    return this.bankAccountsService.getAccountById(bankId);
  }
}
