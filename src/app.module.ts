import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiModule } from './api/api.module';
import configuration from './config/configuration';
import { DatabaseConfig } from './config/database.config';
import { EmailConfig } from './config/email.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    DatabaseModule,
    ApiModule,
  ],
  providers: [EmailConfig],
  exports: [EmailConfig],
})
export class AppModule {}
