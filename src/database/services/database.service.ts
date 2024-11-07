import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClientDto, RechargeDto } from '../../common/dto/client.dto';
import { ErrorCode } from '../../common/enums/error-codes.enum';
import { IResponse } from '../../common/interfaces/response.interface';
import { Client } from '../schemas/client.schema';
import { Wallet } from '../schemas/wallet.schema';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  async createClient(createClientDto: CreateClientDto): Promise<IResponse> {
    try {
      const existingClient = await this.clientModel.findOne({
        document: createClientDto.document,
      });

      if (existingClient) {
        return {
          success: false,
          message: 'Client already exists',
          error: ErrorCode.CLIENT_EXISTS,
        };
      }

      const client = new this.clientModel(createClientDto);
      await client.save();

      const wallet = new this.walletModel({
        clientId: client._id,
        balance: 0,
      });
      await wallet.save();

      return {
        success: true,
        message: 'Client registered successfully',
        data: client,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error registering client: ${error}`,
        error: ErrorCode.INTERNAL_ERROR,
      };
    }
  }

  async rechargeWallet(rechargeDto: RechargeDto): Promise<IResponse> {
    try {
      const client = await this.clientModel.findOne({
        document: rechargeDto.document,
        phone: rechargeDto.phone,
      });

      if (!client) {
        return {
          success: false,
          message: 'Client not found',
          error: ErrorCode.CLIENT_NOT_FOUND,
        };
      }

      const wallet = await this.walletModel.findOne({ clientId: client._id });
      wallet.balance += rechargeDto.amount;
      await wallet.save();

      return {
        success: true,
        message: 'Wallet recharged successfully',
        data: { balance: wallet.balance },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error recharging wallet: ${error}`,
        error: ErrorCode.INTERNAL_ERROR,
      };
    }
  }

  async findClient(document: string, phone: string): Promise<Client | null> {
    return this.clientModel.findOne({ document, phone });
  }

  async saveToken(
    document: string,
    token: string,
    sessionId: string,
  ): Promise<IResponse> {
    try {
      const client = await this.clientModel.findOne({ document });
      if (!client) {
        throw new NotFoundException('Client not found');
      }

      const wallet = await this.walletModel.findOne({ clientId: client._id });
      wallet.token = token;
      wallet.sessionId = sessionId;
      wallet.tokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await wallet.save();

      return {
        success: true,
        message: 'Token saved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error saving token: ${error}`,
        error: ErrorCode.INTERNAL_ERROR,
      };
    }
  }

  async confirmPayment(sessionId: string, token: string): Promise<IResponse> {
    try {
      const wallet = await this.walletModel.findOne({
        sessionId: sessionId.toString(),
        token: token.toString(),
        tokenExpiration: { $gt: new Date() },
      });

      if (!wallet) {
        return {
          success: false,
          message: 'Invalid or expired token',
          error: ErrorCode.INVALID_TOKEN,
        };
      }

      return {
        success: true,
        message: 'Payment confirmed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error confirming payment ${error}`,
        error: ErrorCode.INTERNAL_ERROR,
      };
    }
  }

  async getBalance(document: string, phone: string): Promise<IResponse> {
    try {
      const client = await this.clientModel.findOne({ document, phone });
      if (!client) {
        return {
          success: false,
          message: 'Client not found',
          error: ErrorCode.CLIENT_NOT_FOUND,
        };
      }

      const wallet = await this.walletModel.findOne({ clientId: client._id });
      return {
        success: true,
        message: 'Balance retrieved successfully',
        data: { balance: wallet.balance },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving balance: ${error}`,
        error: ErrorCode.INTERNAL_ERROR,
      };
    }
  }

  async processPayment(sessionId: string, amount: number): Promise<IResponse> {
    try {
      const wallet = await this.walletModel.findOne({ sessionId });
      if (!wallet) {
        return {
          success: false,
          message: 'Wallet not found',
          error: ErrorCode.WALLET_NOT_FOUND,
        };
      }

      if (wallet.balance < amount) {
        return {
          success: false,
          message: 'Insufficient funds',
          error: ErrorCode.INSUFFICIENT_FUNDS,
        };
      }

      wallet.balance -= amount;
      wallet.token = null;
      wallet.sessionId = null;
      wallet.tokenExpiration = null;
      await wallet.save();

      return {
        success: true,
        message: 'Payment processed successfully',
        data: { newBalance: wallet.balance },
      };
    } catch (error) {
      return {
        success: false,
        message: `Error processing payment: ${error}`,
        error: ErrorCode.INTERNAL_ERROR,
      };
    }
  }
}
