import { Module } from '@nestjs/common';
import { EdcModule } from '../edc/edc.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Fs from 'fs';
import * as Promise from 'bluebird';

const fsRead = Promise.promisify(Fs.readFile).bind(Fs);

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async () => {
        const dbConfigString = (await fsRead('config/sql.json')).toString();
        console.log(dbConfigString);
        const dbConfig = JSON.parse(dbConfigString);

        return {
          autoLoadModels: true,
          ...dbConfig[process.env.NODE_ENV || 'development'],
        }
      },
    }),
    EdcModule,
  ],
})
export class AppModule {}
