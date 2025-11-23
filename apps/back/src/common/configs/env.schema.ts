import * as yup from 'yup';

export default yup.object().shape({
  API_PORT: yup
    .number()
    .typeError('API_PORT must be a number')
    .min(1, 'API_PORT must be between 1 and 65535')
    .max(65535, 'API_PORT must be between 1 and 65535')
    .required('API_PORT is required'),

  API_HOST: yup
    .string()
    .matches(
      /^([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})$/,
      'API_HOST must be a valid hostname or IP',
    )
    .required('API_HOST is required'),

  API_PREFIX: yup.string().required('API_PREFIX is required'),

  CLIENT_URI: yup.string().required('CLIENT_URI is required'),

  DATABASE_URI: yup.string().required('DATABASE_URI is required'),

  DB_HOST: yup
    .string()
    .matches(
      /^([a-zA-Z0-9.-]+|\d{1,3}(\.\d{1,3}){3})$/,
      'DB_HOST must be a valid hostname or IP',
    )
    .required('DB_HOST is required'),

  DB_PORT: yup
    .number()
    .typeError('DB_PORT must be a number')
    .min(1, 'DB_PORT must be between 1 and 65535')
    .max(65535, 'DB_PORT must be between 1 and 65535')
    .required('DB_PORT is required'),

  DB_USER: yup.string().required('DB_USER is required'),

  DB_PASSWORD: yup.string().required('DB_PASSWORD is required'),

  DB_DEFAULT: yup.string().required('DB_DEFAULT is required'),
  DB_NAME: yup.string().required('DB_NAME is required'),
  DB_SSL: yup.boolean().required('DB_SSL is required'),

  JWT_ACCESS_TOKEN: yup.string().required('JWT_ACCESS_TOKEN is required'),
  JWT_REFRESH_TOKEN: yup.string().required('JWT_REFRESH_TOKEN is required'),

  JWT_ACCESS_TTL: yup
    .string()
    .matches(/^\d+(s|m|h|d)$/, "JWT_ACCESS_TTL must be like '15m', '7d', '1h'")
    .required('JWT_ACCESS_TTL is required'),

  JWT_REFRESH_TTL: yup
    .string()
    .matches(/^\d+(s|m|h|d)$/, "JWT_REFRESH_TTL must be like '15m', '7d', '1h'")
    .required('JWT_REFRESH_TTL is required'),

  STRIPE_SECRET_KEY: yup
    .string()
    .matches(/^sk_/, "STRIPE_SECRET_KEY must start with 'sk_'")
    .required('STRIPE_SECRET_KEY is required'),

  STRIPE_WEBHOOK_SECRET: yup
    .string()
    .matches(/^whsec_/, "STRIPE_WEBHOOK_SECRET must start with 'whsec_'")
    .required('STRIPE_WEBHOOK_SECRET is required'),

  STRIPE_API_VERSION: yup.string().required('STRIPE_API_VERSION is required'),

  OLLAMA_HOST: yup
    .string()
    .url('OLLAMA_HOST must be a valid URL')
    .required('OLLAMA_HOST is required'),

  OLLAMA_MODEL: yup.string().required('OLLAMA_MODEL is required'),

  OLLAMA_TIMEOUT_MS: yup
    .number()
    .typeError('OLLAMA_TIMEOUT_MS must be a number')
    .min(100, 'OLLAMA_TIMEOUT_MS must be at least 100ms')
    .required('OLLAMA_TIMEOUT_MS is required'),

  MAIL_HOST: yup.string().required('MAIL_HOST is required'),

  MAIL_PORT: yup
    .number()
    .typeError('MAIL_PORT must be a number')
    .min(1)
    .max(65535)
    .required('MAIL_PORT is required'),

  MAIL_SECURE: yup
    .boolean()
    .typeError('MAIL_SECURE must be boolean (true/false)')
    .required('MAIL_SECURE is required'),

  MAIL_USER: yup.string().required('MAIL_USER is required'),

  MAIL_PASSWORD: yup.string().required('MAIL_PASSWORD is required'),

  MAIL_FROM: yup
    .string()
    .email('MAIL_FROM must be a valid email')
    .required('MAIL_FROM is required'),

  NODE_ENV: yup.string().required('NODE_ENV is required'),
});
