import { DataSource, DataSourceOptions } from 'typeorm';

const migrations = ['**/database/migrations/*.ts'];

const databaseName =
  process.env.NODE_ENV === 'development' ? 'db.sqlite' : 'test.sqlite';

export const config: DataSourceOptions = {
  type: 'sqlite',
  database: databaseName,
  entities: ['**/*.entity.ts'],
  migrations,
  synchronize: false,
};

export const datasource = new DataSource(config);
