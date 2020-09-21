import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { BankAccountCreateDTO, BankAccountUpdateDTO } from './dto/bank-account.dto';
import { BankAccount } from './types/bank-account.types';

@Controller('bank-accounts')
export class BankAccountsController {

  @Post(':fkTableName/id/:fkTableId')
  create(
    @Param() params: {
      fkTableName: string;
      fkTableId: string;
    }, 
    @Body() request: BankAccountCreateDTO,
  ): Observable<BankAccount> {
    return of(null);
  }

  @Put(':bankId')
  update(
    @Param('bankId') bankId: string, 
    @Body() data: BankAccountUpdateDTO): Observable<BankAccount> {
    return of(null);
  }

  @Delete(':bankId')
  delete(
    @Param('bankId') bankId: string;
  ): Observable<BankAccount> {
    return of(null);
  }

  @Get(':bankId')
  get(
    @Param('bankId') bankId: string;
  ): Observable<BankAccount> {
    return of(null);
  }
}
