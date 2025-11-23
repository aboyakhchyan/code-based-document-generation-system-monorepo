export interface IEnv {
  api: IApiConfig;
  client: IClientConfig;
  db: IDatabaseConfig;
  jwt: IJWT;
  stripe: IStripeConfig;
  ollama: IOllamaConfig;
  mailer: IMailerConfig;
}

export interface IApiConfig {
  port: number;
  host: string;
  prefix: string;
}

export interface IDatabaseConfig {
  uri: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  default: string;
  ssl: boolean;
}

export interface IClientConfig {
  uri: string;
}

export interface IJWT {
  accessToken: string;
  refreshToken: string;
  accessTtl: string;
  refreshTtl: string;
}

export interface IStripeConfig {
  apiKey: string;
  webhookSecret: string;
  apiVersion: string;
}

export interface IOllamaConfig {
  host: string;
  model: string;
  timeoutMs: number;
}

export interface IMailerConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}
