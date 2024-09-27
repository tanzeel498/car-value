import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const migrations = ['**/database/migrations/*.ts'];

export const config: DataSourceOptions = {
  type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'sqlite',
  url: process.env.DB_URL,
  database: process.env.DB_NAME,
  entities: ['**/*.entity.ts'],
  migrations,
  synchronize: false,
};

export const datasource = new DataSource(config);
