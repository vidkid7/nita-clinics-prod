import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';
const isTsRuntime = __filename.endsWith('.ts');

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'nita_user',
  password: process.env.DATABASE_PASSWORD || 'nita_password',
  database: process.env.DATABASE_NAME || 'nita_clinics_db',
  schema: process.env.DATABASE_SCHEMA || 'nita',
  entities: isTsRuntime ? ['src/**/*.entity.ts'] : ['dist/**/*.entity.js'],
  migrations: isTsRuntime
    ? ['src/database/migrations/*.ts']
    : ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: !isProduction,
  ssl: process.env.DATABASE_URL
    ? {
        rejectUnauthorized: false,
      }
    : false,
});
