import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
  nodeEnv: string;
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    origin: string;
  };
  api: {
    prefix: string;
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const getEnvVarAsInt = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is required`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
};

export const env: EnvConfig = {
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: getEnvVarAsInt('PORT', 3000),
  db: {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: getEnvVarAsInt('DB_PORT', 3306),
    name: getEnvVar('DB_NAME', 'appointment_system'),
    user: getEnvVar('DB_USER', 'root'),
    password: getEnvVar('DB_PASSWORD', ''),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'default_secret_change_in_production'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
  },
  cors: {
    origin: getEnvVar('CORS_ORIGIN', 'http://localhost:4200'),
  },
  api: {
    prefix: getEnvVar('API_PREFIX', '/api/v1'),
  },
};

export default env;
