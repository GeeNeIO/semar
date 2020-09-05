import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customers/customers.module';
import { CorrespondenceController } from './correspondence/correspondence.controller';
import { CorrespondenceController } from './customer/correspondence/correspondence.controller';

@Module({
  imports: [CustomerModule],
  controllers: [AppController, CorrespondenceController],
  providers: [AppService],
})
export class AppModule {}
