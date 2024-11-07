import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enums/error-codes.enum';
import { v4 as uuidv4 } from 'uuid';
import {
  BalanceQueryDto,
  ConfirmPaymentDto,
  CreateClientDto,
  PaymentDto,
  RechargeDto,
} from '../../common/dto/client.dto';
import { IResponse } from '../../common/interfaces/response.interface';
import { EmailConfig } from '../../config/email.config';
import { DatabaseService } from '../../database/services/database.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly emailConfig: EmailConfig,
  ) {}

  async registerClient(createClientData: CreateClientDto): Promise<IResponse> {
    const client = await this.databaseService.findClient(
      createClientData.document,
      createClientData.phone,
    );
    if (client) {
      return {
        success: false,
        message: 'Client already exists',
        error: ErrorCode.CLIENT_EXISTS,
      };
    }
    return this.databaseService.createClient(createClientData);
  }

  async rechargeWallet(rechargeData: RechargeDto): Promise<IResponse> {
    const client = await this.databaseService.findClient(
      rechargeData.document,
      rechargeData.phone,
    );
    if (!client) {
      return {
        success: false,
        message: 'Client not found',
        error: ErrorCode.CLIENT_NOT_FOUND,
      };
    }
    return this.databaseService.rechargeWallet(rechargeData);
  }

  async initiatePayment(paymentData: PaymentDto): Promise<IResponse> {
    const client = await this.databaseService.findClient(
      paymentData.document,
      paymentData.phone,
    );
    if (!client) {
      return {
        success: false,
        message: 'Client not found',
        error: ErrorCode.CLIENT_NOT_FOUND,
      };
    }

    const token = Math.random().toString().substr(2, 6);
    const sessionId = uuidv4();

    await this.emailConfig.sendTokenEmail(client.email, token, sessionId);
    await this.databaseService.saveToken(client.document, token, sessionId);

    return {
      success: true,
      message: 'Token sent to email',
      data: { sessionId },
    };
  }

  async confirmPayment(confirmData: ConfirmPaymentDto): Promise<IResponse> {
    const tokenValidation = await this.databaseService.confirmPayment(
      confirmData.sessionId,
      confirmData.token,
    );

    if (!tokenValidation.success) {
      return tokenValidation;
    }

    return this.databaseService.processPayment(
      confirmData.sessionId,
      confirmData.amount,
    );
  }

  async getBalance(balanceData: BalanceQueryDto): Promise<IResponse> {
    const client = await this.databaseService.findClient(
      balanceData.document,
      balanceData.phone,
    );
    if (!client) {
      return {
        success: false,
        message: 'Client not found',
        error: ErrorCode.CLIENT_NOT_FOUND,
      };
    }
    return this.databaseService.getBalance(
      balanceData.document,
      balanceData.phone,
    );
  }
}
