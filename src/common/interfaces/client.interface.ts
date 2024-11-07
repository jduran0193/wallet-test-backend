export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IClient {
  document: string;
  name: string;
  email: string;
  phone: string;
}

export interface IWallet {
  clientId: string;
  balance: number;
  sessionId?: string;
  token?: string;
  tokenExpiration?: Date;
}

export interface IBalanceResponse {
  balance: number;
}

export interface IPaymentResponse {
  sessionId: string;
}

export interface IConfirmPaymentResponse {
  newBalance: number;
}
