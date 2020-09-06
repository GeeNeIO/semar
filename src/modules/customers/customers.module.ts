import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CorrespondenceController } from './correspondence.controller';

@Module({
  controllers: [CustomersController, CorrespondenceController],
})
export class CustomerModule {}
