import { JwtModuleOptions } from '@nestjs/jwt';

const getJwtConfig = async (): Promise<JwtModuleOptions> => ({
  signOptions: {
    algorithm: 'HS256',
  },
  verifyOptions: {
    algorithms: ['HS256'],
    ignoreExpiration: true,
  },
});

export default getJwtConfig;
