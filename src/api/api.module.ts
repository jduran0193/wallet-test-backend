import { Module } from '@nestjs/common';
import { EmailConfig } from '../config/email.config';
import { DatabaseModule } from '../database/database.module';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';

@Module({
  imports: [DatabaseModule],
  controllers: [WalletController],
  providers: [WalletService, EmailConfig],
})
export class ApiModule {}
