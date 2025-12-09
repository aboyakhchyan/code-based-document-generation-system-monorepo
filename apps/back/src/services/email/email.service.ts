import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailerConfig } from '@common/interfaces';
import { CustomLogger } from '@services/logger';

@Injectable()
export class EmailService {
  private readonly user: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLogger,
  ) {
    const mailerConfig = this.configService.getOrThrow<IMailerConfig>('mailer');
    this.user = mailerConfig.user;
  }

  async sendVerificationCode(
    to: string,
    code: string,
    userName?: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: this.user,
        to,
        subject: 'Հաշիվը հաստատել',
        template: 'verify-account',
        context: {
          userName: userName || 'User',
          verificationCode: code,
        },
      });

      this.logger.log(
        `Verification code email sent successfully to ${to}`,
        'EmailService',
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification code email to ${to}: ${error.message}`,
        error.stack,
        'EmailService',
      );
      throw new InternalServerErrorException(
        error instanceof Error
          ? error.message
          : 'Failed to send verification email',
      );
    }
  }
}
