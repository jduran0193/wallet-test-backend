import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  BalanceQueryDto,
  ConfirmPaymentDto,
  CreateClientDto,
  PaymentDto,
  RechargeDto,
} from '../../common/dto/client.dto';
import { IResponse } from '../../common/interfaces/client.interface';
import { WalletService } from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('register')
  async registerClient(
    @Body() clientData: CreateClientDto,
  ): Promise<IResponse> {
    return this.walletService.registerClient(clientData);
  }

  @Post('recharge')
  async rechargeWallet(@Body() rechargeData: RechargeDto): Promise<IResponse> {
    return this.walletService.rechargeWallet(rechargeData);
  }

  @Post('payment')
  async initiatePayment(@Body() paymentData: PaymentDto): Promise<IResponse> {
    return this.walletService.initiatePayment(paymentData);
  }

  @Post('confirm-payment')
  async confirmPayment(
    @Body() confirmationData: ConfirmPaymentDto,
  ): Promise<IResponse> {
    return this.walletService.confirmPayment(confirmationData);
  }

  @Get('balance')
  async getBalance(@Query() queryParams: BalanceQueryDto): Promise<IResponse> {
    return this.walletService.getBalance(queryParams);
  }
}
