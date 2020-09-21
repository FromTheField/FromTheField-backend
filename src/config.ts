export const port = process.env.PORT;

export const corsUrl = process.env.CORS_URL;

export const environment = process.env.NODE_ENV;
export const logDirectory = process.env.LOG_DIR;

export const db = {
  dev: process.env.DB_DEV,
  prod: process.env.DB_PROD,
};
