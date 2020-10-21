import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountModel } from './entities/bank-account.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BankAccountModel,
    ]),
  ],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
