import { DataSource, DataSourceOptions } from 'typeorm';

const migrations = ['**/database/migrations/*.ts'];

let dbNames = { production: '', development: 'db.sqlite', test: 'test.sqlite' };

export const config: DataSourceOptions = {
  type: 'sqlite',
  database: dbNames[process.env.NODE_ENV],
  entities: ['**/*.entity.ts'],
  migrations,
  synchronize: false,
};

export const datasource = new DataSource(config);
