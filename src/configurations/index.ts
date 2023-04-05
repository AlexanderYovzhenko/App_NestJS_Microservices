export default () => ({
  PORT: parseInt(process.env.PORT) || 4000,
  POSTGRES_DB: process.env.POSTGRES_DB || 'postgres',
  POSTGRES_USER: process.env.POSTGRES_USER || 'postgres',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'root',
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT) || 5432,
  DB_DIALECT: process.env.DB_DIALECT || 'postgres',
  SALT_ROUNDS: process.env.SALT_ROUNDS || '10',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret_key',
  LEVEL_LOG: process.env.LEVEL_LOG || 2,
});
