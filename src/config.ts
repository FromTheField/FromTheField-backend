export const port = process.env.PORT;

export const corsUrl = process.env.CORS_URL;

export const environment = process.env.NODE_ENV;
export const logDirectory = process.env.LOG_DIR;

export const db = {
  dev: process.env.DB_DEV,
  prod: process.env.DB_PROD,
};

export const tokenInfo = {
  accessTokenValidityDays: parseInt(process.env.ACCESS_TOKEN_VALIDITY_DAYS),
  refreshTokenValidityDays: parseInt(process.env.REFRESH_TOKEN_VALIDITY_DAYS),
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
};

export const GOOGLE_CALENDER = {
  credentials:process.env.GOOGLE_CREDENTIALS,
  calender_id:process.env.GOOGLE_CALENDER_ID,
}
