import { IMailerConfig } from '@common/interfaces';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { resolve } from 'node:path';

const getMailerConfig = (configService: ConfigService) => {
  const { host, port, secure, password, user } =
    configService.getOrThrow<IMailerConfig>('mailer');

  return {
    transport: {
      host,
      port,
      secure,
      auth: {
        user,
        pass: password,
      },
    },
    template: {
      dir: resolve(process.cwd(), 'src/services/email/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};

export default getMailerConfig;
