import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailConfig {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      auth: {
        user: this.configService.get('email.auth.user'),
        pass: this.configService.get('email.auth.pass'),
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const mailOptions = {
        from: this.configService.get('email.from'),
        to,
        subject,
        text,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendTokenEmail(to: string, token: string, sessionId: string) {
    const subject = 'Código de confirmación para tu transacción';
    const text = `Tu código de confirmación es: ${token}\nID de sesión: ${sessionId}`;
    const html = `
      <h2>Código de confirmación para tu transacción</h2>
      <p>Tu código de confirmación es: <strong>${token}</strong></p>
      <p>ID de sesión: <strong>${sessionId}</strong></p>
      <p>Este código expirará en 5 minutos.</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  getEmailConfig() {
    return {
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      user: this.configService.get('email.auth.user'),
      from: this.configService.get('email.from'),
    };
  }
}
