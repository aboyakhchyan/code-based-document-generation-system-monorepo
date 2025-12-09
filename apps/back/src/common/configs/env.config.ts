export default () => ({
  api: {
    port: parseInt(process.env.API_PORT ?? '5500', 10),
    host: process.env.API_HOST ?? 'localhost',
    prefix: process.env.API_PREFIX,
  },
  client: {
    uri: process.env.CLIENT_URI,
  },
  db: {
    uri: process.env.DATABASE_URI,
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    default: process.env.DB_DEFAULT,
    ssl: /^(true|1)$/i.test(String(process.env.DB_SSL ?? 'false')),
  },
  jwt: {
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN,
    accessTtl: process.env.JWT_ACCESS_TTL,
    refreshTtl: process.env.JWT_REFRESH_TTL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    apiVersion: process.env.STRIPE_API_VERSION,
  },
  ollama: {
    host: process.env.OLLAMA_HOST,
    model: process.env.OLLAMA_MODEL,
    timeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS ?? '10000', 10),
  },
  mailer: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587', 10),
    secure: /^(true|1)$/i.test(String(process.env.SMTP_SECURE ?? 'false')),
    password: process.env.SMTP_PASSWORD,
    user: process.env.SMTP_USER,
  },
  nodeEnv: process.env.NODE_ENV,
});
