import { config } from '../config';
import * as fs from 'fs';

const CONFIG_FILE_NAME = 'ormconfig.json';
fs.writeFileSync(CONFIG_FILE_NAME, JSON.stringify(config.db));
