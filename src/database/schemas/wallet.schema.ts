import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Wallet extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  clientId: Types.ObjectId;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ type: String, sparse: true })
  sessionId?: string;

  @Prop({ type: String, sparse: true })
  token?: string;

  @Prop({ type: Date })
  tokenExpiration?: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
