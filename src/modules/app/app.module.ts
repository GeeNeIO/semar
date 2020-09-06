import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from '../customers/customers.module';
import { CustomersController } from '../customers/customers.controller';
import { CorrespondenceController } from '../customers/correspondence.controller';

@Module({
  imports: [CustomerModule],
  controllers: [
    AppController, 
    CustomersController, 
    CorrespondenceController],
  providers: [AppService],
})
export class AppModule {}
