import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';
import { BankAccountsService } from '../bank-accounts/bank-accounts.service';
import { EdcController } from './edc.controller';
import { EdcService } from './edc.service';
import { EdcModel } from './entities/edc.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      EdcModel,
    ]),
    BankAccountsModule,
  ],
  controllers: [EdcController],
  providers: [EdcService],
  exports: [EdcService],
})
export class EdcModule {}
