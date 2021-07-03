import { get } from 'config';
import joi from 'joi';
import { validate } from './utils/validate';

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
}
export interface AWSConfig {
  region: string;
  ses: {
    address: string;
  };
}

export interface Config {
  env: string;
  db: DatabaseConfig;
  aws: AWSConfig;
}

const databaseConfigSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  database: joi.string().required(),
  host: joi.string().required(),
  port: joi.number().required(),
  type: joi.string().required(),
  migrationsRun: joi.boolean(),
  migrationsTableName: joi.string(),
  synchronize: joi.boolean(),
  logging: joi.boolean(),
  migrations: joi
    .array()
    .items(joi.string())
    .required(),
  cli: joi.object({
    migrationsDir: joi.string().required(),
  }),
  entities: joi
    .array()
    .items(joi.string())
    .required(),
});

const awsConfigSchema = joi.object({
  region: joi.string().required(),
  ses: joi
    .object({
      address: joi
        .string()
        .email()
        .required(),
    })
    .required(),
});

const configSchema = joi.object({
  env: joi.string(),
  db: databaseConfigSchema,
  aws: awsConfigSchema,
});

const foundConfig = get('root');

export const config = validate<Config>(configSchema, foundConfig);
