import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// Always load server/.env regardless of the process working directory.
dotenv.config({ path: path.resolve(here, '../../.env') });
