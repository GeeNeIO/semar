import { Module } from '@nestjs/common';
import { EdcModule } from '../edc/edc.module';
import { EdcController } from '../edc/edc.controller';

@Module({
  imports: [
    EdcModule,
  ],
  controllers: [
    EdcController,
  ],
})
export class AppModule {}
